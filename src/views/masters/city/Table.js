import { React, useState } from 'react'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
// import { Columns } from './columns'
import AddCity from './AddCity'
import { Edit } from 'react-feather'
import { DeleteIcon } from '../../../components/modals/icons'
import DeleteModal from '../../../components/modals/deleteModal'

const Table = ({ props }) => {
  const [show, setShow] = useState(false)
  const [isDeleteModal, setIsDeleteModal] = useState(false)
  const [deletePayload, setDeletePayload] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

  const openDeleteModal = (id) => {
    setIsDeleteModal(true)
    setDeletePayload({
      id: id
      // pageNo: store.params?.pageNo,
      // pageSize: store.params?.pageSize,
      // search: searchTerm
    })
  }

  const closeDeleteModal = () => {
    setIsDeleteModal(false)
    setDeleteId(null)
  }

  const deletePropsConfig = {
    // deletefunc: deleteUser,
    payload: deletePayload,
    closeDeleteModal,
    isDeleteModal
  }

  const customData = [
    { id: 1, city: 'Hyderabad', description: 'Loreum Ipsum' },
    { id: 2, city: 'Mumbai', description: 'Loreum Ipsum' },
    { id: 3, city: 'Kolkata', description: 'Loreum Ipsum' }
  ]

  const columns = [
    { name: 'ID', selector: 'id' },
    { name: 'City', selector: 'city' },
    { name: 'Description', selector: 'description' },
    {
      name: 'Actions',
      selector: (id) => {
        return (
          <div>
            <button size="sm" color="transparent" className="btn btn-icon">
              <Edit className="font-medium-2" />
            </button>
            <button size="sm" color="transparent" className="btn btn-icon">
              <DeleteIcon openDeleteModal={() => openDeleteModal(id)} />
            </button>
          </div>
        )
      }
    }
  ]

  const addClick = () => {
    setShow(true)
  }

  return (
    <>
      <DeleteModal {...deletePropsConfig} />
      <DataTable
        noHeader
        pagination
        subHeader
        responsive
        paginationServer
        progressComponent={<Spinner />}
        // progressPending={loader}
        columns={columns}
        data={customData}
        sortIcon={<ChevronDown />}
        className="react-dataTable"
        // paginationComponent={<CustomPagination />}
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
            addClick={addClick}
            title="City"
            addName="Add City"
            permissions={true}
            // getSearchResult={getSearchResult}
            //RenderForm={RenderForm}
          />
        }
      />
      {show && <AddCity show={show} setShow={setShow} />}
    </>
  )
}

export default Table
