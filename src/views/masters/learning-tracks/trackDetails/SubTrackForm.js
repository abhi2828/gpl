import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  Spinner
} from 'reactstrap'
import moment from 'moment'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { addSubTrack, editSubTrack, selectSubTrack, setLoader } from './store'
import { Switch } from '@mui/material'
import { formatDate } from '../../../../utility/Utils'

const SubTrackForm = ({ setShow, isEdit, setIsEdit, subTrackId }) => {
  const selectedTrack = useSelector((state) => state?.learningTrack)

  const { loader, selected, params } = useSelector((state) => state?.subTrack)

  const dispatch = useDispatch()
  const defaultValues = {
    name: '',
    startDate: '',
    endDate: '',
    // completedDate: '',
    // starPerformer: '',
    learningTrackId: ''
  }
  const [isStarPerformer, setIsStarPerformer] = useState(false)
  const [endPicker, setEndPicker] = useState()
  const [completePicker, setCompletePicker] = useState()
  const [startPicker, setStartPicker] = useState()

  let dateError = ''
  if (startPicker > endPicker) {
    dateError = 'End date must be after start date'
  }

  const {
    reset,
    control,
    setError,
    setValue,
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleModalClosed = () => {
    setShow(false)
    setIsEdit(false)
    reset()
    dispatch(selectSubTrack(null))
  }
  const onSubmit = async (data) => {
    let response = ''

    if (isEdit) {
      await dispatch(setLoader(true))
      response = await dispatch(
        editSubTrack({
          id: subTrackId,
          name: data.name,
          startDate: formatDate(startPicker),
          endDate: formatDate(endPicker),
          learningTrackId: selectedTrack.LearningListById.id
          // params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addSubTrack({
          name: data.name,
          startDate: formatDate(startPicker),
          endDate: formatDate(endPicker),
          // completedDate: formatDate(completePicker),
          // starPerformer: isStarPerformer,
          learningTrackId: selectedTrack.LearningListById.id
          // params
        })
      )
    }
    if (response) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    if (isEdit) {
      setValue('name', selected.subtrackName)

      const myStartDate = moment(selected.startDate)._i
      setStartPicker(myStartDate)
      setValue('endDate', myStartDate)

      const myEndDate = moment(selected.endDate)._i
      setEndPicker(myEndDate)
      setValue('startDate', myEndDate)

      // setValue('completedDate', selected.completedDate)
      // setValue('starPerformer', selected.starPerformer)
    }
  }, [])

  return (
    <>
      <Modal
        isOpen={true}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent "
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center mb-0">
            <h1 className="mb-0">{isEdit ? 'Edit' : 'Add'} SubTrack</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="name">
                  SubTrack Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter SubTrack Name"
                        {...register('name', {
                          required: 'Please enter SubTrack name',
                          pattern: {
                            // value: characterRegex,
                            message: 'Allow Only 100 Character'
                          }
                        })}
                        invalid={errors.name && true}
                        {...field}
                      />
                      {errors.name && (
                        <FormFeedback>{errors.name.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="startDate">
                  Start Date <span className="text-danger">*</span>
                </Label>
                <Flatpickr
                  required
                  id="startDate"
                  name="startDate"
                  placeholder="YYYY-MM-DD"
                  className="form-control flatpickr-input"
                  onChange={(date) => setStartPicker(date[0])}
                  value={startPicker}
                  options={{
                    dateFormat: 'Y-m-d'
                  }}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="endDate">
                  End Date <span className="text-danger">*</span>
                </Label>
                <Flatpickr
                  required
                  id="endDate"
                  name="endDate"
                  placeholder="YYYY-MM-DD"
                  className="form-control my-1"
                  onChange={(date) => setEndPicker(date[0])}
                  value={endPicker}
                  options={{
                    dateFormat: 'Y-m-d'
                  }}
                />
                {dateError ? (
                  <small className="text-danger">{dateError}</small>
                ) : (
                  ''
                )}
              </div>

              {/* <div className="mb-1">
                <Label className="form-label" for="completedDate">
                  Complete Date
                </Label>
                <Flatpickr
                  required
                  id="completedDate"
                  name="completedDate"
                  placeholder="YYYY-MM-DD"
                  className="form-control my-1"
                  onChange={(date) => setCompletePicker(date[0])}
                  value={completePicker}
                  options={{
                    dateFormat: 'Y-m-d'
                  }}
                />
                {dateError ? (
                  <small className="text-danger">{dateError}</small>
                ) : (
                  ''
                )}
              </div> */}

              {/* <div className="mb-1">
                <Label className="form-label" for="name">
                  Star Performer
                </Label>
                <Switch
                  checked={isStarPerformer}
                  onChange={(e) => setIsStarPerformer(!isStarPerformer)}
                />
              </div> */}
            </Col>

            <Col xs={12} className="text-center mt-2 mb-1">
              <Button
                className="me-1"
                color="primary"
                type="submit"
                disabled={loader}
              >
                {loader ? (
                  <Spinner text="Loading..." color="white" size="sm" />
                ) : (
                  'Submit'
                )}
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default SubTrackForm
