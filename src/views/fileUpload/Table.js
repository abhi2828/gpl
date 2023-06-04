import { React, useState, useEffect } from 'react'
import { Trash, Edit, ChevronDown, Copy } from 'react-feather'
import toast from 'react-hot-toast'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'
import FileUpload from './FileUpload'
import Form from './Form'
import '../../../src/common.css'
import {
  getFileData,
  deleteFile,
  selectFile,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../utility/commonComponents/Pagination'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import axios from 'axios'
import DeleteModal from '../../components/modals/deleteModal'
import { baseUrl } from '../../app.config'

function Table() {
  const { fileUploadList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.fileUpload
  )

  const [show, setShow] = useState(false)
  const { pageNo, pageSize, search } = params
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [showEnrollBulkUpload, setShowEnrollBulkUpload] = useState(false)
  const [copied, setCopied] = useState(false)
  const dispatch = useDispatch()

  const handleButtonClick = (e, id) => {
    e.preventDefault()
  }

  const importClick = () => {
    setShowEnrollBulkUpload(true)
  }

  const exportClick = async () => {
    //  dispatch(CareerAspirationExport())
    await axios.get(baseUrl() + '/enrollNow/export')
  }
  const closeDeleteModal = () => {
    // dispatch(selectBanner(null))
    setDeleteModal(false)
  }

  const onCopy = () => {
    setCopied(true)
    toast.success('Copied To Clipboard !')
  }

  const columns = [
    {
      name: 'File Name',
      minWidth: '40%',
      sortable: false,
      cell: (row) => <span className="text-capitalize">{row?.filename}</span>
    },

    {
      name: 'File URL',
      minWidth: '60%',
      sortable: false,
      cell: (row) => (
        <>
          <CopyToClipboard
            onCopy={onCopy}
            className="clip"
            text={row?.originalName}
          >
            <Button color="#7367f0 " outline size="sm">
              <Copy className="font-medium-2" color="#7367f0" />
            </Button>
          </CopyToClipboard>
          {row?.originalName.length > 5 ? (
            <OverlayTrigger
              placement="bottom"
              overlay={
                <Tooltip id="toolTip">
                  <div className="toolTip">{row?.originalName}</div>
                </Tooltip>
              }
            >
              <span className=" fu-url text-capitalize table_row description">
                {row?.originalName}
              </span>
            </OverlayTrigger>
          ) : (
            <span className="text-capitalize">{row?.originalName}</span>
          )}
        </>
      )
    }

    // {
    //   name: 'Actions',
    //   width: '20%',
    //   cell: (row) => {
    //     return (
    //       <div className="align-items-center permissions-actions" style={{marginLeft:10 ,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
    //           <Button
    //             size="sm"
    //             color="transparent"
    //             className="btn btn-icon "
    //             onClick={() => {
    //               dispatch(selectFile(row))
    //               setDeleteModal(true)
    //             }}
    //           >
    //             <Trash className="font-medium-2" />
    //           </Button>

    //       </div>
    //     )
    //   }
    // }
  ]

  const dataToRender = () => {
    return fileUploadList
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      getFileData({
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
      getFileData({
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
        getFileData({
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

  const addClick = () => {
    setShow(true)
  }
  const deletePropsConfig = {
    deletefunc: deleteFile,
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
              title="File Upload"
              // isRequired={false}
              importName="File Upload"
              importBtn={true}
              importClick={importClick}
            />
          }
        />
      </div>

      {showEnrollBulkUpload && (
        <FileUpload
          showEnrollBulkUpload={showEnrollBulkUpload}
          setShowEnrollBulkUpload={setShowEnrollBulkUpload}
        />
      )}
    </>
  )
}

export default Table
