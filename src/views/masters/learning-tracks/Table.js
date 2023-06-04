import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash, Eye } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'

import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Form from './Form'
import {
  deleteLearningTrack,
  fetchLearningList,
  fetchLearningListById,
  selectLearningTrack,
  updateLearningTrackStatus,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DeleteModal from '../../../components/modals/deleteModal'
import { fetchAllSponsor } from '../sponsor/store'
import { fetchAllTrainer } from '../trainer/store'
import { fetchDepartmentsDropdown } from '../functions/store'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import BulkUploadModal from './BulkUploadModal'
import { hasPermission } from '../../../utility/Utils'
import { Switch } from '@mui/material'

function LearningTrack() {
  const {
    learningList,
    LearningListById,
    loader,
    totalPages,
    selected,
    params
  } = useSelector((state) => state?.learningTrack)
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [editLoader, setEditLoader] = useState(false)
  const [showUploadFileInput, setShowUploadFileInput] = useState(false)
  const [showFileInputField, setShowFileInputField] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleEditClick = async (data) => {
    const id = data?.id
    setEditLoader(true)
    await dispatch(fetchLearningListById(id))
    await dispatch(fetchAllTrainer())
    await dispatch(fetchAllSponsor())
    await dispatch(fetchDepartmentsDropdown())
    // await dispatch(selectLearningTrack(data))
    setShow(true)
    setIsEdit(true)
    setEditLoader(false)
    if (data.file) {
      setShowUploadFileInput(false)
      setShowFileInputField(true)
    } else {
      setShowUploadFileInput(true)
      setShowFileInputField(false)
    }
  }

  const handleDetailList = (row) => {
    const id = row?.id
    dispatch(fetchLearningListById(id))
  }

  const handleChange = async ({ id, isVisible }) => {
    dispatch(
      updateLearningTrackStatus({
        id,
        isVisible: !isVisible,
        params
      })
    )
  }

  const columns = [
    {
      name: 'Name',
      selector: 'learningTrack',
      width: '20%',
      sortable: false,
      selector: (row) => row.name,
      cell: (row) => <span className="text-capitalize">{row.name}</span>
    },
    {
      name: 'Start Date',
      selector: 'learningTrack',
      width: '15%',
      sortable: false,
      selector: (row) => row.startDate,
      cell: (row) => <span className="text-capitalize">{row.startDate}</span>
    },
    {
      name: 'End Date',
      selector: 'learningTrack',
      width: '15%',
      sortable: false,
      selector: (row) => row.endDate,
      cell: (row) => <span className="text-capitalize">{row.endDate}</span>
    },
    {
      name: 'Track Details',
      width: '15%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            <Link
              to="/learning-tracks-details"
              state={{ trackId: row.id }}
              className="user_name text-truncate text-body"
            >
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                //  onClick={ ( () => handleDetailList(row))}
              >
                <Eye className="font-medium-2" />
              </Button>
            </Link>
          </div>
        )
      }
    },
    {
      name: 'Status',
      minWidth: '15%',
      cell: (row) => {
        return (
          <div className="d-flex align-items-center permissions-actions">
            <Switch
              checked={row?.isVisible}
              onChange={(e) => handleChange(row)}
            />
          </div>
        )
      }
    },
    {
      name: 'Actions',
      width: '20%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            {hasPermission('LearningTrack_Update') && (
              <Button
                size="sm"
                color="transparent"
                disabled={editLoader}
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('LearningTrack_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectLearningTrack(row))
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
    return learningList
  }

  const addClick = async () => {
    setEditLoader(true)
    dispatch(fetchAllTrainer())
    await dispatch(fetchAllSponsor())
    await dispatch(fetchDepartmentsDropdown())
    setEditLoader(false)
    setShow(true)
    setIsEdit(false)
    setShowUploadFileInput(true)
    setShowFileInputField(false)
  }

  const importClick = () => {
    setShowBulkUploadModal(true)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchLearningList({
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
      fetchLearningList({
        pageSize: value,
        search: search,
        pageNo: 1
      })
    )
    dispatch(setPageSize(value))
    dispatch(setPageNo(1))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoader(true))
      dispatch(
        fetchLearningList({
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

  useEffect(() => {
    dispatch(setSearch(''))
  }, [])

  useEffect(() => {
    if (LearningListById.length) {
      navigate('user-learning-tracks-details')
    }
  }, [LearningListById])

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
    dispatch(selectLearningTrack(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteLearningTrack,
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
          pagination
          subHeader
          responsive
          highlightOnHover
          paginationServer
          progressComponent={<Spinner />}
          progressPending={loader}
          onRowClicked={(row) =>
            navigate('/learning-tracks-details', {
              state: { trackId: row.id }
            })
          }
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
              title="Learning Track List"
              addName="Add Learning Track"
              loader={editLoader}
              importName="Import"
              importBtn={true}
              importClick={importClick}
              permissions={hasPermission('LearningTrack_Add')}
            />
          }
        />
      </div>
      {show && (
        <Form
          show={show}
          setShow={setShow}
          isEdit={isEdit}
          showFileInputField={showFileInputField}
          setShowFileInputField={setShowFileInputField}
          showUploadFileInput={showUploadFileInput}
          setShowUploadFileInput={setShowUploadFileInput}
        />
      )}

      {showBulkUploadModal && (
        <BulkUploadModal
          showBulkUploadModal={showBulkUploadModal}
          setShowBulkUploadModal={setShowBulkUploadModal}
        />
      )}
    </>
  )
}

export default LearningTrack
