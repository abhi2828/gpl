import { React, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { ChevronDown, Edit, Trash, Eye } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import CustomHeader from '../../../../utility/commonComponents/CustomHeader'
import CustomPagination from '../../../../utility/commonComponents/Pagination'
import {
  deleteSponsor,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from '../store'
import { Button } from 'reactstrap'
import Spinner from '@components/spinner/Loading-spinner'
import DeleteModal from '../../../../components/modals/deleteModal'
import SponsorForm from './SponsorForm'
import { fetchAllSponsor } from '../../sponsor/store'
import { useLocation } from 'react-router-dom'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

const SponsorTable = ({ trackDetail }) => {
  const location = useLocation()
  const trackId = location?.state?.trackId

  const { id, subTrackEntity } = trackDetail
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [show, setShow] = useState(false)
  const [subTrackId, setSubTrackId] = useState(0)
  const [sponsorId, setSponsorId] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [editLoader, setEditLoader] = useState(false)
  const [rowData, setRowData] = useState()
  const { LearningListById, totalPages, selected, params } = useSelector(
    (state) => state?.learningTrack
  )
  const { loader } = useSelector((state) => state?.subTrack)
  const { pageNo, pageSize, search } = params
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [sponsorDel, setSponsorDel] = useState()

  const handleEditClick = async (row) => {
    setEditLoader(true)
    await dispatch(fetchAllSponsor())
    setShow(true)
    setIsEdit(true)
    setRowData(row)
    setSponsorId(row.sponsor_id)
    setEditLoader(false)
  }

  const addClick = async () => {
    setEditLoader(true)
    await dispatch(fetchAllSponsor())
    setShow(true)
    setIsEdit(false)
    setEditLoader(false)
  }

  const columns = [
    {
      name: 'Sponsor Name',
      width: '40%',
      sortable: false,
      selector: (row) => row.sponsorName,
      cell: (row) => <span className="text-capitalize">{row?.sponsorName}</span>
    },
    {
      name: 'Message',
      width: '40%',
      sortable: false,
      selector: (row) => row.sponsorMessage,
      cell: (row) =>
        row?.sponsorMessage?.length > 5 ? (
          <OverlayTrigger
            placement="auto"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip">{row?.sponsorMessage}</div>
              </Tooltip>
            }
          >
            <span className="table_row description">{row?.sponsorMessage}</span>
          </OverlayTrigger>
        ) : (
          <span>{row?.sponsorMessage}</span>
        )
    },

    {
      name: 'Actions',
      width: '20%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => handleEditClick(row)}
            >
              <Edit className="font-medium-2" />
            </Button>
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => {
                // dispatch(selectSubTrack(row))
                setDeleteModal(true)
                setSponsorDel(row.id)
              }}
            >
              <Trash className="font-medium-2" />
            </Button>
          </div>
        )
      }
    }
  ]

  const dataToRender = () => {
    return LearningListById.trackSponsors
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchSubTrackList({
        learningTrackId: trackId,
        pageNo: page?.selected + 1,
        pageSize,
        search: search
      })
    )
    dispatch(setPageNo(page?.selected + 1))
  }

  const handlePageSizeChange = (e) => {
    const value = parseInt(e.currentTarget.value)
    dispatch(setLoader(true))
    dispatch(
      fetchSubTrackList({
        learningTrackId: trackId,
        pageSize: value,
        search: search,
        pageNo: 1
      })
    )
    dispatch(setPageSize(value))
    dispatch(setPageNo(1))
  }

  const renderPaginationComponent = () => {
    return (
      <CustomPagination
        pageProps={{ pageNo, pageSize, totalPages }}
        handlePageNoChange={handlePageNoChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    )
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteSponsor,
    payload: {
      id: sponsorDel,
      pageNo,
      pageSize,
      search,
      learningTrackId: id
    },
    closeDeleteModal,
    showDeleteModal
  }

  return (
    <>
      <DeleteModal {...deletePropsConfig}></DeleteModal>
      <p>
        {editLoader && (
          <p>
            <Spinner />
          </p>
        )}
      </p>
      <div className="react-dataTable">
        <DataTable
          // pagination
          subHeader
          responsive
          highlightOnHover
          paginationServer
          progressComponent={<Spinner />}
          progressPending={loader}
          columns={columns}
          data={dataToRender()}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          sho
          // paginationComponent={renderPaginationComponent
          subHeaderComponent={
            <CustomHeader
              search={search}
              addClick={addClick}
              handleSearch={(temp) => {
                dispatch(setSearch(temp)), console.log('temp', temp)
              }}
              addName="Add Sponsor"
              title="Sponsor List"
              permissions={true}
            />
          }
        />
      </div>

      {show && (
        <SponsorForm
          show={show}
          setShow={setShow}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          sponsorId={sponsorId}
          rowData={rowData}
        />
      )}
    </>
  )
}

export default SponsorTable
