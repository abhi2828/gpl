import React from 'react'
import { Filter } from 'react-feather'
import {
  Alert,
  Row,
  Col,
  Label,
  Form,
  Input,
  Button,
  Spinner
} from 'reactstrap'
import FilterButton from './FilterButton'

export const CustomHeader = ({
  search,
  handleSearch,
  addClick,
  exportClick,
  importClick,
  addName,
  importName,
  exportName,
  showSearch,
  showAddButton = true,
  exportBtn = false,
  importBtn = false,
  title,
  permissions,
  clickFilterIconProps,
  clickClearFilterIconProps,
  filter,
  setFilter,
  clearFilter,
  setClearFilter,
  showFilter = false,
  filterComponent: FilterComponent,
  setShowFilter,
  loader
}) => {
  return (
    <>
      <Row className="text-nowrap w-100 my-75 g-0 permission-header">
        <Col xs={12} lg={4} className={`d-flex align-items-center mt-lg-0`}>
          <h3 className="text-height ">{title}</h3>
        </Col>
        <Col xs={12} lg={8}>
          <div className="d-flex align-items-center justify-content-lg-end justify-content-start flex-md-nowrap flex-wrap mt-lg-0 mt-1">
            {showFilter && (
              <div className="d-flex align-items-center me-1">
                <Filter
                  className="me-1 font-medium-2"
                  onClick={() => {
                    setFilter(true)
                  }}
                ></Filter>
                {clearFilter && (
                  <Label
                    className="fw-bolder"
                    onClick={() => {
                      setClearFilter(false)
                    }}
                  >
                    Clear
                  </Label>
                )}
              </div>
            )}
            <div className="d-flex align-items-center me-1">
              {filter && (
                <FilterButton
                  className="me-1 font-medium-2"
                  clickFilterIconProps={clickFilterIconProps}
                  clickClearFilterIconProps={clickClearFilterIconProps}
                  filterComponent={FilterComponent}
                />
              )}
              {showSearch && (
                <>
                  <label className="mb-0" htmlFor="search-permission">
                    Search:
                  </label>
                  <Input
                    type="text"
                    value={search}
                    id="search-permission"
                    className="ms-50 w-100"
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </>
              )}
            </div>
            {permissions && showAddButton && (
              // {showAddButton && (
              <Button
                className="add-permission mb-sm-0"
                color="primary"
                disabled={loader}
                onClick={() => addClick('add')}
              >
                {addName}
              </Button>
            )}
            {exportBtn && (
              <Button
                className="add-permission mx-1 mb-sm-0"
                color="primary"
                onClick={() => exportClick()}
              >
                {exportName}
              </Button>
            )}
            {importBtn && (
              <Button
                className="add-permission mx-1 mb-sm-0"
                color="primary"
                onClick={() => importClick()}
              >
                {importName}
              </Button>
            )}
          </div>
        </Col>
      </Row>
    </>
  )
}

export default CustomHeader
