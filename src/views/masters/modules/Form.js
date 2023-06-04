import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Controller, useForm } from 'react-hook-form'

import {
  Button,
  Col,
  Form,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
  FormFeedback,
  Spinner
} from 'reactstrap'

import { addModule, updateModule, setLoader, selectModule } from './store'
import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'

const ModuleForm = ({ setShow }) => {
  const dispatch = useDispatch()
  const { loader, params, selected } = useSelector(
    (state) => state?.masterModule
  )

  const defaultValues = {
    moduleName: ''
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
    reset()
    setShow(false)
    dispatch(selectModule(null))
  }
  const handleDiscard = () => {
    reset()
    setShow(false)
  }

  const onSubmit = async (data) => {
    let response = ''
    dispatch(setLoader())
    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        updateModule({
          moduleName: data.moduleName,
          id: selected?.id,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addModule({
          moduleName: data.moduleName,
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
      setValue('moduleName', selected?.moduleName)
    }
  }, [])

  return (
    <>
      <Modal
        isOpen={true}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered "
      >
        <ModalHeader
          className="bg-transparent"
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center">
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Module</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} className="mb-2" display="flex">
              <Label className="form-label" for="moduleName">
                Module Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="moduleName"
                name="moduleName"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Module"
                    invalid={errors.moduleName && true}
                    {...register('moduleName', {
                      required: true,
                      maxLength: 20,
                      validate: SpecialCharactersFieldValidion // Add the custom validation rule
                    })}
                    {...field}
                  />
                )}
              />
              {errors && errors.moduleName && (
                <FormFeedback>Please enter a valid moduleName</FormFeedback>
              )}
            </Col>
            <Col xs={12} className="text-center mb-1 mt-1">
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

export default ModuleForm
