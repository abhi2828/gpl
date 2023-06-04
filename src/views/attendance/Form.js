import classNames from 'classnames'
import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'

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
import Select from 'react-select'
import classnames from 'classnames'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {
  addAttendance,
  selectAttendance,
  setLoader,
  editAttendance
} from './store'

import { Trash2 } from 'react-feather'
import moment from 'moment'
import { fetchAllAttendance } from './store/index'
import { selectThemeColors } from '@utils'
import { formatDate } from '../../utility/Utils'

const defaultValues = {
  name: '',
  trackName: '',
  subTrackName: '',
  date: '',
  email: '',
  zone: '',
  starPerformer: '',
  employeeEDP: '',
  functionName: '',
  startDate: '',
  endDate: ''
}
const AddForm = ({ setShow, isEdit }) => {
  const { loader, selected, params } = useSelector((state) => state?.attendance)

  const [datePicker, setDatePicker] = useState()
  const [endPicker, setEndPicker] = useState()
  const [startPicker, setStartPicker] = useState()

  let dateError = ''
  if (startPicker > endPicker) {
    dateError = 'End date must be after start date'
  }

  const dispatch = useDispatch()
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

  const handleStartDateChange = (date) => {
    const newStartDate = date[0]
    // if (newStartDate >= endPicker) {
    //   setError('Start date must be before end date')
    // } else {
    //   setError('')
    //   setStartPicker(newStartDate)
    // }
  }

  const handleDiscard = () => {
    reset()
    setShow(false)
  }
  const handleEditorChange = (state) => {
    setEditorState(state)
  }

  const handleModalClosed = () => {
    // dispatch(selectLearningTrack(null))
    setShow(false)
    reset()
    dispatch(selectAttendance(null))
  }

  const onSubmit = async (data) => {
    let response = ''

    const formData = new FormData()
    formData.append('name', data.name)
    formData.append('trackName', data.trackName)
    formData.append('subTrackName', data.subTrackName)
    formData.append('date', formatDate(datePicker))
    formData.append('email', data.email)
    formData.append('zone', data.zone)
    // formData.append('starPerformer', data.starPerformer)
    formData.append('employeeEDP', data.employeeEDP)
    formData.append('functionName', data.functionName)
    formData.append('startDate', formatDate(startPicker))
    formData.append('endDate', formatDate(endPicker))

    // If type = Edit
    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        editAttendance({
          formData,
          id: selected?.id,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addAttendance({
          formData,
          params
        })
      )
    }
    if (response) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    dispatch(fetchAllAttendance())
    if (selected) {
      const { trainerId, trainerName, sponsorId, sponsorName } = selected

      setValue('name', selected.name)
      setValue('trackName', selected.trackName)
      setValue('subTrackName', selected.subTrackName)

      const date = moment(selected.date)._i
      setDatePicker(date)
      setValue('date', date)

      setValue('email', selected.email)
      setValue('zone', selected.zone)
      // setValue('starPerformer', selected.starPerformer)
      setValue('starPerformer', True)
      setValue('employeeEDP', selected.employeeEDP)
      setValue('functionName', selected.functionName)

      const myStartDate = moment(selected.startDate)._i
      setStartPicker(myStartDate)
      setValue('endDate', myStartDate)

      const myEndDate = moment(selected.endDate)._i
      setEndPicker(myEndDate)
      setValue('startDate', myEndDate)
    }
  }, [])

  return (
    <>
      <Modal
        isOpen={true}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent "
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center mb-0">
            <h1 className="mb-0">{isEdit ? 'Edit' : 'Add'} Attendance</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col sm={12} display="flex" className="mb-1">
              <Label className="form-label" for="name">
                Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="name"
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Name"
                    maxLength="100"
                    {...register('name', {
                      required: 'Please enter Name'
                    })}
                    invalid={errors.name ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="trackName">
                Track Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="trackName"
                name="trackName"
                control={control}
                rules={{ required: 'Track name is required' }}
                invalid={errors.trackId && true}
                render={({ field }) => (
                  // <Select
                  //   isClearable={false}
                  //   isMulti
                  //   classNamePrefix="select"
                  //   // options={trainerOptions}
                  //   theme={selectThemeColors}
                  //   className={classnames('react-select', {
                  //     'is-invalid': errors.trainerId
                  //   })}
                  //   {...field}
                  // />
                  <Input
                    placeholder="Enter Track Name"
                    maxLength="100"
                    {...register('trackName', {
                      required: 'Please enter Track Name'
                    })}
                    invalid={errors.name ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.trainerId?.length === 0 && (
                <FormFeedback>At least one Track is required</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="subTrackName">
                Sub-Track Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="subTrackName"
                name="subTrackName"
                control={control}
                rules={{ required: 'Sub-Track name is required' }}
                invalid={errors.trackId && true}
                render={({ field }) => (
                  // <Select
                  //   isClearable={false}
                  //   isMulti
                  //   classNamePrefix="select"
                  //   // options={trainerOptions}
                  //   theme={selectThemeColors}
                  //   className={classnames('react-select', {
                  //     'is-invalid': errors.trainerId
                  //   })}
                  //   {...field}
                  // />
                  <Input
                    placeholder="Enter Sub-Track Name"
                    maxLength="100"
                    {...register('subTrackName', {
                      required: 'Please enter Sub-Track Name'
                    })}
                    invalid={errors.name ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.trainerId?.length === 0 && (
                <FormFeedback>At least one Sub Track is required</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="date">
                Date <span className="text-danger">*</span>
              </Label>
              <Flatpickr
                required
                id="date"
                name="date"
                placeholder="YYYY-MM-DD"
                className="form-control flatpickr-input"
                onChange={(date) => setDatePicker(date[0])}
                value={datePicker}
                options={{
                  dateFormat: 'Y-m-d'
                }}
              />
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="email">
                Email <span className="text-danger">*</span>
              </Label>
              <Controller
                id="email"
                name="email"
                isDisabled
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        // value: emailRegex,
                        message: 'Please enter valid email address'
                      }
                    })}
                    invalid={errors.email}
                    placeholder="Enter email"
                    {...field}
                  />
                )}
              />
              {errors && errors.email && (
                <FormFeedback>{errors.email.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="zone">
                Zone <span className="text-danger">*</span>
              </Label>
              <Controller
                id="zone"
                name="zone"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Zone"
                    maxLength="100"
                    {...register('zone', {
                      required: 'Please enter Zone'
                    })}
                    invalid={errors.name ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </Col>

            {/* <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="starPerformer">
                Rated as Star Performer <span className="text-danger">*</span>
              </Label>
              <Controller
                id="starPerformer"
                name="starPerformer"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Star Performer"
                    maxLength="100"
                    {...register('starPerformer', {
                      required: 'Star Performer'
                    })}
                    invalid={errors.name ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </Col> */}

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="employeeEDP">
                EDP <span className="text-danger">*</span>
              </Label>
              <Controller
                id="employeeEDP"
                name="employeeEDP"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter EDP"
                    maxLength="100"
                    {...register('zone', {
                      required: 'Please enter EDP'
                    })}
                    invalid={errors.name ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="functionName">
                Function Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="functionName"
                name="functionName"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Function Name"
                    maxLength="100"
                    {...register('functionName', {
                      required: 'Please Function Name'
                    })}
                    invalid={errors.name ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="startDate">
                From Date Of Attendance <span className="text-danger">*</span>
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
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="endDate">
                End Date Of Attendance <span className="text-danger">*</span>
              </Label>
              <Flatpickr
                required
                id="endDate"
                name="endDate"
                placeholder="YYYY-MM-DD"
                className="form-control"
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
            </Col>

            <Col xl={12} className="text-center mt-2 mb-1">
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

export default AddForm
