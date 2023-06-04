import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'

import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Form from './Form'
import {
  deleteUser,
  fetchUserList,
  selectUser,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DeleteModal from '../../../components/modals/deleteModal'
import { hasPermission } from '../../../utility/Utils'

function UserMaster() {
  const { userList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.userMaster
  )
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch()

  const handleEditClick = async (data) => {
    setShow(true)
    dispatch(selectUser(data))
  }

  const columns = [
    {
      name: 'Name',
      width: '25%',
      sortable: false,
      selector: (row) => row.name,
      cell: (row) => <span className="text-capitalize">{row.name}</span>
    },
    {
      name: 'Email',
      selector: 'email',
      width: '30%',
      sortable: false,
      selector: (row) => row.email,
      cell: (row) => <span>{row.email}</span>
    },
    // {
    //   name: 'Gender',
    //   selector: 'gender',
    //   width: '12%',
    //   sortable: false,
    //   selector: (row) => row.gender,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row.gender ?? '-'}</span>
    //   )
    // },
    {
      name: 'Phone',
      selector: 'phoneNumber',
      width: '15%',
      sortable: false,
      selector: (row) => row.phoneNumber,
      cell: (row) => <span className="text-capitalize">{row.phoneNumber}</span>
    },
    {
      name: 'Roles',
      selector: 'roles',
      width: '15%',
      sortable: false,
      selector: (row) => row.roleName,
      cell: (row) => <span className="text-capitalize">{row.roleName}</span>
    },
    // {
    //   name: 'Level',
    //   selector: 'levelName',
    //   width: '10%',
    //   sortable: false,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row.levelName ?? '-'}</span>
    //   )
    // },
    // {
    //   name: 'Department',
    //   selector: 'departmentName',
    //   width: '15%',
    //   sortable: false,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row.departmentName ?? '-'}</span>
    //   )
    // },
    // {
    //   name: 'Designagtion',
    //   selector: 'designationName',
    //   width: '20%',
    //   sortable: false,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row.designationName ?? '-'}</span>
    //   )
    // },
    {
      name: 'Actions',
      width: '15%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            {hasPermission('User_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('User_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectUser(row))
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
    return userList
  }

  const addClick = () => {
    setShow(true)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchUserList({
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
      fetchUserList({
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
        fetchUserList({
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
    dispatch(selectUser(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteUser,
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
              exportClick={() => alert('download')}
              title="User List"
              addName="Add User"
              // exportName="Export"
              showAddButton={true}
              // exportBtn={true}
              permissions={true}
            />
          }
        />
      </div>
      {show && <Form show={show} setShow={setShow} />}
    </>
  )
}

export default UserMaster
