import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash, Star } from 'react-feather'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
// import { Columns } from './column'
import DeleteModal from '../../components/modals/deleteModal'
import { DeleteIcon } from '../../components/modals/icons'
import { Switch } from '@mui/material'
import AttendanceBulkUpload from './AttendanceBulkUpload'

import {
  deleteAttendance,
  selectAttendance,
  fetchAllAttendance,
  setPageNo,
  setLoader,
  setSearch,
  setPageSize,
  getAttendanceDetail,
  getAttendanceData
} from './store'
import { useSelector, useDispatch } from 'react-redux'
import { CustomPagination } from './../../utility/commonComponents/Pagination'
import Form from './Form'

const Table = () => {
  const { AttendanceList, totalPages, loader, selected, params } = useSelector(
    (state) => state?.attendance
  )
  const [show, setShow] = useState(false)
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false)
  const { pageNo, pageSize, search } = params
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const dispatch = useDispatch()
  // const [deletePayload, setDeletePayload] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const handleEditClick = async (data) => {
    await dispatch(getAttendanceDetail({ id: data?.id }))
    setShow(true)
    setIsEdit(true)
  }

  // const openDeleteModal = (id) => {
  //   setIsDeleteModal(true)
  //   setDeletePayload({
  //     id: id
  //     // pageNo: store.params?.pageNo,
  //     // pageSize: store.params?.pageSize,
  //     // search: searchTerm
  //   })
  // }

  // const closeDeleteModal = () => {
  //   dispatch(selectAttendance(null))
  //   setDeleteModal(false)
  //   // setIsDeleteModal(false)
  //   // setDeleteId(null)
  // }

  // const deletePropsConfig = {
  //   deletefunc: deleteAttendance,
  //   // payload: deletePayload,
  //   payload: {
  //     id: selected?.id,
  //     pageNo,
  //     pageSize,
  //     search
  //   },
  //   closeDeleteModal,
  //   showDeleteModal
  //   // isDeleteModal
  // }

  const columns = [
    {
      name: 'Date',
      minWidth: '100px',
      sortable: false,
      selector: (row) => row.date,
      cell: (row) => <span className="text-capitalize">{row.date}</span>
    },
    // {
    //   name: 'Time Stamp',
    //   minWidth: '200px',
    //   sortable: false,
    //   selector: (row) => row.createdAt,
    //   cell: (row) => <span className="text-capitalize">{row?.createdAt}</span>
    // },
    {
      name: 'Name',
      width: '150px',
      sortable: false,
      selector: (row) => row.name,
      cell: (row) => <span className="">{row?.name}</span>
    },
    {
      name: 'Email',
      minWidth: '300px',
      sortable: false,
      selector: (row) => row.email,
      cell: (row) => <span>{row?.email}</span>
    },
    {
      name: 'Track Name',
      width: '200px',
      sortable: false,
      selector: (row) => row.learningTrackName,
      cell: (row) => <span className="">{row?.learningTrackName}</span>
    },
    {
      name: 'sub TrackName',
      width: '200px',
      sortable: false,
      selector: (row) => row.name,
      selector: (row) => row.subTrackName,
      cell: (row) => <span className="">{row?.subTrackName}</span>
    },
    // {
    //   name: 'Zone',
    //   minWidth: '100px',
    //   sortable: true,
    //   selector: (row) => row.zone,
    //   cell: (row) => <span className="text-capitalize">{row?.zone}</span>
    // },
    // {
    //   name: 'Function Name',
    //   minWidth: '200px',
    //   sortable: true,
    //   selector: (row) => row.functionName,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row?.functionName}</span>
    //   )
    // },
    {
      name: 'Complete Date',
      minWidth: '200px',
      sortable: true,
      selector: (row) => row.completeDateOfAttendance,
      cell: (row) => (
        <span className="text-capitalize">{row?.completeDateOfAttendance}</span>
      )
    },
    {
      name: 'Star Performer',
      minWidth: '150px',
      sortable: true,
      selector: (row) => row.starPerformer,
      cell: (row) =>
        row?.starPerformer ? (
          <div className="performance_star " style={{ marginLeft: 40 }}>
            <Star size={20} fill="#FFC107" color="#FFC107" />
          </div>
        ) : (
          <div className="performance_star ml-1" style={{ marginLeft: 40 }}>
            <Star size={20} fill="gray" color="gray" />
          </div>
        )
    }

    // {
    //   name: 'From Date Of Attendance',
    //   minWidth: '300px',
    //   sortable: false,
    //   selector: (row) => row.fromDateOfAttendance,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row?.fromDateOfAttendance}</span>
    //   )
    // },
    // {
    //   name: 'End Date Of Attendance',
    //   minWidth: '300px',
    //   sortable: false,
    //   selector: (row) => row.endDateOfAttendance,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row?.endDateOfAttendance}</span>
    //   )
    // }
    // {
    //   name: 'Action',
    //   minWidth: '220px',
    //   selector: 'action',
    //   cell: (id) => (
    //     <div className="align-items-center permissions-actions">
    //       <button
    //         size="sm"
    //         color="transparent"
    //         className="btn btn-icon"
    //         onClick={() => handleEditClick(id)}
    //       >
    //         <Edit className="font-medium-2" />
    //       </button>
    //       <button
    //         size="sm"
    //         color="transparent"
    //         className="btn btn-icon"
    //         onClick={() => {
    //           dispatch(selectAttendance(id))
    //           setDeleteModal(true)
    //         }}
    //       >
    //         <Trash className="font-medium-2" />
    //       </button>
    //     </div>
    //   ),
    //   sortable: true,
    //   center: true
    // }
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoader(true))
      dispatch(
        getAttendanceData({
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

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      getAttendanceData({
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
      getAttendanceData({
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

  const addClick = () => {
    setShow(true)
    setIsEdit(false)
  }

  const importClick = () => {
    setShowBulkUploadModal(true)
  }

  const dataToRender = () => {
    return AttendanceList
  }

  return (
    <>
      {/* <DeleteModal {...deletePropsConfig} /> */}
      <div className="react-dataTable attendance-table">
        <DataTable
          // noHeader
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
              showAddButton={false}
              search={search}
              handleSearch={(temp) => dispatch(setSearch(temp))}
              addClick={addClick}
              title="Attendance"
              addName="Add Attendance"
              importName="Import"
              importBtn={true}
              importClick={importClick}
            />
          }
        />
      </div>
      {show && <Form show={show} setShow={setShow} isEdit={isEdit} />}

      {showBulkUploadModal && (
        <AttendanceBulkUpload
          showBulkUploadModal={showBulkUploadModal}
          setShowBulkUploadModal={setShowBulkUploadModal}
        />
      )}
    </>
  )
}

export default Table
