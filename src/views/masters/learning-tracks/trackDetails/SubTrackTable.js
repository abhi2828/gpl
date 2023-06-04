import { React, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { ChevronDown, Edit, Trash, Eye } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import CustomHeader from '../../../../utility/commonComponents/CustomHeader'
import CustomPagination from '../../../../utility/commonComponents/Pagination'
import {
  deleteSubTrack,
  fetchSubTrackList,
  selectSubTrack,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import { Button } from 'reactstrap'
import Spinner from '@components/spinner/Loading-spinner'
import DeleteModal from '../../../../components/modals/deleteModal'
import SubTrackForm from './SubTrackForm'
import { useLocation } from 'react-router-dom'

const SubTrackTable = ({ trackDetail }) => {
  const location = useLocation()
  const trackId = location?.state?.trackId

  const { id, subTrackEntity } = trackDetail
  const dispatch = useDispatch()
  const [data, setData] = useState(null)
  const [show, setShow] = useState(false)
  const [subTrackId, setSubTrackId] = useState(0)
  const [isEdit, setIsEdit] = useState(false)

  const { subTrackList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.subTrack
  )
  const { pageNo, pageSize, search } = params
  const [showDeleteModal, setDeleteModal] = useState(false)

  const handleEditClick = (row) => {
    setShow(true)
    setIsEdit(true)
    setSubTrackId(row.subtrackId)
    dispatch(selectSubTrack(row))
  }

  const addClick = async () => {
    setShow(true)
    setIsEdit(false)
  }

  const columns = [
    {
      name: 'SubTrack Name',
      width: '25%',
      sortable: false,
      selector: (row) => row.subtrackName,
      cell: (row) => <span className="text-capitalize">{row.subtrackName}</span>
    },
    {
      name: 'Start Date',
      width: '25%',
      sortable: false,
      cell: (row) => <span className="text-capitalize">{row.startDate}</span>
    },
    {
      name: 'End Date',
      width: '25%',
      sortable: false,
      cell: (row) => <span className="text-capitalize">{row.endDate}</span>
    },
    {
      name: 'Actions',
      width: '25%',
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
                dispatch(selectSubTrack(row))
                setDeleteModal(true)
                setSubTrackId(row.subtrackId)
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
    return subTrackList
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
  useEffect(() => {
    dispatch(setSearch(''))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoader(true))
      dispatch(
        fetchSubTrackList({
          learningTrackId: trackId,
          search: search
        })
      )
      dispatch(setPageNo(1))
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [search])

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
    dispatch(selectSubTrack(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteSubTrack,
    payload: {
      id: subTrackId,
      search,
      learningTrackId: id
    },
    closeDeleteModal,
    showDeleteModal
  }

  return (
    <>
      <DeleteModal {...deletePropsConfig}></DeleteModal>
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
          paginationComponent={renderPaginationComponent}
          subHeaderComponent={
            <CustomHeader
              showSearch={true}
              search={search}
              addClick={() => setShow(true)}
              handleSearch={(temp) => {
                dispatch(setSearch(temp)), console.log('temp', temp)
              }}
              addName="Add sub-track"
              title="SubTrack List"
              permissions={true}
            />
          }
        />
      </div>

      {show && (
        <SubTrackForm
          show={show}
          setShow={setShow}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          subTrackId={subTrackId}
        />
      )}
    </>
  )
}

export default SubTrackTable
