import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Controller, useForm } from 'react-hook-form'
import { Trash2 } from 'react-feather'

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
import { SpecialCharactersFieldValidion } from '../../../utility/Commonfunction'
import { TEXT_AREA_PLACEHOLDER } from '../../../utility/constants'
import { characterRegex, imageRegex } from '../../../utility/Utils'
import {
  selectCareerTracks,
  setLoader,
  addCareerTracks,
  editCareerTracks
} from './store'
import ImageComp from '../../../utility/commonComponents/ImageComp'

const defaultValues = {
  name: '',
  imageUrl: '',
  file: ''
}
const AddForm = ({
  setShow,
  showFileInputField,
  setShowFileInputField,
  showUploadFileInput,
  setShowUploadFileInput
}) => {
  const { loader, selected, params } = useSelector(
    (state) => state?.talentPhilosophy
  )

  const [fileUpload, setFileUpload] = useState('')
  const [file, setFile] = useState('')
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

  const handleModalClosed = () => {
    setFile('')
    setShow(false)
    reset()
    dispatch(selectCareerTracks(null))
  }

  const handleFile = (e) => {
    setValue('file', e.target.files[0])
    setFile(e.target?.files[0]?.name)
  }

  const handleRemovedFiles = () => {
    setShowUploadFileInput(true)
    setShowFileInputField(false)
    setValue('file', null)
  }

  const onSubmit = async (data) => {
    let formData = new FormData()

    let response = ''
    if (selected) {
      await dispatch(setLoader(true))
      formData.append('name', data.name)
      formData.append('imageUrl', data.imageUrl)
      if (
        data.file !==
        selected?.file?.substring(selected?.file?.lastIndexOf('/') + 1)
      ) {
        formData.append('file', data.file)
      }
      response = await dispatch(
        editCareerTracks({
          id: selected?.id,
          formData,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      formData.append('name', data.name)
      formData.append('imageUrl', data.imageUrl)
      formData.append('file', data.file)
      response = await dispatch(
        addCareerTracks({
          formData,
          params
        })
      )
    }

    // const values = {
    //   name: data.name,
    //   imageUrl: data.imageUrl,
    //   file: data.file
    // }
    // let formData = new FormData()
    // Object.entries(values).forEach((key) => {
    //   formData.append(`${key[0]}`, key[1])
    // })

    // let response = ''
    // if (selected) {
    //   await dispatch(setLoader(true))
    //   response = await dispatch(
    //     editCareerTracks({
    //       id: selected?.id,
    //       formData,
    //       params
    //     })
    //   )
    // } else {
    //   await dispatch(setLoader(true))
    //   response = await dispatch(
    //     addCareerTracks({
    //       formData,
    //       params
    //     })
    //   )
    // }

    if (response.payload) {
      handleModalClosed()
    }
  }

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }
  }

  useEffect(() => {
    if (selected) {
      setValue('name', selected.name)
      setValue('imageUrl', selected.imageUrl)
      setValue(
        'file',
        selected?.file?.substring(selected?.file?.lastIndexOf('/') + 1)
      )
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
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Career Tracks</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={12} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="name">
                  Function Name <span className="text-danger">*</span>
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Please Enter Function Name"
                        {...register('name', {
                          required: 'Please Enter Function Name',
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
                <ImageComp imageUrl={imageUrl} />
              </div>

              {showUploadFileInput && (
                <Col className="mb-1">
                  <Label className="form-label" for="file">
                    Upload Pdf File <span className="text-danger">*</span>
                  </Label>

                  <Controller
                    name="file"
                    control={control}
                    // {...register('file', {
                    //   required: 'Please Select Modules Name'
                    // })}
                    render={({ field }) => (
                      <Input
                        id="file"
                        type="file"
                        name="file"
                        {...register('file', {
                          required: 'Please upload a file'
                        })}
                        invalid={errors.file && true}
                        onChange={handleFile}
                        files={fileUpload}
                        accept="application/pdf"
                      />
                    )}
                  />
                  {errors && errors.file && (
                    <FormFeedback>{errors.file.message}</FormFeedback>
                  )}
                </Col>
              )}

              {showFileInputField && (
                <Col className="mb-1 " display="flex">
                  <Label className="form-label d-flex" for="file">
                    Upload File <span className="text-danger">*</span>
                  </Label>
                  <div className="d-flex ">
                    <Controller
                      name="file"
                      control={control}
                      render={({ field }) => <Input name="file" {...field} />}
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

export default AddForm
