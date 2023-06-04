import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash, Eye } from 'react-feather'
import DataTable from 'react-data-table-component'
import CustomHeader from '../../utility/commonComponents/CustomHeader'
import Spinner from '@components/spinner/Loading-spinner'
import { useDispatch, useSelector } from 'react-redux'
import {
  CareerAspirationExport,
  fetchCareerAspirationList,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../utility/commonComponents/Pagination'
import { baseUrl } from '../../app.config'
import axios from 'axios'
import { OverlayTrigger } from 'react-bootstrap'
import { read, utils, writeFile } from 'xlsx'
import '../../../src/common.css'
// import { Tooltip } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

function Table() {
  const { careerAspirationList, loader, totalPages, selected, params } =
    useSelector((state) => state?.careerAspirationAdmin)

  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const dispatch = useDispatch()

  const columns = [
    {
      name: 'Name',
      width: '20%',
      sortable: false,
      cell: (row) => <span className="text-capitalize">{row.name}</span>
    },
    {
      name: 'Email',
      width: '30%',
      sortable: false,
      cell: (row) => <span className="">{row.email}</span>
    },
    // {
    //   name: 'Function',
    //   width: '200px',
    //   sortable: false,
    //   cell: (row) => (
    //     <span className="text-capitalize">{row.departmentName}</span>
    //   )
    // },
    // {
    //   name: 'Start Date',
    //   width: '200px',
    //   sortable: false,
    //   cell: (row) => <span className="text-capitalize">{row.startDate}</span>
    // },
    // {
    //   name: 'End Date',
    //   width: '200px',
    //   sortable: false,
    //   cell: (row) => <span className="text-capitalize">{row.endDate}</span>
    // },
    // {
    //   name: 'Timestamp',
    //   width: '200px',
    //   sortable: false,
    //   cell: (row) => <span className="text-capitalize">{row.timestamp}</span>
    // },
    {
      name: 'Career Aspiration',
      width: '45%',
      sortable: false,
      cell: (row) =>
        row?.careerAspiration?.length > 50 ? (
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip className="careerAspiration-tooltip" arrow>
                <div>{row.careerAspiration}</div>
              </Tooltip>
            }
          >
            <span
              aria-describedby="toolTip"
              className=" table_row1 careerAspiration"
            >
              {row.careerAspiration}
            </span>
          </OverlayTrigger>
        ) : (
          <span>{row.careerAspiration}</span>
        )
    }
  ]

  const exportClick = async () => {
    try {
      const response = await axios.get(baseUrl() + '/user/export')
      const data = response.data
      const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' })
      const downloadLink = document.createElement('a')
      downloadLink.setAttribute('href', URL.createObjectURL(blob))
      downloadLink.setAttribute('download', 'CareerAspiration.csv')
      downloadLink.style.display = 'none'
      document.body.appendChild(downloadLink)
      downloadLink.click() // Trigger download
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.error(error)
    }
  }

  const dataToRender = () => {
    return careerAspirationList
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      fetchCareerAspirationList({
        pageNo: page?.selected + 1,
        pageSize,
        search: search
      })
    )
    dispatch(setPageNo(page?.selected + 1))
  }

  const handlePageSizeChange = (e) => {
    const value = parseInt(e.currentTarget.value)
    dispatch(setLoader(true))
    dispatch(
      fetchCareerAspirationList({
        pageSize: value,
        search: search,
        pageNo: 1
      })
    )
    dispatch(setPageSize(value))
    dispatch(setPageNo(1))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoader(true))
      dispatch(
        fetchCareerAspirationList({
          pageNo: 1,
          pageSize,
          search: search
        })
      )
      dispatch(setPageNo(1))
    }, 1000)
    return () => {
      clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    dispatch(setSearch(''))
  }, [])

  // useEffect(() => {
  //   dispatch(setLoader(true))
  //   dispatch(
  //     fetchCareerAspirationList({
  //       pageNo: 1,
  //       pageSize,
  //       search: search
  //     })
  //   )
  //   dispatch(setPageNo(1))

  // }, [])

  const renderPaginationComponent = () => {
    return (
      <CustomPagination
        pageProps={{ pageNo, pageSize, totalPages }}
        handlePageNoChange={handlePageNoChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    )
  }

  return (
    <>
      {/* <DeleteModal {...deletePropsConfig}></DeleteModal> */}
      <div className="react-dataTable attendance-table">
        <DataTable
          pagination
          subHeader
          responsive
          highlightOnHover
          paginationServer
          progressComponent={<Spinner />}
          progressPending={loader}
          columns={columns}
          data={dataToRender()}
          sortIcon={<ChevronDown />}
          className="react-dataTable"
          paginationComponent={renderPaginationComponent}
          subHeaderComponent={
            <CustomHeader
              search={search}
              showSearch={true}
              handleSearch={(temp) => dispatch(setSearch(temp))}
              exportName="Export"
              exportBtn={true}
              exportClick={exportClick}
              showAddButton={false}
              title="Career Aspiration List"
            />
          }
        />
      </div>
    </>
  )
}

export default Table
