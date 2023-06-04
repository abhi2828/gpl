import React, { useEffect, useState } from 'react'
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
import ImageComp from '../../../utility/commonComponents/ImageComp'
import { characterRegex, imageRegex } from '../../../utility/Utils'
import { addChroList } from './store'

const defaultValues = {
  name: '',
  imageUrl: '',
  chroMessage: ''
}

const CHROForm = ({ isOpen, setIsOpen, isClose }) => {
  const dispatch = useDispatch()
  // const [val, setVal] = useState()
  const { chroList, loader } = useSelector((state) => state.talentPhilosophy)
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

  const handleModalClosed = () => {
    setIsOpen(false)
    reset()
  }

  const handleChange = (e) => {
    setVal(e.target.value)
  }

  const onSubmit = (data) => {
    const payload = {
      name: data.name,
      imageUrl: data.imageUrl,
      chroMessage: data.chroMessage
    }
    dispatch(addChroList(payload))
    handleModalClosed()
  }

  useEffect(() => {
    setValue('name', chroList[0]?.name)
    setValue('imageUrl', chroList[0]?.imageUrl)
    setValue('chroMessage', chroList[0]?.chroMessage)
  }, [chroList])

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClosed={handleModalClosed}
        className="modal-dialog-centered"
      >
        <ModalHeader
          className="bg-transparent "
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12}>
              <div className="mb-1">
                <Label className="form-label" for="name">
                  Name
                  <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Please Enter Name"
                        {...register('name', {
                          required: 'Please EnterName',
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
            </Col>

            <Col xs={12}>
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
                      onChange={handleChange}
                      placeholder="Please Enter Image Url"
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
                {/* <ImageComp imageUrl={val} /> */}
              </div>
            </Col>

            <Col xs={12}>
              <div className="mb-1">
                <Label className="form-label" for="chroMessage">
                  Message <span className="text-danger">*</span>
                </Label>
                <Controller
                  name="chroMessage"
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="textarea"
                      placeholder={'Allow Only 250 Words'}
                      {...register('chroMessage', {
                        required: 'Please enter Message',
                        validate: (value, formValues) =>
                          value.split(' ').length < 250 ||
                          'Chro Message Must be 250 words'
                        // validate: SpecialCharactersFieldValidion
                        // Add the custom validation rule
                      })}
                      invalid={errors.chroMessage ? true : false}
                      {...field}
                    />
                  )}
                />
                {errors && errors.chroMessage && (
                  <FormFeedback>{errors.chroMessage.message}</FormFeedback>
                )}
              </div>
            </Col>

            <Col xs={12} className="text-center mt-2 mb-1">
              <Button className="me-1" color="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CHROForm
