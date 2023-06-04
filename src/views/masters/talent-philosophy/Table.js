import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'
import { Eye } from 'react-feather'

import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Form from './Form'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DeleteModal from '../../../components/modals/deleteModal'
import ViewImage from '../../../utility/commonComponents/ViewImage'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import FileView from './FileView'
import {
  fetchCareerTracksList,
  selectCareerTracks,
  setPageNo,
  setPageSize,
  setLoader,
  deleteCareerTracks,
  setSearch
} from './store'

function TalentPhilosophy() {
  const { careerTracksList, loader, totalPages, selected, params } =
    useSelector((state) => state?.talentPhilosophy)
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [viewImage, setViewImage] = useState(false)
  const [fileShow, setFileShow] = useState(false)
  const dispatch = useDispatch()
  const [showUploadFileInput, setShowUploadFileInput] = useState(false)
  const [showFileInputField, setShowFileInputField] = useState(true)

  const getFileName = selected

  const handleEditClick = async (data) => {
    setShow(true)
    dispatch(selectCareerTracks(data))
    if (data.file) {
      setShowUploadFileInput(false)
      setShowFileInputField(true)
    } else {
      setShowUploadFileInput(true)
      setShowFileInputField(false)
    }
  }

  const handleModalOpen = async (data) => {
    await dispatch(selectCareerTracks(data))
    setViewImage(true)
  }

  const handleFileView = (fileName) => {
    dispatch(selectCareerTracks(fileName))
    setFileShow(true)
  }

  const columns = [
    {
      name: 'Function Name',
      id: 'name',
      selector: 'talent-philosophy',
      width: '20%',
      sortable: false,
      selector: (row) => row?.name,
      cell: (row) => <span className="text-capitalize ">{row?.name}</span>
    },
    {
      name: 'Image Url',
      selector: 'imgUrl',
      width: '20%',
      sortable: false,
      selector: (row) => row?.imageUrl,
      cell: (row) =>
        row?.imageUrl?.length > 5 ? (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip ">{row?.imageUrl}</div>
              </Tooltip>
            }
          >
            <span className="text-capitalize table_row ">{row?.imageUrl}</span>
          </OverlayTrigger>
        ) : (
          <span className="text-capitalize ">{row?.imageUrl}</span>
        )
    },
    {
      name: 'Image View',
      selector: 'imgView',
      width: '14%',
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
          </div>
        )
      }
    },
    {
      name: 'PDF File',
      selector: 'pdf',
      width: '20%',
      sortable: false,
      selector: (row) => row?.file,
      cell: (row) =>
        row?.file?.length > 5 ? (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip">{row?.file}</div>
              </Tooltip>
            }
          >
            <span className="text-capitalize table_row ">{row?.file}</span>
          </OverlayTrigger>
        ) : (
          <span className="text-capitalize">{row?.file}</span>
        )
    },
    {
      name: 'Pdf View',
      selector: 'pdfView',
      width: '12%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => handleFileView(row.file)}
            >
              <Eye className="font-medium-2" />
            </Button>
          </div>
        )
      }
    },
    {
      name: 'Actions',
      width: '13%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            {/* {hasPermission('TopicEdit') && ( */}
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => handleEditClick(row)}
            >
              <Edit className="font-medium-2" />
            </Button>
            {/* )}
            {hasPermission('TopicDelete') && ( */}
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => {
                dispatch(selectCareerTracks(row))
                setDeleteModal(true)
              }}
            >
              <Trash className="font-medium-2" />
            </Button>
            {/* )} */}
          </div>
        )
      }
    }
  ]

  const dataToRender = () => {
    return careerTracksList
  }

  const addClick = () => {
    setShow(true)
    setShowUploadFileInput(true)
    setShowFileInputField(false)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchCareerTracksList({
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
      fetchCareerTracksList({
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
        fetchCareerTracksList({
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
    dispatch(selectCareerTracks(null))
    setViewImage(false)
  }

  const closeDeleteModal = () => {
    dispatch(selectCareerTracks(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteCareerTracks,
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
          noHeader
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
              title="Career Tracks List"
              addName="Add Career Tracks"
              permissions={true}
            />
          }
        />
        {fileShow && (
          <FileView
            fileShow={fileShow}
            setFileShow={setFileShow}
            getFileName={getFileName}
          />
        )}
      </div>
      {show && (
        <Form
          show={show}
          setShow={setShow}
          showFileInputField={showFileInputField}
          setShowFileInputField={setShowFileInputField}
          showUploadFileInput={showUploadFileInput}
          setShowUploadFileInput={setShowUploadFileInput}
        />
      )}
    </>
  )
}

export default TalentPhilosophy
