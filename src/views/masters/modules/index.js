// ** React Imports
import { Fragment } from 'react'

// ** Reactstrap Imports
import { Card } from 'reactstrap'

// ** Table Import
import Module from './Table'

const ModulesMaster = () => {
  return (
    <Fragment>
      <Card>
        <div className="card-datatable app-user-list table-responsive">
          <Module />
        </div>
      </Card>
    </Fragment>
  )
}

export default ModulesMaster
