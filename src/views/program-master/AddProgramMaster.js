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
// import { addUser, updateUser } from './store'
// import store, {
//   addAssignTopic,
//   deleteAssignTopic,
//   selectAssignTopic,
//   updateAssignTopic,
//   getAssignTopicList

//   //technologyOptionsUtility
// } from './../assigntopic/store'
// import { getAllRoles } from '../../roles-permissions/roles/rolesStore'
import Select from 'react-select'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
// import { getAllUserList } from '../../master/user/store'
// import { getAllTopicList, getTopicList } from '../../master/topic/store'

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
  //   const onSubmit = (data) => {
  //     if (data?.userId) {
  //       dispatch(
  //         addAssignTopic({
  //           userId: data.userId.value,
  //           topicId: data.topicId.map((t) => {
  //             return t.value
  //           }),
  //           status
  //         })
  //       )
  //       handleDiscard()
  //     } else {
  //       for (const key in data) {
  //         if (data[key] === null) {
  //           setError(key, {
  //             type: 'manual'
  //           })
  //         }
  //         if (data[key] !== null && data[key].length === 0) {
  //           setError(key, {
  //             type: 'manual'
  //           })
  //         }
  //       }
  //     }
  //   }
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
            <h1 className="mb-0">Add Program</h1>
          </div>

          <Row tag={Form} className="p-2">
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="Users">
                  Track Id <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="trackId"
                  name="trackId"
                  control={control}
                  {...register('trackId', {
                    required: 'Please enter Track Id'
                  })}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      //   options={userOptions}
                      //   theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': data !== null && data.userId === null
                      })}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="mb-1">
                <Label className="form-label" for="baseUrl">
                  Objective Description <span className="text-danger">*</span>
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

              <div className="mb-1">
                <Label className="form-label" for="Users">
                  Sponser Id <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="sponsorId"
                  name="sponsorId"
                  control={control}
                  {...register('sponsorId', {
                    required: 'Please enter sponsorId'
                  })}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      //   options={userOptions}
                      //   theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': data !== null && data.userId === null
                      })}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="Users">
                  Sponser Description <span className="text-danger">*</span>
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

              <div className="mb-1">
                <Label className="form-label" for="baseUrl">
                  Curriculam <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="curriculam"
                  name="curriculam"
                  control={control}
                  {...register('curriculam', {
                    required: 'Please Select Curriculam'
                  })}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      isMulti
                      //   options={topicOptions}
                      //   theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': data !== null && data.method === null
                      })}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="inputFile">
                  Upload File
                </Label>
                <Input
                  type="file"
                  name="file"
                  //   onChange={(e) => {
                  //     setFile(e.target.files[0])
                  //   }}
                  //   files={file}
                />
                {/* <p className="file-size mb-0">
              {' '}
              {file ? renderFileSize(file?.size) : ''} (Allowed Max size of
              5000kB)
            </p> */}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="baseUrl">
                  Status <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="status"
                  name="status"
                  control={control}
                  {...register('status', {
                    required: 'Please Select status'
                  })}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      isMulti
                      //   options={topicOptions}
                      //   theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': data !== null && data.method === null
                      })}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="baseUrl">
                  Certificate MasterId <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="certificateMasterId"
                  name="certificateMasterId"
                  control={control}
                  {...register('certificateMasterId', {
                    required: 'Please Select  Certificate MasterId'
                  })}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      classNamePrefix="select"
                      isMulti
                      //   options={topicOptions}
                      //   theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': data !== null && data.method === null
                      })}
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
