import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'
import Form from './form/Form'
import { Columns } from './Columns'
import {
  deleteTestimonial,
  fetchTestimonial,
  selectTestimonial,
  updateTestimonialStatus,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import DeleteModal from '../../../components/modals/deleteModal'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import { Switch } from '@mui/material'
import { hasPermission } from '../../../utility/Utils'

function TestimonialMaster() {
  const { testimonialList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.testimonial
  )
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState('')
  const [showDeleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch()
  const handleEditClick = async (data) => {
    setShow(true)
    dispatch(selectTestimonial(data))
  }
  const handleChange = async ({ id, isVisible }) => {
    dispatch(
      updateTestimonialStatus({
        id,
        isVisible: !isVisible,
        params
      })
    )
  }

  const updatedColumns = [
    ...Columns,
    {
      name: 'Status',
      minWidth: '10%',
      cell: (row) => {
        return (
          <div className="d-flex align-items-center permissions-actions">
            <Switch
              checked={row?.isVisible}
              onChange={(e) => handleChange(row)}
            />
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
            {hasPermission('Testimonial_Update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Testimonial_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectTestimonial(row))
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
    return testimonialList
  }

  const addClick = () => {
    setShow(true)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchTestimonial({
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
      fetchTestimonial({
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
        fetchTestimonial({
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
    dispatch(selectTestimonial(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteTestimonial,
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
          noHeader
          pagination
          subHeader
          responsive
          paginationServer
          progressComponent={<Spinner />}
          progressPending={loader}
          columns={updatedColumns}
          data={dataToRender()}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          paginationComponent={renderPaginationComponent}
          subHeaderComponent={
            <CustomHeader
              // setShow={setShow}
              // assignedTo={assignedTo}
              // searchTerm={searchTerm}
              // rowsPerPage={rowsPerPage}
              // handleFilter={handleFilter}
              // handlePerPage={handlePerPage}
              // handleAssignedToChange={handleAssignedToChange}
              // dispatch={dispatch}
              showSearch={true}
              search={search}
              handleSearch={(temp) => dispatch(setSearch(temp))}
              addClick={addClick}
              title="Testimonial List"
              addName="Add Testimonial"
              permissions={hasPermission('Testimonial_Add')}
              // getSearchResult={getSearchResult}
              //RenderForm={RenderForm}
            />
          }
        />
      </div>
      {show && <Form show={show} setShow={setShow} />}
    </>
  )
}

export default TestimonialMaster
