import { useDispatch, useSelector } from 'react-redux'
import ReactPaginate from 'react-paginate'

import DataTable from 'react-data-table-component'
import { useEffect, useState } from 'react'
import { ChevronDown, Edit, Trash } from 'react-feather'
import '../../../../src/common.css'

import { Button, Input, UncontrolledDropdown } from 'reactstrap'

import ModuleForm from './Form'
import {
  deleteModule,
  getModuleList,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch,
  selectModule
} from './store'
import Spinner from '@components/spinner/Loading-spinner'
import DeleteModal from '../../../components/modals/deleteModal'
import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import { DeleteIcon } from '../../../components/modals/icons'
import { hasPermission } from '../../../utility/Utils'
import CustomPagination from '../../../utility/commonComponents/Pagination'

const Module = () => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(null)
  const [type, setType] = useState()
  const [editRow, setEditRow] = useState()
  const [showDeleteModal, setDeleteModal] = useState(null)
  // const [deletePayload, setDeletePayload] = useState(null)
  const moduleStore = useSelector((state) => state.masterModule)
  const { loader, totalPages, params, moduleList, selected } = useSelector(
    (state) => state?.masterModule
  )

  const { pageNo, pageSize, search } = params

  useEffect(() => {
    dispatch(setSearch(''))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoader(true))
      dispatch(
        getModuleList({
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

  const closeDeleteModal = () => {
    dispatch(selectModule(null))
    setDeleteModal(false)
  }

  const addClick = async () => {
    setShow(true)
  }

  const editModule = (e, row) => {
    setShow(true)
    dispatch(selectModule(row))
  }

  const deletePropsConfig = {
    deletefunc: deleteModule,
    payload: {
      id: selected?.id,
      pageNo,
      pageSize,
      search
    },
    closeDeleteModal,
    showDeleteModal
  }
  const handlePageNoChange = (page) => {
    dispatch(setLoader())
    dispatch(
      getModuleList({
        pageNo: page?.selected + 1,
        pageSize,
        search: search
      })
    )
    dispatch(setPageNo(page?.selected + 1))
  }

  const handlePageSizeChange = (e) => {
    dispatch(setLoader())
    const value = parseInt(e.currentTarget.value)
    dispatch(setLoader(true))
    dispatch(
      getModuleList({
        pageSize: value,
        search: search,
        pageNo: 1
      })
    )
    dispatch(setPageSize(value))
    dispatch(setPageNo(1))
  }

  // ** Function in get data on search query change

  const columns = [
    {
      name: 'Module Name',
      with: '80%',
      sortable: true,
      sortField: 'moduleName',
      selector: (row) => row.moduleName,
      cell: (row) => <span>{row.moduleName}</span>
    },
    {
      name: 'Actions',
      width: '20%',
      cell: (row) => (
        <div className="column-action">
          <div className="d-flex align-items-center permissions-actions">
            {hasPermission('Module_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={(e) => editModule(e, row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Module_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectModule(row))
                  setDeleteModal(true)
                }}
              >
                <Trash className="font-medium-2" />
              </Button>
            )}
          </div>
        </div>
      )
    }
  ]

  const dataToRender = () => {
    return moduleList
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
      <DeleteModal {...deletePropsConfig}></DeleteModal>
      <div className="react-dataTable attendance-table">
        <DataTable
          noHeader
          pagination
          subHeader
          responsive
          highlightOnHover
          paginationServer
          progressComponent={<Spinner />}
          progressPending={loader}
          columns={columns}
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
              addClick={addClick}
              addName="Add Module"
              title="Module List"
              permissions={hasPermission('Module_Add')}
            />
          }
        />
      </div>
      {show && <ModuleForm show={show} setShow={setShow} />}
    </>
  )
}

export default Module
