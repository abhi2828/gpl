import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash, Eye } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'

import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Form from './Form'
import {
  deleteTrainer,
  fetchTrainerList,
  selectTrainer,
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
import { hasPermission } from '../../../utility/Utils'
import Tooltip from '@mui/material/Tooltip'

function TrainerMaster() {
  const { trainerList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.trainerMaster
  )
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [viewImage, setViewImage] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch()

  const handleEditClick = async (data) => {
    await dispatch(selectTrainer(data))
    setShow(true)
  }
  const handleModalOpen = async (data) => {
    await dispatch(selectTrainer(data))
    setViewImage(true)
  }

  const columns = [
    {
      name: 'Name',
      width: '20%',
      sortable: false,
      selector: (row) => row.trainerName,
      cell: (row) => (
        <span className="text-capitalize">
          {row.trainerName ? row.trainerName : '-'}
        </span>
      )
    },
    {
      name: 'Designation',
      width: '20%',
      sortable: false,
      selector: (row) => row.designation,
      cell: (row) => (
        <span className="text-capitalize">
          {row?.designation ? row?.designation : '-'}
        </span>
      )
    },
    {
      name: 'User',
      width: '10%',
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
      selector: (row) => row.description,
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
      width: '20%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            {/* {hasPermission('TopicEdit') && ( */}
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => handleModalOpen(row)}
            >
              <Eye className="font-medium-2" />
            </Button>
            {hasPermission('Trainer_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Trainer_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectTrainer(row))
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
    return trainerList
  }

  const addClick = () => {
    setShow(true)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchTrainerList({
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
      fetchTrainerList({
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
        fetchTrainerList({
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
    dispatch(selectTrainer(null))
    setViewImage(false)
  }
  const closeDeleteModal = () => {
    dispatch(selectTrainer(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteTrainer,
    payload: {
      id: selected?.trainerId,
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
      <DeleteModal {...deletePropsConfig} />
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
              showSearch={true}
              search={search}
              handleSearch={(temp) => dispatch(setSearch(temp))}
              addClick={addClick}
              title="Trainer List"
              addName="Add Trainer"
              permissions={hasPermission('Trainer_Add')}
            />
          }
        />
      </div>
      {show && <Form show={show} setShow={setShow} />}
    </>
  )
}

export default TrainerMaster
