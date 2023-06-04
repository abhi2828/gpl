export const Columns = [
  {
    sortable: true,
    minWidth: '200px',
    name: 'Track Name',
    selector: 'track_name'
    // cell: ({ userName }) => userName
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Applicable Department ',
    // cell: ({ taskName }) => taskName,
    selector: 'applicable_department'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Description & Objective',
    // cell: ({ technologyName }) => technologyName,
    selector: 'description_objective'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Start Date',
    // cell: ({ technologyName }) => technologyName,
    selector: 'start_date'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'End Date',
    // cell: ({ technologyName }) => technologyName,
    selector: 'end_date'
  },
  {
    sortable: true,
    minWidth: '200px',
    name: 'Curriculum',
    // cell: ({ technologyName }) => technologyName,
    selector: 'method'
  }
  //   {
  //     sortable: true,
  //     minWidth: '200px',
  //     name: 'Assigned By',
  //     cell: ({ assignedBy }) => assignedBy,
  //     selector: () => {
  //       row.assignedBy
  //     }
  //   },
  //   {
  //     name: 'Actions',
  //     // omit: !hasPermission(IS_ADMIN) || !hasPermission(IS_MENTOR),
  //     cell: (row) => {
  //       return (
  //         <div className="d-flex align-items-center permissions-actions">
  //           {/* {hasPermission('UserTaskDelete') && ( */}
  //           {/* <DeleteIcon */}
  //           {/* //   openDeleteModal={() => openDeleteModal(row.userTaskId)} */}
  //           {/* /> */}
  //           {/* )} */}
  //         </div>
  //       )
  //     }
  //   }
]
