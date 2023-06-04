import { React, useState, useEffect } from 'react'
import { ChevronDown, Edit, Trash } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { Button } from 'reactstrap'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import CustomHeader from '../../../utility/commonComponents/CustomHeader'
import Form from './Form'
import {
  deleteBanner,
  getAllBanners,
  selectBanner,
  updateBannerStatus,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} from './store'
import CustomPagination from '../../../utility/commonComponents/Pagination'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import DeleteModal from '../../../components/modals/deleteModal'
import AddForm from './Form'
import { Switch } from '@mui/material'
import { hasPermission } from '../../../utility/Utils'

function BannerMaster() {
  const { bannerList, loader, totalPages, selected, params } = useSelector(
    (state) => state?.bannerMaster
  )
  const { pageNo, pageSize, search } = params
  const [show, setShow] = useState(false)
  const [showDeleteModal, setDeleteModal] = useState(false)
  const dispatch = useDispatch()

  const handleEditClick = async (data) => {
    setShow(true)
    dispatch(selectBanner(data))
  }
  const handleChange = async ({ id, isVisible }) => {
    dispatch(
      updateBannerStatus({
        id,
        isVisible: !isVisible,
        params
      })
    )
  }

  const columns = [
    {
      name: 'Name',
      width: '20%',
      sortable: false,
      selector: (row) => row.name
    },
    {
      name: 'Content',
      width: '25%',
      sortable: false,
      selector: (row) => row.showContent
    },
    {
      name: 'description',
      width: '25%',
      sortable: false,
      selector: (row) => row.description,
      cell: (row) =>
        row?.description?.length > 40 ? (
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="toolTip">
                <div className="toolTip">{row.description}</div>
              </Tooltip>
            }
          >
            <span className="table_row description">{row.description}</span>
          </OverlayTrigger>
        ) : (
          <span>{row.description}</span>
        )
    },
    {
      name: 'Status',
      minWidth: '17%',
      cell: (row) => {
        return (
          <div className="d-flex align-items-center permissions-actions">
            <Switch
              checked={row?.isVisible}
              onChange={(e) => handleChange(row)}
            />
          </div>
        )
      }
    },
    {
      name: 'Actions',
      width: '13%',
      cell: (row) => {
        return (
          <div className="align-items-center permissions-actions">
            {hasPermission('Banner_update') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => handleEditClick(row)}
              >
                <Edit className="font-medium-2" />
              </Button>
            )}
            {hasPermission('Banner_Delete') && (
              <Button
                size="sm"
                color="transparent"
                className="btn btn-icon"
                onClick={() => {
                  dispatch(selectBanner(row))
                  setDeleteModal(true)
                }}
              >
                <Trash className="font-medium-2" />
              </Button>
            )}
          </div>
        )
      }
    }
  ]

  const dataToRender = () => {
    return bannerList
  }

  const addClick = () => {
    setShow(true)
  }

  const handlePageNoChange = (page) => {
    dispatch(setLoader(true))
    dispatch(
      getAllBanners({
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
      getAllBanners({
        pageSize: value,
        search: search,
        pageNo: 1
      })
    )
    dispatch(setPageSize(value))
    dispatch(setPageNo(1))
  }
  useEffect(() => {
    dispatch(setSearch(''))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setLoader(true))
      dispatch(
        getAllBanners({
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

  const renderPaginationComponent = () => {
    return (
      <CustomPagination
        pageProps={{ pageNo, pageSize, totalPages }}
        handlePageNoChange={handlePageNoChange}
        handlePageSizeChange={handlePageSizeChange}
      />
    )
  }

  const closeDeleteModal = () => {
    dispatch(selectBanner(null))
    setDeleteModal(false)
  }

  const deletePropsConfig = {
    deletefunc: deleteBanner,
    payload: {
      id: selected?.id,
      pageNo,
      pageSize,
      search
    },
    closeDeleteModal,
    showDeleteModal
  }

  return (
    <>
      <DeleteModal {...deletePropsConfig}></DeleteModal>
      <div className="react-dataTable">
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
              addClick={addClick}
              title="Banners List"
              addName="Add Banner"
              permissions={hasPermission('Banner_Add')}
            />
          }
        />
      </div>
      {show && <AddForm show={show} setShow={setShow} />}
    </>
  )
}

export default BannerMaster
