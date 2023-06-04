import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { selectThemeColors } from '@utils'
import { SpecialCharactersFieldValidion } from '../../../../utility/Commonfunction'
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
import { TEXT_AREA_PLACEHOLDER } from '../../../../utility/constants'
import { characterRegex, imageRegex } from '../../../../utility/Utils'

import classnames from 'classnames'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import './Form.scss'
import {
  addTestimonial,
  selectTestimonial,
  setLoader,
  updateTestimonial
} from '../store'
import {
  fetchDesignationDropdown,
  fetchDesignationList
} from '../../designation/store'
import { fetchDepartmentsList } from '../../functions/store'

const defaultValues = {}
const AddForm = ({ setShow }) => {
  const { loader, selected, params } = useSelector(
    (state) => state?.testimonial
  )
  const dispatch = useDispatch()

  const {
    reset,
    control,
    setError,
    setValue,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ defaultValues })

  const [data, setData] = useState(null)
  const imageUrl = watch('imageUrl')

  const [viewPic, setViewPic] = useState(false)
  //   const topicListValue = useSelector((state) => state?.topic)
  //   const userListValue = useSelector((state) => state?.user?.userAllList)

  const handleDiscard = () => {
    reset()
    setShow(false)
  }
  const handleModalClosed = () => {
    setShow(false)
    dispatch(selectTestimonial(null))
    reset()
  }

  const { designationList } = useSelector((state) => state?.designationMaster)
  const designationOptions = designationList?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })

  let { departmentsList } = useSelector((state) => state?.functions)

  const departmentsOptions = departmentsList?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })

  useEffect(() => {
    dispatch(fetchDesignationList())
    dispatch(fetchDepartmentsList())
  }, [])

  const onSubmit = async (data) => {
    let response = ''

    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        updateTestimonial({
          id: selected?.id,
          userName: data.userName,
          designationId: data?.designationId?.value,
          testimonial: data?.testimonial,
          departmentId: data?.departmentId?.value,
          imageUrl: data?.imageUrl,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addTestimonial({
          userName: data.userName,
          designationId: data?.designationId?.value,
          testimonial: data?.testimonial,
          departmentId: data?.departmentId?.value,
          imageUrl: data?.imageUrl,
          params
        })
      )
    }
    if (response) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    dispatch(fetchDesignationDropdown())
    if (selected) {
      setValue('userName', selected.userName)
      if (selected?.departmentId) {
        setValue('departmentId', {
          label: selected?.departmentName,
          value: selected?.departmentId
        })
      }
      if (selected?.designationId) {
        setValue('designationId', {
          label: selected?.designationName,
          value: selected?.designationId
        })
      }
      setValue('imageUrl', selected.imageUrl)
      setValue('testimonial', selected.testimonial)
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    setPhotoLink(e.target.value)
  }

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
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Testimonial</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="name">
                  User Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="userName"
                  name="userName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter User Name"
                        {...register('userName', {
                          required: 'Please enter User Name',
                          pattern: {
                            value: characterRegex,
                            message: 'Allow Only 100 Character'
                          }
                        })}
                        invalid={errors.userName && true}
                        {...field}
                      />
                      {errors.userName && (
                        <FormFeedback>{errors.userName.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="designationId">
                  Designation <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="designationId"
                  name="designationId"
                  rules={{ required: 'Designation is required' }}
                  invalid={errors.designationId && true}
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      placeholder="select"
                      classNamePrefix="select"
                      options={designationOptions}
                      theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': errors.designationId
                        // selected !== null && selected.module === null
                      })}
                      {...field}
                    />
                  )}
                />
                {errors.designationId && (
                  <FormFeedback>{errors.designationId.message}</FormFeedback>
                )}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="departmentId">
                  Function <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="departmentId"
                  name="departmentId"
                  rules={{ required: 'Department is required' }}
                  invalid={errors.departmentId && true}
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      placeholder="select"
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
              </div>

              <div className="mb-1">
                <Label className="form-label" for="testimonial">
                  Testimonial <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="testimonial"
                  control={control}
                  {...register('testimonial', {
                    required: 'Please enter Testimonial'
                    // validate: SpecialCharactersFieldValidion
                    // Add the custom validation rule
                  })}
                  render={({ field }) => (
                    <Input
                      id="testimonial"
                      type="textarea"
                      maxLength="500"
                      rows={8}
                      placeholder="Only 500 characters allowed"
                      invalid={errors.testimonial && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.testimonial && (
                  <FormFeedback>{errors.testimonial.message}</FormFeedback>
                )}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="file">
                  Profile image url <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="imageUrl"
                      name="imageUrl"
                      {...register('imageUrl', {
                        required: 'Profile image required',
                        pattern: {
                          value: imageRegex,
                          message: 'Please enter Valid URL'
                        }
                      })}
                      invalid={errors.imageUrl && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.imageUrl && (
                  <FormFeedback>{errors.imageUrl.message}</FormFeedback>
                )}
              </div>
              <img src={imageUrl} alt="" className="img-fluid mt-2" />
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

export default AddForm
