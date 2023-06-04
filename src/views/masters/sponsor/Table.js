import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash, Eye } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'

import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Form from './Form'
import {
  deleteSponsor,
  fetchSponsorList,
  selectSponsor,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DeleteModal from '../../../components/modals/deleteModal'
import ViewImage from '../../../utility/commonComponents/ViewImage'
import { OverlayTrigger } from 'react-bootstrap'
import Tooltip from '@mui/material/Tooltip'
import { hasPermission } from '../../../utility/Utils'

function SponsorMaster() {
  const { sponsorList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.sponsorMaster
  )
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [viewImage, setViewImage] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch()

  const handleEditClick = async (data) => {
    setShow(true)
    dispatch(selectSponsor(data))
  }
  const handleModalOpen = async (data) => {
    await dispatch(selectSponsor(data))
    setViewImage(true)
  }
  const columns = [
    {
      name: 'Name',
      width: '20%',
      sortable: false,
      selector: (row) => row?.sponsorName,
      cell: (row) => (
        <span className="text-capitalize fw-light">
          {row?.sponsorName ? row?.sponsorName : '-'}
        </span>
      )
    },
    {
      name: 'Designation',
      width: '20%',
      sortable: false,
      selector: (row) => row?.designationName,
      cell: (row) => (
        <span className="text-capitalize">
          {row?.designationName ? row?.designationName : '-'}
        </span>
      )
    },
    {
      name: 'User',
      width: '15%',
      sortable: false,
      selector: (row) => row.userName,
      cell: (row) => (
        <span className="text-capitalize">
          {row?.userName ? row?.userName : '-'}
        </span>
      )
    },
    {
      name: 'Description',
      width: '30%',
      sortable: false,
      selector: (row) => row?.description,
      cell: (row) =>
        row?.description?.length > 40 ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip className="trainer-tooltip">
                <div className="toolTip">{row.description}</div>
              </Tooltip>
            }
          >
            <span className="table_row">{row.description}</span>
          </OverlayTrigger>
        ) : (
          <span>{row.description}</span>
        )
    },
    {
      name: 'Actions',
      width: '15%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => handleModalOpen(row)}
            >
              <Eye className="font-medium-2" />
            </Button>
            {hasPermission('Sponsor_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Sponsor_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectSponsor(row))
                  setDeleteModal(true)
                }}
              >
                <Trash className="font-medium-2" />
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  const dataToRender = () => {
    return sponsorList
  }

  const addClick = () => {
    setShow(true)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchSponsorList({
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
      fetchSponsorList({
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
        fetchSponsorList({
          pageNo: 1,
          pageSize,
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

  const handleModalClosed = () => {
    dispatch(selectSponsor(null))
    setViewImage(false)
  }
  const closeDeleteModal = () => {
    dispatch(selectSponsor(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteSponsor,
    payload: {
      id: selected?.id,
      pageNo,
      pageSize,
      search
    },
    closeDeleteModal,
    showDeleteModal
  }
  return (
    <>
      <ViewImage
        viewImage={viewImage}
        handleModalClosed={handleModalClosed}
        url={selected?.imageUrl}
      />
      <DeleteModal {...deletePropsConfig}></DeleteModal>
      <div className="react-dataTable">
        <DataTable
          pagination
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
          paginationComponent={renderPaginationComponent}
          subHeaderComponent={
            <CustomHeader
              search={search}
              showSearch={true}
              handleSearch={(temp) => dispatch(setSearch(temp))}
              addClick={addClick}
              title="Sponsor List"
              addName="Add Sponsor"
              permissions={hasPermission('Sponsor_Add')}
            />
          }
        />
      </div>
      {show && <Form show={show} setShow={setShow} />}
    </>
  )
}

export default SponsorMaster
