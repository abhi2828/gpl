import React, { useEffect } from 'react'
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
  addDesignation,
  editDesignation,
  selectDesignation,
  setLoader
} from './store'
import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'
import { TEXT_AREA_PLACEHOLDER } from '../../../utility/constants'
import { characterRegex } from '../../../utility/Utils'

const defaultValues = {
  topicId: [],
  userId: '',
  startDate: '',
  endDate: '',
  rating: '',
  comment: '',
  status: ''
}
const AddForm = ({ setShow }) => {
  const { loader, selected, params } = useSelector(
    (state) => state?.designationMaster
  )
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

  const handleModalClosed = () => {
    setShow(false)
    reset()
    dispatch(selectDesignation(null))
  }

  const onSubmit = async (data) => {
    let response = ''
    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        editDesignation({
          id: selected?.id,
          name: data.name,
          description: data.description,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addDesignation({
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
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Designation</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="Users">
                  Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter Designation"
                      {...register('name', {
                        required: 'Please enter Designation name',
                        pattern: {
                          value: characterRegex,
                          message: 'Allow Only 100 Character'
                        }
                      })}
                      invalid={errors.name ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors && errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
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
                      maxLength="250"
                      placeholder="Only 250 Characters allowed"
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {/* {errors && errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
                )}*/}
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
