import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'

import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Form from './Form'
import {
  deleteLevel,
  fetchLevelList,
  selectLevel,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DeleteModal from '../../../components/modals/deleteModal'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { hasPermission } from '../../../utility/Utils'

function LevelMaster() {
  const { levelList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.levelMaster
  )
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch()

  const handleEditClick = async (data) => {
    setShow(true)
    dispatch(selectLevel(data))
  }

  const columns = [
    {
      name: 'Level Name',
      selector: 'level',
      width: '35%',
      sortable: false,
      selector: (row) => row.levelName,
      cell: (row) => <span className="text-capitalize">{row.levelName}</span>
    },
    {
      name: 'Description',
      selector: 'description',
      width: '45%',
      sortable: false,
      selector: (row) => row.description,
      cell: (row) =>
        row?.description?.length > 5 ? (
          <OverlayTrigger
            placement="bottom"
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
      width: '20%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            {hasPermission('Level_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Level_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectLevel(row))
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
    return levelList
  }

  const addClick = () => {
    setShow(true)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchLevelList({
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
      fetchLevelList({
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
        fetchLevelList({
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
    dispatch(selectLevel(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteLevel,
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
              title="Level List"
              addName="Add Level"
              permissions={hasPermission('Level_Add')}
            />
          }
        />
      </div>
      {show && <Form show={show} setShow={setShow} />}
    </>
  )
}

export default LevelMaster
