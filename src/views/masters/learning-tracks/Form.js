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
  addLearningTrack,
  selectLearningTrack,
  setLoader,
  updateLearningTrack
} from './store'
import {
  formatDate,
  imageRegex,
  numRegex,
  selectThemeColors
} from '../../../utility/Utils'
import ImageComp from '../../../utility/commonComponents/ImageComp'
import { Bold, Trash2 } from 'react-feather'
import moment from 'moment'

const defaultValues = {
  name: '',
  curriculum: '',
  objective: '',
  startDate: '',
  endDate: '',
  enrollCloseDate: '',
  sponsorId: [],
  trainerId: [],
  imageUrl: '',
  bannerUrl: '',
  brochure: '',
  status: ''
}
const onlyNumber = ''
const AddForm = ({
  setShow,
  isEdit,
  showFileInputField,
  showUploadFileInput,
  setShowUploadFileInput,
  setShowFileInputField
}) => {
  const [file, setFile] = useState()
  const [isFileUpdated, setIsFileUpdated] = useState(false)

  let startDateFiled = isEdit
    ? { dateFormat: 'Y-m-d' }
    : { minDate: 'today', dateFormat: 'Y-m-d' }

  const { loader, selected, params } = useSelector(
    (state) => state?.learningTrack
  )

  const { departmentsDropdown } = useSelector((state) => state?.functions)

  const sponsorList = useSelector((state) => state?.sponsorMaster?.allSponsor)
  const trainerList = useSelector((state) => state?.trainerMaster?.allTrainer)
  const statusOptions = [
    { label: 'UPCOMMING', value: 'UPCOMMING' },
    { label: 'LAUNCHED', value: 'LAUNCHED' }
  ]

  const [objectiveContent, setobjectiveContent] = useState(
    EditorState.createEmpty()
  )
  const [curriculumContent, setCurriculumContent] = useState(
    EditorState.createEmpty()
  )
  const [typeEdit, setTypeEdit] = useState(false)
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

  const imageUrl = watch('imageUrl')
  const bannerUrl = watch('bannerUrl')
  const watchStartDate = watch('startDate')
  const watchEndDate = watch('endDate')
  const watchEnrollCloseDate = watch('enrollCloseDate')

  const handleDiscard = () => {
    reset()
    setShow(false)
  }
  const handleEditorChange = (state) => {
    setEditorState(state)
  }
  //Render File Size For File Upload Feature
  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  //Handle the uploaded file
  const handleFile = (e) => {
    setIsFileUpdated(true)
    setValue('brochure', e.target.files[0]?.name)
    setFile(e.target?.files[0])
  }

  //Remove file method for edit the file uploader
  const handleRemovedFiles = () => {
    setFile(null)
    setShowUploadFileInput(true)
    setShowFileInputField(false)
    setTypeEdit(false)
    setIsFileUpdated(true)
    setValue('brochure', null)
  }
  const trainerOptions = trainerList?.map((trainer) => {
    return {
      label: trainer.trainerName,
      value: trainer.trainerId
    }
  })
  const sponserOptions = sponsorList?.map((sponser) => {
    return {
      label: sponser.sponsorName,
      value: sponser.id
    }
  })
  const handleModalClosed = () => {
    // dispatch(selectLearningTrack(null))
    setShow(false)
    reset()
    dispatch(selectLearningTrack(null))
  }

  const departmentsOptions = departmentsDropdown?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })

  const onSubmit = async (data) => {
    let formData = new FormData()
    const curriculumData = draftToHtml(
      convertToRaw(curriculumContent.getCurrentContent())
    )
    const objectiveData = draftToHtml(
      convertToRaw(objectiveContent.getCurrentContent())
    )
    let response = ''

    if (selected) {
      formData.append('isFileUpdated', isFileUpdated)
      formData.append('name', data.name)
      formData.append('curriculum', curriculumData)
      formData.append('objective', objectiveData)
      formData.append('bannerUrl', data.bannerUrl)
      formData.append('imageUrl', data.imageUrl)
      formData.append('status', data.status.value)
      formData.append('startDate', formatDate(watchStartDate))
      formData.append('endDate', formatDate(watchEndDate))
      formData.append('description', data.description)
      formData.append('maxEnroll', data.maxEnroll)
      formData.append('enrollCloseDate', formatDate(watchEnrollCloseDate))
      if (data.sponsorId.length > 0) {
        formData.append(
          'sponsorId',
          data.sponsorId.map((temp) => temp.value).join(',')
        )
      } else {
        formData.append('sponsorId', [])
      }
      if (data.departmentId.length > 0) {
        formData.append(
          'departmentId',
          data.departmentId.map((temp) => temp.value).join(',')
        )
      }
      if (data.trainerId.length > 0) {
        formData.append(
          'trainerId',
          data.trainerId.map((temp) => temp.value).join(',')
        )
      } else {
        formData.append('trainerId', [])
      }
      if (isFileUpdated) {
        // formData.append('brochure', data.brochure)
        formData.append('brochure', file ?? null)
      }

      await dispatch(setLoader(true))
      response = await dispatch(
        updateLearningTrack({
          formData,
          id: selected?.id,
          params
        })
      )
    } else {
      formData.append('isFileUpdated', isFileUpdated)
      formData.append('name', data.name)
      formData.append('curriculum', curriculumData)
      formData.append('objective', objectiveData)
      formData.append('bannerUrl', data.bannerUrl)
      formData.append('imageUrl', data.imageUrl)
      formData.append('status', data.status.value)
      formData.append('startDate', formatDate(watchStartDate))
      formData.append('endDate', formatDate(watchEndDate))
      formData.append('description', data.description)
      formData.append('brochure', file)
      formData.append('maxEnroll', data.maxEnroll)
      formData.append('enrollCloseDate', formatDate(watchEnrollCloseDate))
      if (data.sponsorId.length > 0) {
        formData.append(
          'sponsorId',
          data.sponsorId.map((temp) => temp.value).join(',')
        )
      } else {
        formData.append('sponsorId', [])
      }
      if (data.departmentId.length > 0) {
        formData.append(
          'departmentId',
          data.departmentId.map((temp) => temp.value).join(',')
        )
      }

      if (data.trainerId.length > 0) {
        formData.append(
          'trainerId',
          data.trainerId.map((temp) => temp.value).join(',')
        )
      } else {
        formData.append('trainerId', [])
      }
      await dispatch(setLoader(true))
      response = await dispatch(
        addLearningTrack({
          formData,
          params
        })
      )
    }
    if (response?.payload) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    console.log('isFileUpdated initail', isFileUpdated)
    if (selected) {
      if (selected.fileUrl == null) {
        setIsFileUpdated(true)
      }
      const {
        trainerId,
        trackTrainer,
        status,
        trackSponsors,
        trackDepartmentEntity
      } = selected

      setValue('name', selected.name)
      setValue('bannerUrl', selected?.bannerUrl ?? '')
      setValue('imageUrl', selected.imageUrl)
      setValue('description', selected.description)
      setValue('maxEnroll', selected.maxEnroll)
      setValue('fileName', selected?.fileName)

      setValue(
        'status',
        statusOptions.filter((temp) => temp.label === selected.status)[0]
      )

      // const myStartDate = moment(selected.startDate)._i
      // setStartPicker(myStartDate)
      setValue('endDate', selected.endDate)

      // const myEndDate = moment(selected.endDate)._i
      // setEndPicker(myEndDate)
      setValue('startDate', selected.startDate)

      // const enrollClose = moment(selected.enrollCloseDate)._i
      // setEnrollCloseDate(enrollClose)
      setValue('enrollCloseDate', selected.enrollCloseDate)

      if (selected.curriculum) {
        const curriculamFromHtml = htmlToDraft(selected.curriculum)
        const curriculumState = ContentState.createFromBlockArray(
          curriculamFromHtml.contentBlocks,
          curriculamFromHtml.entityMap
        )
        const newCurriculumState =
          EditorState.createWithContent(curriculumState)
        setCurriculumContent(newCurriculumState)
        setValue('curriculum', curriculumContent)
      }

      if (selected.objective) {
        const objectiveFromHtml = htmlToDraft(selected.objective)
        const objectiveState = ContentState.createFromBlockArray(
          objectiveFromHtml.contentBlocks,
          objectiveFromHtml.entityMap
        )
        const newObjectiveState = EditorState.createWithContent(objectiveState)
        setobjectiveContent(newObjectiveState)
        setValue('objective', objectiveContent)
      }

      let departmentdata = []
      if (trackDepartmentEntity) {
        trackDepartmentEntity.map((val) => {
          departmentdata.push({
            label: val.departmentName,
            value: val.departmentId
          })
        })
      }
      setValue('departmentId', departmentdata)

      let sponserData = []
      if (trackSponsors) {
        trackSponsors.map((val) => {
          sponserData.push({
            label: val.sponsorName,
            value: val.sponsor_id
          })
        })
        setValue('sponsorId', sponserData)
      }
      let trainerdata = []
      if (trackTrainer) {
        trackTrainer.map((val) => {
          trainerdata.push({
            label: val.trainersMasterName,
            value: val.trainerId
          })
        })
        setValue('trainerId', trainerdata)
      }
    }
    typeEdit && selected?.fileUrl !== null
      ? setShowFileInputField(true)
      : setShowUploadFileInput(false)
    isEdit && setTypeEdit(true)
  }, [])

  useEffect(() => {
    typeEdit && selected?.fileUrl !== null
      ? setShowFileInputField(true)
      : setShowUploadFileInput(false)
  }, [selected?.fileUrl, showUploadFileInput, showFileInputField])

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
            <h1 className="mb-0">{isEdit ? 'Edit' : 'Add'} Learning Tracks</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col sm={12} display="flex" className="mb-1">
              <Label className="form-label" for="Users">
                Track Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="name"
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Track Name"
                    maxLength="100"
                    {...register('name', {
                      required: 'Please enter track name'
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
              <Label className="form-label" for="trainerId">
                Trainer Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="trainerId"
                name="trainerId"
                control={control}
                rules={{ required: 'Please select trainer' }}
                // invalid={errors.trainerId && true}
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    placeholder="Select"
                    isMulti
                    classNamePrefix="select"
                    options={trainerOptions}
                    theme={selectThemeColors}
                    className={classnames('react-select', {
                      'is-invalid': errors.trainerId
                    })}
                    {...field}
                  />
                )}
              />
              {errors.trainerId && (
                <FormFeedback>{errors.trainerId.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="department">
                Function <span className="text-danger">*</span>
              </Label>
              <Controller
                id="departmentId"
                name="departmentId"
                control={control}
                rules={{ required: 'Please select Function' }} // add a required rule
                render={({ field }) => (
                  <Select
                    isMulti
                    placeholder="Select"
                    classNamePrefix="select"
                    options={departmentsOptions}
                    theme={selectThemeColors}
                    className={classnames('react-select', {
                      'is-invalid': errors.departmentId
                    })}
                    {...field}
                  />
                )}
              />
              {errors.departmentId && (
                <FormFeedback>{errors.departmentId.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="sponsorId">
                Sponsor Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="sponsorId"
                name="sponsorId"
                control={control}
                rules={{ required: 'Please select sponsor' }}
                render={({ field }) => (
                  <Select
                    isClearable={true}
                    placeholder="Select"
                    isMulti
                    classNamePrefix="select"
                    options={sponserOptions}
                    theme={selectThemeColors}
                    className={classnames('react-select', {
                      'is-invalid': errors.sponsorId
                    })}
                    {...field}
                  />
                )}
              />
              {errors.sponsorId && (
                <FormFeedback>{errors.sponsorId.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} className="mb-1" display="flex">
              <Label className="form-label" for="Users">
                Status <span className="text-danger">*</span>
              </Label>
              <Controller
                id="status"
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    classNamePrefix="select"
                    options={statusOptions}
                    theme={selectThemeColors}
                    invalid={errors.status ? true : false}
                    {...register('status', {
                      required: 'Please select status'
                    })}
                    className={classnames('react-select', {
                      'is-invalid': errors.status
                    })}
                    {...field}
                  />
                )}
              />
              {errors && errors.status && (
                <FormFeedback>{errors.status.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="startDate">
                Start Date <span className="text-danger">*</span>
              </Label>
              <Controller
                id="startDate"
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    required
                    placeholder="YYYY-MM-DD"
                    className={`form-control flatpickr-input ${
                      errors.startDate && 'is-invalid'
                    }`}
                    onChange={(date) => {
                      const event = {
                        target: {
                          name: 'startDate',
                          value: date[0]
                        }
                      }
                      register('startDate')(event)
                    }}
                    {...register('startDate', {
                      required: 'Please enter Start Date'
                    })}
                    invalid={errors.startDate ? true : false}
                    {...field}
                    options={startDateFiled}
                  />
                )}
              />
              {errors && errors.startDate && (
                <FormFeedback>{errors.startDate.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="endDate">
                End Date <span className="text-danger">*</span>
              </Label>
              <Controller
                id="endDate"
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    required
                    placeholder="YYYY-MM-DD"
                    className={`form-control flatpickr-input ${
                      errors.endDate && 'is-invalid'
                    }`}
                    onChange={(date) => {
                      const event = {
                        target: {
                          name: 'endDate',
                          value: date[0]
                        }
                      }
                      register('endDate')(event)
                    }}
                    {...register('endDate', {
                      required: 'Please enter End Date'
                    })}
                    invalid={errors.endDate ? true : false}
                    {...field}
                    options={{
                      dateFormat: 'Y-m-d',
                      minDate: formatDate(watchStartDate[0])
                    }}
                  />
                )}
              />
              {errors && errors.endDate && (
                <FormFeedback>{errors.endDate.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="maxEnroll">
                Max Enroll Count<span className="text-danger">*</span>
              </Label>
              <Controller
                id="maxEnroll"
                name="maxEnroll"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Count"
                    maxLength="100"
                    pattern="[0-9]*"
                    {...register('maxEnroll', {
                      required: 'Please enter enroll count',
                      pattern: {
                        value: /^[0-9]*$/,
                        message: 'Please enter only number'
                      }
                    })}
                    invalid={errors.maxEnroll ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.maxEnroll && (
                <FormFeedback>{errors.maxEnroll.message}</FormFeedback>
              )}
            </Col>
            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="enrollCloseDate">
                Enrollment close date<span className="text-danger">*</span>
              </Label>
              <Controller
                id="enrollCloseDate"
                name="enrollCloseDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    required
                    placeholder="YYYY-MM-DD"
                    className={`form-control flatpickr-input ${
                      errors.enrollCloseDate && 'is-invalid'
                    }`}
                    onChange={(date) => {
                      const event = {
                        target: {
                          name: 'enrollCloseDate',
                          value: date[0]
                        }
                      }
                      register('enrollCloseDate')(event)
                    }}
                    {...register('enrollCloseDate', {
                      required: 'Please enter Enroll Close Date'
                    })}
                    invalid={errors.enrollCloseDate ? true : false}
                    {...field}
                    options={{
                      dateFormat: 'Y-m-d',
                      // minDate: formatDate(watchStartDate),
                      maxDate: formatDate(watchStartDate)
                    }}
                  />
                )}
              />

              {errors && errors.enrollCloseDate && (
                <FormFeedback>{errors.enrollCloseDate.message}</FormFeedback>
              )}
            </Col>
            {typeEdit && selected?.fileUrl !== null ? (
              <Col sm={6} className="mb-1 " display="flex">
                <Label className="form-label d-flex" for="fileName">
                  Upload Brochure
                </Label>
                <div className="d-flex ">
                  <Controller
                    name="fileName"
                    control={control}
                    render={({ field }) => <Input name="fileName" {...field} />}
                  />
                  <Button
                    color="danger"
                    outline
                    size="sm"
                    className="btn-icon ms-1"
                    onClick={() => handleRemovedFiles()}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </Col>
            ) : (
              <Col sm={6} className="mb-1">
                <Label className="form-label" for="brochure">
                  Upload Brochure
                </Label>
                <Controller
                  id="brochure"
                  name="brochure"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="brochure"
                      type="file"
                      name="brochure"
                      invalid={errors.brochure && true}
                      onChange={handleFile}
                      files={file}
                    />
                  )}
                />
                <p className="file-size mb-0">
                  {file ? renderFileSize(file?.size) : ''}
                </p>
              </Col>
            )}

            <Col className="mb-1">
              <Label className="form-label" for="description">
                Summary <span className="text-danger">*</span>
              </Label>
              <Controller
                name="description"
                control={control}
                {...register('description', {
                  required: 'Please enter Description'
                  // validate: SpecialCharactersFieldValidion
                  // Add the custom validation rule
                })}
                render={({ field }) => (
                  <Input
                    id="description"
                    type="textarea"
                    maxLength="500"
                    // rows={8}
                    placeholder="Only 500 characters allowed"
                    invalid={errors.description && true}
                    {...field}
                  />
                )}
              />
              {errors && errors.description && (
                <FormFeedback>{errors.description.message}</FormFeedback>
              )}
            </Col>

            <Col sm="6" className="mb-2">
              <Label className="form-label">
                Curriculum<span className="text-danger">*</span>
              </Label>
              <Controller
                id="curriculum"
                name="curriculum"
                control={control}
                // rules={{
                //   validate:{
                //     required: "reuired"
                //   }
                // }}
                render={({ field }) => (
                  <Editor
                    editorState={curriculumContent}
                    onEditorStateChange={(data) => setCurriculumContent(data)}
                    placeholder="Enter curriculum"
                    editorClassName="rounded-1 border-1"
                    toolbar={{
                      options: ['inline', 'textAlign', 'list', 'link'],
                      textAlign: { inDropdown: false },
                      list: { inDropdown: false },
                      bold: { className: 'bold-font-css' },
                      inline: {
                        inDropdown: false,
                        options: [
                          'bold',
                          'italic',
                          'underline',
                          'strikethrough'
                        ]
                      }
                    }}
                    {...register('curriculum', {
                      required: 'Please enter Curriculum'
                    })}
                    invalid={errors.curriculum ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.curriculum && (
                <FormFeedback>{errors.curriculum.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} display="flex" className="mb-1">
              <Label className="form-label" for="objective">
                Objective <span className="text-danger">*</span>
              </Label>
              <Controller
                id="objective"
                name="objective"
                control={control}
                render={({ field }) => (
                  <Editor
                    editorState={objectiveContent}
                    onEditorStateChange={(data) => setobjectiveContent(data)}
                    placeholder="Enter objective"
                    editorClassName="rounded-1 border-1"
                    toolbar={{
                      options: ['inline', 'textAlign', 'list', 'link'],
                      textAlign: { inDropdown: false },
                      list: { inDropdown: false },
                      bold: { className: 'bold-font-css' },
                      inline: {
                        inDropdown: false,
                        options: [
                          'bold',
                          'italic',
                          'underline',
                          'strikethrough'
                        ]
                      }
                    }}
                    {...field}
                  />
                )}
              />
              {errors && errors.objective && (
                <FormFeedback>{errors.objective.message}</FormFeedback>
              )}
            </Col>

            <Col sm={6} className="mb-1" display="flex">
              <Label className="form-label" for="imageUrl">
                Image Url <span className="text-danger">*</span>
              </Label>
              <Controller
                id="imageUrl"
                name="imageUrl"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Image URL"
                    {...register('imageUrl', {
                      required: 'Please enter URL',
                      pattern: {
                        // value: imageRegex,
                        message: 'Please Enter Valid Image URL'
                      }
                    })}
                    invalid={errors.imageUrl ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.imageUrl && (
                <FormFeedback>{errors.imageUrl.message}</FormFeedback>
              )}
              <ImageComp imageUrl={imageUrl} />
            </Col>

            <Col sm={6} className="mb-1" display="flex">
              <Label className="form-label" for="bannerUrl">
                Banner Url
              </Label>
              <Controller
                id="bannerUrl"
                name="bannerUrl"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Banner URL"
                    {...register('bannerUrl', {
                      // required: 'Please enter URL',
                      pattern: {
                        // value: imageRegex,
                        message: 'Please Enter Valid Banner URL'
                      }
                    })}
                    invalid={errors.bannerUrl ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.bannerUrl && (
                <FormFeedback>{errors.bannerUrl.message}</FormFeedback>
              )}
              <ImageComp imageUrl={bannerUrl} />
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
