import classNames from 'classnames'
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
// import { formatDate } from '../../../../utility/Utils'

//**Utils */
// import { selectThemeColors } from '@utils'

import { Controller, useForm } from 'react-hook-form'

import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row
} from 'reactstrap'
import Select from 'react-select'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const defaultValues = {
  topicId: [],
  userId: '',
  startDate: '',
  endDate: '',
  rating: '',
  comment: '',
  status: ''
}
const AddForm = ({
  show,
  status,
  setShow,
  type,
  currentPage,
  pageNo,
  pageSize
}) => {
  const [data, setData] = useState(null)
  const [endPicker, setEndPicker] = useState(new Date())
  const [startPicker, setStartPicker] = useState(new Date())
  const [isEnableData, setIsEnableData] = useState(true)
  //   const topicListValue = useSelector((state) => state?.topic)
  //   const userListValue = useSelector((state) => state?.user?.userAllList)

  const dispatch = useDispatch()

  const {
    reset,
    control,
    setError,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleDiscard = () => {
    reset()
    setShow(false)
  }
  const handleModalClosed = () => {
    dispatch(selectAssignTopic(null))
    reset()
  }
  const onSubmit = (data) => {
    if (data?.userId) {
      dispatch(
        addAssignTopic({
          userId: data.userId.value,
          topicId: data.topicId.map((t) => {
            return t.value
          }),
          status
        })
      )
      handleDiscard()
    } else {
      for (const key in data) {
        if (data[key] === null) {
          setError(key, {
            type: 'manual'
          })
        }
        if (data[key] !== null && data[key].length === 0) {
          setError(key, {
            type: 'manual'
          })
        }
      }
    }
  }
  //   const userOptions = userListValue?.userAllList?.map((user) => {
  //     return {
  //       label: user.name,
  //       value: user.id
  //     }
  //   })
  //   const topicOptions = topicListValue?.AllTopicList?.map((topic) => {
  //     return {
  //       label: topic.topicName,
  //       value: topic.topicId
  //     }
  //   })
  // useEffect(() => {
  //   dispatch(getAllUserList())
  //   dispatch(getAllTopicList())
  // }, [])

  return (
    <>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={() => setShow(!show)}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent "
          toggle={() => setShow(!show)}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center mb-0">
            <h1 className="mb-0">Add City</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="Users">
                  City <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name="city"
                      control={control}
                      invalid={errors.city && true}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="baseUrl">
                  Description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name="description"
                      type="textarea"
                      control={control}
                      maxLength="150"
                      placeholder={'Allow Only 150 Character'}
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
              </div>
            </Col>

            <Col xs={12} className="text-center mt-2 mb-1">
              <Button className="me-1" color="primary" type="submit">
                Add
              </Button>
              <Button outline type="reset" onClick={handleDiscard}>
                Discard
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default AddForm
