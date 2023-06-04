// ** React Imports
import { Link } from 'react-router-dom'

// ** Third Party Components
import classnames from 'classnames'

// ** Reactstrap Imports
import { Badge } from 'reactstrap'

// ** Vars
const colors = {
  support: 'light-info',
  user: 'light-success',
  manager: 'light-warning',
  administrator: 'light-primary',
  'restricted-user': 'light-danger'
}

export const columns = [
  {
    name: 'Name',
    sortable: true,
    minWidth: '40%',
    width: '40%',
    cell: ({ roleName }) => roleName,
    selector: (row) => row.roleName
  },
  {
    name: 'Description',
    sortable: true,
    minWidth: '40%',
    width: '40%',
    cell: ({ description }) => description,
    selector: (row) => row.description
  }
]
