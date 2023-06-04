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
import { addSponsor, editSponsor, selectSponsor, setLoader } from './store'
import { fetchDesignationDropdown } from '../designation/store'
import { fetchUserList, fetchAllUserList } from '../user/store'
import ImageComp from '../../../utility/commonComponents/ImageComp'
import { TEXT_AREA_PLACEHOLDER } from '../../../utility/constants'
import { characterRegex, imageRegex } from '../../../utility/Utils'

const defaultValues = {}
const AddForm = ({ setShow }) => {
  const { loader, selected, params } = useSelector(
    (state) => state?.sponsorMaster
  )

  // let { departmentsList } = useSelector((state) => state?.departments)
  let { userAllList } = useSelector((state) => state?.userMaster)

  const userOptions = userAllList?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })

  // const departmentsOptions = departmentsList?.map((masterModule) => {
  //   return {
  //     label: masterModule.name,
  //     value: masterModule.id
  //   }
  // })

  const { designationDropdown } = useSelector(
    (state) => state?.designationMaster
  )
  const designationOptions = designationDropdown?.map((masterModule) => {
    return {
      label: masterModule.name,
      value: masterModule.id
    }
  })

  const dispatch = useDispatch()
  const [fileUpload, setFile] = useState('')
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
  const userChange = watch('user')

  const handleModalClosed = () => {
    setShow(false)
    reset()
    dispatch(selectSponsor(null))
  }

  const onSubmit = async (data) => {
    let response = ''
    if (selected) {
      await dispatch(setLoader(true))
      const sponsorName = {
        description: data?.description,
        // profile: data?.profile,
        designationId: data?.designationId?.value,
        imageUrl: data?.imageUrl,
        name: data?.name,
        user: data?.user?.value
      }
      response = await dispatch(
        editSponsor({
          id: selected?.id,
          sponsorName,
          params
        })
      )
    } else {
      const sponsorName = {
        description: data?.description,
        // profile: data?.profile,
        designationId: data?.designationId?.value,
        imageUrl: data?.imageUrl,
        name: data?.name,
        user: data?.user?.value
      }
      await dispatch(setLoader(true))
      response = await dispatch(
        addSponsor({
          sponsorName,
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
      if (selected.designationId) {
        setValue('designationId', {
          label: selected.designationName,
          value: selected.designationId
        })
      }
      if (selected.userId) {
        setValue('user', {
          label: selected.userName,
          value: selected.userId
        })
      }
      setValue('name', selected.sponsorName)
      setValue('description', selected.description)
      // setValue('profile', selected.profile)
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
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Sponsor</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="name">
                  Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter Sponsor Name"
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
                <Label className="form-label" for="description">
                  Description <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="description"
                  control={control}
                  {...register('description', {
                    required: 'Please enter Description'
                    // validate: SpecialCharactersFieldValidion // Add the custom validation rule
                  })}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      control={control}
                      maxLength="250"
                      placeholder="Only 250 characters allowed"
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
                )}
              </div>
              {/* <div className="mb-1">
                <Label className="form-label" for="profile">
                  Profile <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="profile"
                  control={control}
                  {...register('profile', {
                    required: 'Please enter profile'
                    // validate: SpecialCharactersFieldValidion // Add the custom validation rule
                  })}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      control={control}
                      maxLength="1000"
                      placeholder="Only 1000 characters allowed"
                      invalid={errors.profile && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.profile && (
                  <FormFeedback>{errors.profile.message}</FormFeedback>
                )}
              </div> */}

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
