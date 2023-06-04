import { Edit } from 'react-feather'
import { Button } from 'reactstrap'

export const Columns = [
  {
    sortable: true,
    minWidth: '40%',
    name: 'ID',
    selector: 'id'
    // cell: ({ userName }) => userName
  },
  {
    sortable: true,
    minWidth: '40%',
    name: 'Designation',
    // cell: ({ taskName }) => taskName,
    selector: 'designation'
  },
  {
    name: 'Actions',
    width: '12%',
    cell: (row) => {
      return (
        <div className="align-items-center permissions-actions">
          <Button size="sm" color="transparent" className="btn btn-icon">
            <Edit className="font-medium-2" />
          </Button>

          <Button size="sm" color="transparent" className="btn btn-icon">
            {/* <DeleteIcon className="font-medium-2" /> */}
          </Button>
        </div>
      )
    }
  }
]
