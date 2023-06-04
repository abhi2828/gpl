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
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {
  addPermission,
  selectPermission,
  setLoader,
  updatePermission
} from './store'
import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'

const defaultValues = {
  permissionName: '',
  baseUrl: '',
  description: '',
  method: '',
  moduleId: []
}
const AddPermission = ({ setShow }) => {
  const { loader, selected, params } = useSelector(
    (state) => state?.permissions
  )
  const moduleListValue = useSelector(
    (state) => state?.masterModule?.moduleDropdown
  )
  const moduleOptions = moduleListValue?.map((masterModule) => {
    return {
      label: masterModule.moduleName,
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
    formState: { errors }
  } = useForm({ defaultValues })

  const renderModalSubtitle = () => {
    if (selected !== null) {
      return 'Edit permission as per your requirements.'
    } else {
      return 'Permissions you may use and assign to your users.'
    }
  }
  const handleModalClosed = () => {
    setShow(false)
    reset()
    dispatch(selectPermission(null))
  }

  const onSubmit = async (data) => {
    let response = ''
    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        updatePermission({
          permission: {
            actionName: data.permissionName,
            description: data.description,
            moduleId: data.moduleId.value,
            url: data?.baseUrl,
            method: data?.method
          },
          id: selected?.id,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addPermission({
          permission: {
            actionName: data.permissionName,
            description: data.description,
            moduleId: data.moduleId.value,
            url: data?.baseUrl,
            method: data?.method
          },
          params
        })
      )
    }
    if (response) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    if (selected) {
      setValue('permissionName', selected.actionName),
        setValue('baseUrl', selected.url),
        setValue('description', selected.description),
        setValue('method', selected.method)
    }
    let moduleValue = []
    moduleOptions?.forEach((masterModule) => {
      if (masterModule.value == selected?.moduleMasterEntityId) {
        moduleValue = {
          label: masterModule.label,
          value: masterModule.value
        }
      }
    })
    setValue('moduleId', moduleValue)
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
        <ModalBody
          className={classnames({
            'p-3 pt-1': selected !== null,
            'px-sm-3 pb-3': selected === null
          })}
        >
          <div className="text-center mb-0">
            <h1 className="mb-1">{selected ? 'Edit' : 'Add'} Permission</h1>
            <p>{renderModalSubtitle()}</p>
          </div>

          <Row tag={Form} onSubmit={handleSubmit(onSubmit)}>
            <Col xs="12" className="mb-1">
              <Label className="form-label" for="permission-name">
                Permission Name <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="permissionName"
                name="permissionName"
                render={({ field }) => (
                  <Input
                    placeholder="Enter Permission Name"
                    invalid={errors.permissionName && true}
                    {...register('permissionName', {
                      maxLength: 100,
                      required: 'Please enter Permission'
                      // validate: SpecialCharactersFieldValidion // Add the custom validation rule
                    })}
                    {...field}
                  />
                )}
              />
              {errors && errors.permissionName && (
                <FormFeedback>
                  Please enter a valid Permission Name
                </FormFeedback>
              )}
            </Col>

            <Col xs="12" className="mb-1">
              <Label className="form-label" for="description">
                Description
              </Label>
              <Controller
                control={control}
                id="description"
                name="description"
                render={({ field }) => (
                  <Input
                    type="textarea"
                    placeholder={'Allow Only 500 Character'}
                    maxLength="500"
                    invalid={errors.description && true}
                    {...field}
                  />
                )}
              />
            </Col>

            <Col xs="12" className="mb-1">
              <Label className="form-label" for="method">
                Module <span className="text-danger">*</span>
              </Label>
              <Controller
                id="moduleId"
                name="moduleId"
                control={control}
                rules={{ required: 'Please select Module' }}
                render={({ field }) => (
                  <Select
                    // isClearable={true}
                    placeholder="Select"
                    classNamePrefix="select"
                    options={moduleOptions}
                    theme={selectThemeColors}
                    // invalid={errors.moduleId && true}
                    className={classnames('react-select', {
                      'is-invalid': errors.moduleId
                    })}
                    {...field}
                  />
                )}
              />
              {errors.moduleId && (
                <FormFeedback>{errors.moduleId.message}</FormFeedback>
              )}
            </Col>

            <Col xs="12" className="mb-1">
              <Label className="form-label" for="permission-name">
                Method<span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="method"
                name="method"
                render={({ field }) => (
                  <Input
                    placeholder="Enter Method"
                    invalid={errors.method && true}
                    {...register('method', {
                      maxLength: 100,
                      required: 'Please enter Method'
                    })}
                    {...field}
                  />
                )}
              />
              {errors && errors.method && (
                <FormFeedback>Please enter a valid Method Name</FormFeedback>
              )}
            </Col>

            <Col xs="12" className="mb-1">
              <Label className="form-label" for="url">
                Base Url <span className="text-danger">*</span>
              </Label>
              <Controller
                control={control}
                id="baseUrl"
                name="baseUrl"
                render={({ field }) => (
                  <Input
                    placeholder="Enter Base Url"
                    invalid={errors.baseUrl && true}
                    {...register('baseUrl', {
                      maxLength: 100,
                      required: 'Please enter baseUrl'
                    })}
                    {...field}
                  />
                )}
              />
              {errors && errors.baseUrl && (
                <FormFeedback>Please enter a valid Base Url</FormFeedback>
              )}
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

export default AddPermission
