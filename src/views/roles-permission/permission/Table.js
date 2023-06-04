// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** Table Columns
import { columns } from './column'

// ** Reactstrap Imports
import { Button } from 'reactstrap'

// ** Store & Actions
import { useDispatch, useSelector } from 'react-redux'
import {
  getAllPermissionList,
  addPermission,
  deletePermission,
  selectPermission,
  updatePermission,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'

// ** Third party Components
import classnames from 'classnames'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Edit, Trash } from 'react-feather'

// ** Styles
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DeleteModal from '../../../components/modals/deleteModal'
import { DeleteIcon } from '../../../components/modals/icons'
import { hasPermission } from '../../../../src/utility/Utils'
import Spinner from '@components/spinner/Loading-spinner'
import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import { getModuleDropdown } from '../../masters/modules/store'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import AddPermission from './AddPermission'

const Table = () => {
  // ** Store Vars & Hooks
  const dispatch = useDispatch()
  const { permissions, loader, totalPages, selected, params } = useSelector(
    (state) => state?.permissions
  )
  const { pageNo, pageSize, search } = params

  // ** States
  const [show, setShow] = useState(false)
  const [editLoader, setEditLoader] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)

  // ** Get data on mount

  const closeDeleteModal = () => {
    dispatch(selectPermission(null))
    setDeleteModal(false)
  }

  // ** Function in get data on page change
  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      getAllPermissionList({
        pageNo: page?.selected + 1,
        pageSize,
        search: search
      })
    )
    dispatch(setPageNo(page?.selected + 1))
  }

  // ** Function in get data on rows per page
  const handlePageSizeChange = (e) => {
    dispatch(setLoader(true))
    const value = parseInt(e.currentTarget.value)
    dispatch(
      getAllPermissionList({
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
        getAllPermissionList({
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
    return permissions
  }

  const addClick = () => {
    setEditLoader(true)
    dispatch(getModuleDropdown())
    setShow(true)
    setEditLoader(false)
  }

  const handleEditClick = async (data) => {
    setEditLoader(true)
    await dispatch(getModuleDropdown())
    await dispatch(selectPermission(data))
    setEditLoader(false)
    setShow(true)
  }

  const deletePropsConfig = {
    deletefunc: deletePermission,
    payload: {
      id: selected?.id,
      pageNo,
      pageSize,
      search
    },
    closeDeleteModal,
    showDeleteModal
  }

  const updatedColumns = [
    ...columns,
    {
      name: 'Actions',
      minWidth: '18%',
      width: '18%',
      cell: (row) => {
        return (
          <div className="d-flex align-items-center permissions-actions">
            {hasPermission('Permission_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                disabled={editLoader}
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Permission_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectPermission(row))
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
          noHeader
          pagination
          subHeader
          responsive
          highlightOnHover
          paginationServer
          progressComponent={<Spinner />}
          progressPending={loader}
          columns={updatedColumns}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          paginationComponent={renderPaginationComponent}
          data={dataToRender()}
          subHeaderComponent={
            <CustomHeader
              search={search}
              showSearch={true}
              handleSearch={(temp) => dispatch(setSearch(temp))}
              title="Permissions List"
              addClick={addClick}
              addName="Add Permission"
              permissions={hasPermission('Permission_Add')}
              loader={editLoader}
            />
          }
        />
      </div>
      {show && <AddPermission show={show} setShow={setShow} />}
    </Fragment>
  )
}

export default Table
