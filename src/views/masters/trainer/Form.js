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
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { addTrainer, selectTrainer, editTrainer, setLoader } from './store'
import { fetchDesignationDropdown } from '../designation/store'
import { fetchUserList, fetchAllUserList } from '../user/store'
import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'
import ImageComp from '../../../utility/commonComponents/ImageComp'
import { TEXT_AREA_PLACEHOLDER } from '../../../utility/constants'
import { characterRegex, imageRegex } from '../../../utility/Utils'

const defaultValues = {}
const AddForm = ({ setShow }) => {
  const { loader, selected, params } = useSelector(
    (state) => state?.trainerMaster
  )
  const { designationDropdown } = useSelector(
    (state) => state?.designationMaster
  )
  const designationOptions = designationDropdown?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })
  let { userAllList } = useSelector((state) => state?.userMaster)

  const userOptions = userAllList?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })

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

  const imageUrl = watch('imageUrl')
  const userChange = watch('user')

  const handleModalClosed = () => {
    setShow(false)
    reset()
    dispatch(selectTrainer(null))
  }
  const onSubmit = async (data) => {
    let response = ''
    if (selected) {
      await dispatch(setLoader(true))
      const TrainerName = {
        description: data?.description,
        designationId: data?.designationId?.value,
        imageUrl: data?.imageUrl,
        name: data?.name,
        user: data?.user?.value
      }
      response = await dispatch(
        editTrainer({
          id: selected?.trainerId,
          TrainerName,
          params
        })
      )
    } else {
      const TrainerName = {
        description: data?.description,
        designationId: data?.designationId?.value,
        imageUrl: data?.imageUrl,
        name: data?.name,
        user: data?.user?.value
      }
      response = await dispatch(
        addTrainer({
          TrainerName,
          params
        })
      )
    }

    if (response) {
      handleModalClosed()
    }
  }
  useEffect(() => {
    setValue('name', userChange ? userChange.label : '')
  }, [userChange])

  useEffect(() => {
    dispatch(fetchAllUserList())
    dispatch(fetchDesignationDropdown())
    if (selected) {
      if (selected.userId) {
        setValue('user', {
          label: selected.userName,
          value: selected.userId
        })
      }
      if (selected.designationId) {
        setValue('designationId', {
          label: selected.designation,
          value: selected.designationId
        })
      }
      setValue('name', selected?.trainerName)
      setValue('description', selected.description)
      setValue('imageUrl', selected.imageUrl)
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
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Trainer</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="name">
                  User Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter Name"
                        {...register('name', {
                          required: 'Please enter name',
                          pattern: {
                            value: characterRegex,
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
                <Label className="form-label" for="designationId">
                  Designation <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="designationId"
                  name="designationId"
                  control={control}
                  rules={{ required: 'Designation is required' }} // add a required rule
                  invalid={errors.designationId && true}
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      placeholder="select"
                      classNamePrefix="select"
                      options={designationOptions}
                      theme={selectThemeColors}
                      className={classnames('react-select', {
                        'is-invalid': errors.designationId
                      })}
                      {...field}
                    />
                  )}
                />
                {errors && errors.designationId && (
                  <div className="err_msg">{errors.designationId.message}</div>
                )}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="user">
                  User
                </Label>
                <Controller
                  id="user"
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <Select
                      isClearable={true}
                      placeholder="select"
                      classNamePrefix="select"
                      options={userOptions}
                      theme={selectThemeColors}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="mb-1">
                <Label className="form-label" for="baseUrl">
                  Description <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      name="description"
                      type="textarea"
                      control={control}
                      {...register('description', {
                        required: 'Please enter Description'
                        // validate: SpecialCharactersFieldValidion // Add the custom validation rule
                      })}
                      maxLength="500"
                      placeholder="Only 500 Characters allowed"
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
                )}
              </div>

              <div className="mb-1">
                <Label className="form-label" for="imageUrl">
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
                <ImageComp imageUrl={imageUrl} />
              </div>
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
