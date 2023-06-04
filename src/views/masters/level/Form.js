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
import { addLevel, editLevel, selectLevel, setLoader } from './store'
import { validateOptions } from 'postcss-rtl/lib/options'
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
    (state) => state?.levelMaster
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
    dispatch(selectLevel(null))
  }

  const onSubmit = async (data) => {
    let response = ''

    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        editLevel({
          id: selected?.id,
          levelName: data.levelName,
          description: data.description,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addLevel({
          levelName: data.levelName,
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
      setValue('levelName', selected.levelName)
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
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Level</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="Users">
                  Level <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="levelName"
                  name="levelName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      placeholder="Enter Level"
                      {...register('levelName', {
                        required: 'Please enter level name',
                        pattern: {
                          value: characterRegex,
                          message: 'Allow Only 100 Character'
                        }
                      })}
                      invalid={errors.levelName ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors && errors.levelName && (
                  <FormFeedback>{errors.levelName.message}</FormFeedback>
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
                      placeholder={'Allow Only 250 Character'}
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
                )}
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
