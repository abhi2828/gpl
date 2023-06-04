import classNames from 'classnames'
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
import '@styles/react/libs/flatpickr/flatpickr.scss'
import {
  addDepartments,
  editDepartments,
  selectDepartments,
  setLoader
} from './store'
// import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'
import { TEXT_AREA_PLACEHOLDER } from '../../../utility/constants'

const AddForm = ({ setShow }) => {
  const { loader, selected, params } = useSelector((state) => state?.functions)
  const dispatch = useDispatch()
  const defaultValues = {
    name: '',
    description: ''
  }
  const {
    reset,
    control,
    setError,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const handleModalClosed = () => {
    setShow(false)
    reset()
    dispatch(selectDepartments(null))
  }
  const onSubmit = async (data) => {
    let response = ''

    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        editDepartments({
          id: selected?.id,
          name: data.name,
          description: data.description,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addDepartments({
          name: data.name,
          description: data.description,
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
      setValue('name', selected.name)
      setValue('description', selected.description)
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
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Function </h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="name">
                  Function <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  {...register('name', {
                    required: 'Please enter Function Name',
                    maxLength: 100
                    // validate: SpecialCharactersFieldValidion
                    // Add the custom validation rule
                  })}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter Function Name"
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
                <Label className="form-label" for="description">
                  Description
                </Label>
                <Controller
                  id="description"
                  name="description"
                  control={control}
                  {...register('description')}
                  render={({ field }) => (
                    <Input
                      name="description"
                      type="textarea"
                      control={control}
                      maxLength="250"
                      placeholder="Only 250 characters allowed"
                      {...field}
                    />
                  )}
                />
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
