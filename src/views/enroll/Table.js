import { React, useState, useEffect } from 'react'
import {
  CheckCircle,
  ChevronDown,
  Edit,
  Eye,
  PauseCircle,
  Slash,
  Trash,
  Trash2,
  X
} from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'
import '../../../src/common.css'
import Form from './Form'
import {
  getEnrollData,
  getEnrollStatus,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../utility/commonComponents/Pagination'
import EnrollBulkUpload from './EnrollBulkUpload'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import axios from 'axios'
import { baseUrl } from '../../app.config'
import { utils, writeFile } from 'xlsx'
import ConfirmModal from '../../components/modals/confirmationModal'

function Table() {
  const { enrollList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.enroll
  )

  const [show, setShow] = useState(false)
  const { pageNo, pageSize, search } = params
  const [showEnrollBulkUpload, setShowEnrollBulkUpload] = useState(false)
  const [confirmModal, setConfirmModaModal] = useState(false)
  const [statusValue, setStatusValue] = useState()
  const dispatch = useDispatch()

  const handleButtonClick = (e, id) => {
    e.preventDefault()
  }

  const importClick = () => {
    setShowEnrollBulkUpload(true)
  }

  const exportClick = async () => {
    try {
      const response = await axios.get(baseUrl() + '/enrollNow/export')
      const data = response.data
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
      const downloadLink = document.createElement('a')
      downloadLink.setAttribute('href', URL.createObjectURL(blob))
      downloadLink.setAttribute('download', 'enroll_now_information.csv')
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click() // Trigger download
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error(error)
    }
  }

  const statusUpdate = async (id, status) => {
    const payload = {
      id: id?.id,
      params: {
        enrollStatus: status,
        pageNo: 1,
        pageSize,
        search
      }
    }
    const result = await dispatch(getEnrollStatus(payload))
    if (result) {
      closeDeleteModal()
    }
  }

  const columns = [
    {
      name: 'Name of Employee',
      minWidth: '20%',
      // sortable: true,
      cell: (row) => <span className="text-capitalize">{row?.userName}</span>
    },
    {
      name: 'Email',
      minWidth: '33%',
      // sortable: true,
      cell: (row) => <span>{row?.email}</span>
    },
    {
      name: 'Status',
      minWidth: '12%',
      // sortable: true,
      cell: (row) => (
        <span className="text-capitalize">{row?.enrollStatus}</span>
      )
    },

    // {
    //   name: 'Function',
    //   minWidth: '200px',
    //   sortable: true,
    //   cell: (row) => <span className="text-capitalize">{row?.functionName}</span>
    // },
    // {
    //   name: 'Designation',
    //   minWidth: '200px',
    //   sortable: true,
    //   cell: (row) => <span className="text-capitalize">{row.designation}</span>
    // },

    {
      name: 'Track Name',
      minWidth: '15%',
      // sortable: true,
      cell: (row) => <span className="text-capitalize">{row?.trackName}</span>
    },
    // {
    //   name: 'Time Stamp Of Enrollment',
    //   minWidth: '250px',
    //   sortable: true,
    //   cell: (row) => <span className="text-capitalize">{row.enrollTimeStamp}</span>
    // },

    {
      name: 'Action',
      width: '15%',
      sortable: false,
      selector: 'action',
      cell: (id) => (
        <>
          <OverlayTrigger
            trigger="hover"
            placement="bottom"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip">ACCEPT</div>
              </Tooltip>
            }
          >
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              disabled={
                id.enrollStatus === 'ACCEPT' ||
                (id.enrollStatus === 'REJECT' && id.enrollStatus !== 'HOLD')
              }
              onClick={() => {
                setStatusValue({ id, status: 'ACCEPT' })
                setConfirmModaModal(true)
              }}
            >
              <CheckCircle className="font-medium-1" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            trigger="hover"
            placement="bottom"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip">HOLD</div>
              </Tooltip>
            }
          >
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              disabled={
                id.enrollStatus === 'HOLD' ||
                id.enrollStatus === 'ACCEPT' ||
                id.enrollStatus === 'REJECT'
              }
              onClick={() => {
                setStatusValue({ id, status: 'HOLD' })
                setConfirmModaModal(true)
              }}
            >
              <PauseCircle className="font-medium-1" />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            trigger="hover"
            placement="bottom"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip">REJECT</div>
              </Tooltip>
            }
          >
            <Button
              size="sm"
              color="transparent"
              disabled={
                id.enrollStatus === 'ACCEPT' ||
                (id.enrollStatus === 'REJECT' && id.enrollStatus !== 'HOLD')
              }
              className="btn btn-icon"
              onClick={() => {
                setStatusValue({ id, status: 'REJECT' })
                setConfirmModaModal(true)
              }}
            >
              <Slash className="font-medium-1" />
            </Button>
          </OverlayTrigger>
        </>
      ),
      minWidth: '300px',
      center: true
    }
  ]

  const dataToRender = () => {
    return enrollList
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      getEnrollData({
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
      getEnrollData({
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
        getEnrollData({
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
  const closeDeleteModal = () => {
    setConfirmModaModal(false)
  }
  const addClick = () => {
    setShow(true)
  }

  return (
    <>
      {confirmModal && (
        <ConfirmModal
          statusValue={statusValue}
          closeDeleteModal={closeDeleteModal}
          confirmModal={confirmModal}
          statusUpdate={statusUpdate}
        />
      )}
      <div className="react-dataTable attendance-table">
        <DataTable
          noHeader
          pagination
          subHeader
          responsive
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
              handleSearch={(temp) => dispatch(setSearch(temp))}
              showSearch={true}
              showAddButton={false}
              // addClick={addClick}
              title="Enroll List"
              exportName="Export"
              exportBtn={true}
              exportClick={exportClick}
              // isRequired={false}
              importName="Import"
              importBtn={true}
              importClick={importClick}
            />
          }
        />
      </div>

      {showEnrollBulkUpload && (
        <EnrollBulkUpload
          showEnrollBulkUpload={showEnrollBulkUpload}
          setShowEnrollBulkUpload={setShowEnrollBulkUpload}
        />
      )}
    </>
  )
}

export default Table
