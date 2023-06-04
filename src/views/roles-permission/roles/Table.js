// ** React Imports
import { useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '@components/spinner/Loading-spinner'

// ** Table Columns
import { columns } from './column'

// ** Reactstrap Imports
import { Button, Input } from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'

// ** Third party Components
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { useForm, Controller } from 'react-hook-form'
import { ChevronDown, Edit, Trash } from 'react-feather'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import {
  deleteRoles,
  getRolesData,
  getRolesDataById,
  selectRoles,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'

import {
  permissionByModule,
  getPermissionAllList
} from './../permission/store/index'
import DeleteModal from '../../../components/modals/deleteModal'
import { DeleteIcon } from '../../../components/modals/icons'
import AddRole from './AddRole'
import { hasPermission } from '../../../utility/Utils'
import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import CustomPagination from '../../../utility/commonComponents/Pagination'

const Table = () => {
  // ** Store Vars & Hooks
  const dispatch = useDispatch()
  const store = useSelector((state) => state.roles)

  // ** States
  const [show, setShow] = useState(false)
  const navigate = useNavigate()
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deletePayload, setDeletePayload] = useState(null)
  const [type, setType] = useState('Add')
  const [editRow, setEditRow] = useState()
  const { roles, loader, totalPages, selected, params } = useSelector(
    (state) => state?.roles
  )
  const { pageNo, pageSize, search } = params

  const closeDeleteModal = () => {
    dispatch(selectRoles(null))
    setDeleteModal(false)
  }

  // ** Function in get data on page change
  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      getRolesData({
        pageNo: page?.selected + 1,
        pageSize,
        search: search
      })
    )
    dispatch(setPageNo(page?.selected + 1))
  }

  // ** Function in get data on rows per page
  const handlePageSizeChange = (e) => {
    const value = parseInt(e.currentTarget.value)
    dispatch(setLoader(true))
    dispatch(
      getRolesData({
        pageSize: value,
        search: search,
        pageNo: 1
      })
    )
    dispatch(setPageSize(value))
    dispatch(setPageNo(1))
  }

  // ** Function in get data on search query change
  useEffect(() => {
    dispatch(setSearch(''))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoader(true))
      dispatch(
        getRolesData({
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

  // ** Custom Pagination
  const renderPaginationComponent = () => {
    return (
      <CustomPagination
        pageProps={{ pageNo, pageSize, totalPages }}
        handlePageNoChange={handlePageNoChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    return roles
  }

  const handleEditClick = async (data) => {
    await dispatch(permissionByModule())
    await dispatch(getRolesDataById(data.id))
    await dispatch(selectRoles(data))
    setShow(true)
  }

  const addClick = async () => {
    dispatch(permissionByModule())
    dispatch(getPermissionAllList())
    setShow(true)
  }

  const deletePropsConfig = {
    deletefunc: deleteRoles,
    payload: {
      id: selected?.id,
      pageNo,
      pageSize,
      search
    },
    closeDeleteModal,
    showDeleteModal,
    message:
      'If you delete this Role it will delete all Users within linked to it'
  }

  const updatedColumns = [
    ...columns,
    {
      name: 'Actions',
      minWidth: '20%',
      width: '20%',
      cell: (row) => {
        return (
          <div className="d-flex align-items-center permissions-actions">
            {hasPermission('Role_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Role_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectRoles(row))
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

  return (
    <Fragment>
      {show ? (
        <AddRole setShow={setShow} />
      ) : (
        <>
          <DeleteModal {...deletePropsConfig}></DeleteModal>
          <div className="react-dataTable">
            <DataTable
              noHeader
              pagination
              subHeader
              responsive
              paginationServer
              highlightOnHover
              progressComponent={<Spinner />}
              progressPending={loader}
              columns={updatedColumns}
              sortIcon={<ChevronDown />}
              className="react-dataTable"
              paginationComponent={renderPaginationComponent}
              data={dataToRender()}
              subHeaderComponent={
                <CustomHeader
                  // setShow={setShow}
                  showSearch={true}
                  search={search}
                  handleSearch={(temp) => dispatch(setSearch(temp))}
                  addName="Add Role"
                  addClick={addClick}
                  title="Role"
                  permissions={hasPermission('Role_Add')}
                />
              }
            />
            {/* </UILoader> */}
          </div>
        </>
      )}
    </Fragment>
  )
}

export default Table
