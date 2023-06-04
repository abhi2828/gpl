import { React, useState } from 'react'
import { ChevronDown } from 'react-feather'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
import { Columns } from './column'
import AddProgramMaster from './AddProgramMaster'

const Table = ({ props }) => {
  const [show, setShow] = useState(false)
  const customData = [
    {
      track_name: 'new',
      track_id: '1',
      applicable_department: 'depart',
      description_objective: 'I am Mentor',
      start_date: '1-2-1999',
      end_date: '13-2-1999',
      method: 'Post'
    },
    {
      id: 2,
      track_id: 'Jane Smith',
      objDesc: '/permissions',
      description: 'I am User',
      method: 'Get'
    },
    {
      id: 3,
      track_id: 'Bob Johnson',
      objDesc: '/permissions',
      description: 'I am Mentor',
      method: 'Put'
    }
  ]

  const columns = [
    { name: 'ID', selector: 'id' },
    { name: 'Track_Id', selector: 'track_id' },
    { name: 'BaseUrl', selector: 'baseUrl' },
    { name: 'Description', selector: 'description' },
    { name: 'Method', selector: 'method' }
  ]

  const addClick = () => {
    setShow(true)
  }

  return (
    <>
      <DataTable
        noHeader
        pagination
        subHeader
        responsive
        paginationServer
        progressComponent={<Spinner />}
        // progressPending={loader}
        columns={Columns}
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
            title="Program Master"
            addName="Add Program"
            permissions={true}
            // getSearchResult={getSearchResult}
            //RenderForm={RenderForm}
          />
        }
      />
      {show && <AddProgramMaster show={show} setShow={setShow} />}
    </>
  )
}

export default Table
