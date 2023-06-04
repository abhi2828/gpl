// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Card } from 'reactstrap'

// ** Table Import
import Table from './Table'

const Enroll = () => {
  return (
    <Fragment>
      <Card>
        <div className="card-datatable app-user-list table-responsive">
          <Table />
        </div>
      </Card>
    </Fragment>
  )
}

export default Enroll
