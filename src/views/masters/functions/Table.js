import { React, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, Edit, Eye, Trash, Trash2, X } from 'react-feather'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
import { Button, Input } from 'reactstrap'
import DeleteModal from '../../../components/modals/deleteModal'
import Form from './Form'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { fetchDepartmentsList, selectDepartments } from './store'
import {
  deleteDepartments,
  fetchLevelList,
  selectLevel,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { hasPermission } from '../../../utility/Utils'

function DepartmentMaster({ props }) {
  let { departmentsList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.functions
  )
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch()

  const handleEditClick = async (data) => {
    setShow(true)
    dispatch(selectDepartments(data))
  }

  const closeDeleteModal = () => {
    dispatch(selectDepartments(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteDepartments,
    payload: {
      id: selected?.id,
      pageNo,
      pageSize,
      search
    },
    closeDeleteModal,
    showDeleteModal
  }

  const columns = [
    {
      name: 'Function Name',
      sortable: true,
      width: '37%',
      selector: (row) => row.name,
      cell: (row) => <span className="text-capitalize">{row.name}</span>
    },
    {
      name: 'Description',
      selector: 'description',
      width: '35%',
      sortable: false,
      selector: (row) => row.description,
      cell: (row) =>
        row?.description?.length > 5 ? (
          <OverlayTrigger
            placement="auto"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip">{row.description}</div>
              </Tooltip>
            }
          >
            <span className="table_row description">{row.description}</span>
          </OverlayTrigger>
        ) : (
          <span>{row.description}</span>
        )
    },
    {
      name: 'Actions',
      width: '28%',
      selector: 'action',
      cell: (row) => (
        <>
          {hasPermission('Department_Update') && (
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => handleEditClick(row)}
            >
              <Edit className="font-medium-2" />
            </Button>
          )}
          {hasPermission('Department_Delete') && (
            <Button
              size="sm"
              color="transparent"
              className="btn btn-icon"
              onClick={() => {
                dispatch(selectDepartments(row))
                setDeleteModal(true)
              }}
            >
              <Trash className="font-medium-2" />
            </Button>
          )}
        </>
      ),
      minWidth: '200px',
      sortable: true,
      center: true
    }
  ]

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchDepartmentsList({
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
      fetchDepartmentsList({
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
        fetchDepartmentsList({
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

  const dataToRender = () => {
    return departmentsList
  }

  const addClick = () => {
    setShow(true)
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
  return (
    <>
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
              search={search}
              showSearch={true}
              handleSearch={(temp) => dispatch(setSearch(temp))}
              addClick={addClick}
              title="Function List"
              addName="Add Function "
              permissions={hasPermission('Department_Add')}
            />
          }
        />
      </div>

      {show && <Form show={show} setShow={setShow} />}
    </>
  )
}

export default DepartmentMaster
