import React, { useState } from 'react'
import { Filter } from 'react-feather'
import { useDispatch } from 'react-redux'
import { Label, Modal, ModalBody, ModalHeader } from 'reactstrap'
// import { getTopicList, setLoader } from '../../views/apps/master/topic/store'

function FilterButton({
  clickFilterIconProps,
  clickClearFilterIconProps,
  filterComponent: FilterComponent
}) {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState(false)
  const [clearFilter, setClearFilter] = useState(false)

  const clickFilterIcon = () => {
    setFilter(true)
    clickFilterIconProps()
  }

  const clickClearFilterIcon = () => {
    dispatch(
      getTopicList({
        pageNo: 1,
        pageSize: 10
      })
    )
    setClearFilter(false)
    clickClearFilterIconProps()
  }
  return (
    <>
      <Filter className="me-1 font-medium-7" onClick={clickFilterIcon}></Filter>
      {clearFilter && (
        <Label className="fw-bolder me-1" onClick={clickClearFilterIcon}>
          Clear
        </Label>
      )}

      {filter && (
        <Modal
          isOpen={filter}
          toggle={() => setFilter(false)}
          className="modal-dialog-centered"
        >
          <ModalHeader
            className="bg-transparent "
            toggle={() => setFilter(false)}
          ></ModalHeader>
          <ModalBody>
            <FilterComponent
              setFilter={setFilter}
              setClearFilter={setClearFilter}
              clearFilter={clearFilter}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default FilterButton
