import { Edit } from 'react-feather'
import { Button } from 'reactstrap'

export const Columns = [
  {
    sortable: true,
    minWidth: '20%',
    name: 'ID',
    selector: 'id'
    // cell: ({ userName }) => userName
  },
  {
    sortable: true,
    minWidth: '30%',
    name: 'BusinessUnit',
    // cell: ({ taskName }) => taskName,
    selector: 'businessUnit'
  },
  {
    name: 'Actions',
    width: '30%',
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
