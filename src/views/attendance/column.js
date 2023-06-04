export const Columns = [
  // {
  //   sortable: true,
  //   minWidth: '50px',
  //   name: 'ID',
  //   selector: 'id'
  //   // cell: ({ userName }) => userName
  // },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Date ',
    // cell: ({ taskName }) => taskName,
    selector: 'date'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'EDP Of Employee',
    // cell: ({ technologyName }) => technologyName,
    selector: 'eDPOfEmployee'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Time Stamp',
    // cell: ({ technologyName }) => technologyName,
    selector: 'timeStamp'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Name',
    // cell: ({ technologyName }) => technologyName,
    selector: 'name'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Email',
    // cell: ({ technologyName }) => technologyName,
    selector: 'email'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Zone',
    // cell: ({ technologyName }) => technologyName,   .....alreadyOne
    // cell: (row) => (
    //   <span className="text-capitalize fw-light">
    //     {row?.attendanceName ? row?.attendanceName : '-'}
    //   </span>
    // )
    selector: 'zone'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Function Name',
    // cell: ({ technologyName }) => technologyName,
    // cell: (row) => (
    //   <span className="text-capitalize fw-light">
    //     {row?.attendanceName ? row?.attendanceName : '-'}
    //   </span>
    // )
    selector: 'functionName'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Rated As Star Performance',
    // cell: ({ technologyName }) => technologyName,
    // cell: (row) => (
    //   <span className="text-capitalize fw-light">
    //     {row?.attendanceName ? row?.attendanceName : '-'}
    //   </span>
    // )
    selector: 'RatedAsStarPerformance'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Track Name',
    // cell: ({ technologyName }) => technologyName,
    // cell: (row) => (
    //   <span className="text-capitalize fw-light">
    //     {row?.attendanceName ? row?.attendanceName : '-'}
    //   </span>
    // )
    selector: 'trackName'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Sub Track Name',
    // cell: ({ technologyName }) => technologyName,
    // cell: (row) => (
    //   <span className="text-capitalize fw-light">
    //     {row?.attendanceName ? row?.attendanceName : '-'}
    //   </span>
    // )
    selector: 'subTrackName'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'From Date Of Attendance',
    // cell: ({ technologyName }) => technologyName,
    // cell: (row) => (
    //   <span className="text-capitalize fw-light">
    //     {row?.attendanceName ? row?.attendanceName : '-'}
    //   </span>
    // )
    selector: 'fromDateOFAttendance'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'End Date Of Attendance',
    // cell: ({ technologyName }) => technologyName,
    // cell: (row) => (
    //   <span className="text-capitalize fw-light">
    //     {row?.attendanceName ? row?.attendanceName : '-'}
    //   </span>
    // )
    selector: 'endDateOfAttendance'
  }
]
