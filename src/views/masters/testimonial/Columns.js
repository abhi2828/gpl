import { OverlayTrigger } from 'react-bootstrap'
import Tooltip from '@mui/material/Tooltip'

export const Columns = [
  {
    sortable: false,
    minWidth: '15%',
    name: 'Name ',
    selector: (row) => row?.userName,
    cell: (row) => (
      <span className="text-capitalize fw-light">
        {row?.userName ? row?.userName : '-'}
      </span>
    )
  },
  {
    sortable: false,
    minWidth: '18%',
    name: 'Designation',
    selector: (row) => row?.designationName,
    cell: ({ designationName }) => (
      <span className="text-capitalize fw-light">
        {designationName ? designationName : '-'}
      </span>
    )
  },
  {
    sortable: false,
    minWidth: '18%',
    name: 'Function',
    selector: (row) => row?.departmentName,
    cell: ({ departmentName }) => (
      <span className="text-capitalize fw-light">
        {departmentName ? departmentName : '-'}
      </span>
    )
  },
  {
    sortable: false,
    minWidth: '25%',
    name: 'Testimonial ',
    selector: (row) => row?.testimonial,
    cell: (row) =>
      row?.testimonial?.length > 40 ? (
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip className="careerAspiration-tooltip" arrow>
              <div>{row.testimonial}</div>
            </Tooltip>
          }
        >
          <span className="table_row">{row.testimonial}</span>
        </OverlayTrigger>
      ) : (
        <span>{row.testimonial}</span>
      )
  }
]
