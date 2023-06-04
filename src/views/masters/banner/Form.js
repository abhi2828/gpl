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
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { addBanner, editBanner, selectBanner, setLoader } from './store'
import Select from 'react-select'
import { Trash2 } from 'react-feather'
import {
  characterRegex,
  imageRegex,
  numRegex,
  videoRegex
} from '../../../utility/Utils'
import ImageComp from '../../../utility/commonComponents/ImageComp'

const AddForm = ({ setShow }) => {
  const contentOptions = [
    { label: 'IMAGE', value: 'IMAGE' },
    { label: 'VIDEO', value: 'VIDEO' }
  ]

  const showBannerOptions = [
    { label: 'Yes', value: true },
    { label: 'No', value: false }
  ]

  const { loader, selected, params, bannerList } = useSelector(
    (state) => state?.bannerMaster
  )
  const [file, setFile] = useState('')

  const [showVideoUrl, setShowVideoUrl] = useState(false)
  const [selectedOption, setSelectedOption] = useState(contentOptions[0].label)
  const [fileName, setIsFileName] = useState(selected?.image)
  const dispatch = useDispatch()

  const defaultValues = {
    showContent: contentOptions[0],
    showBanner: showBannerOptions[0],
    url: '',
    description: '',
    displayOrder: '',
    name: ''
  }

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

  const imageUrl = watch('url')
  const showContent = watch('showContent')
  useEffect(() => {
    handleChange(showContent.label)
  }, [showContent])

  //Render File Size For File Upload Feature
  // const renderFileSize = (size) => {
  //   if (Math.round(size / 100) / 10 > 1000) {
  //     return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
  //   } else {
  //     return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
  //   }
  // }

  const handleChange = (option) => {
    if (option == 'VIDEO') {
      setFile('')
      // setIsFileName('')
      setSelectedOption(option)
    } else {
      setSelectedOption(option)
      //setShowUploadFileInput(true)
    }
  }

  const handleModalClosed = () => {
    setShow(false)
    reset()
    dispatch(selectBanner(null))
  }

  //Remove file method for edit the file uploader
  // const handleRemovedFiles = () => {
  //   setFile('')
  // }

  //Handle the uploaded file
  // const handleFile = (e) => {
  //   setValue('fileName', e.target.files[0]?.name)
  //   setFile(e.target?.files[0])
  // }

  const onSubmit = async (data) => {
    let response = ''
    if (selected) {
      await dispatch(setLoader(true))
      response = await dispatch(
        editBanner({
          //videoUrl: data.videoUrl,
          showContent: selectedOption,
          showBanner: data?.showBanner?.value,
          url: data.url,
          description: data.description,
          id: selected?.id,
          displayOrder: data?.displayOrder,
          name: data?.name,
          params
        })
      )
    } else {
      await dispatch(setLoader(true))
      response = await dispatch(
        addBanner({
          //videoUrl: data.videoUrl,
          showContent: selectedOption,
          showBanner: data?.showBanner?.value,
          url: data.url,
          description: data.description,
          displayOrder: data?.displayOrder,
          name: data?.name,
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
      setValue('videoUrl', selected.videoUrl)
      setFile({})
      setValue('url', selected.url)
      setValue('name', selected.name)
      setValue('description', selected.description)
      setValue('displayOrder', selected.displayOrder)
      let contentValue = {}
      bannerList?.forEach((banner) => {
        if (banner?.showContent == selected?.showContent) {
          contentValue = {
            label: banner.showContent,
            value: banner.showContent
          }
        }
      })
      setValue('showContent', contentValue)
      let showBannerValue = {}
      bannerList?.forEach((show) => {
        if (show?.isVisible == selected?.isVisible) {
          showBannerValue = {
            label: show.isVisible ? 'Yes' : 'No',
            value: show.isVisible
          }
        }
      })
      setValue('showBanner', showBannerValue)
      setSelectedOption(contentValue.label)
    } else {
      setSelectedOption(contentOptions[0]?.label)
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
          className="bg-transparent "
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center mb-0">
            <h1 className="mb-0">{selected ? 'Edit' : 'Add'} Banner</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xl={12} className="mb-1" display="flex">
              <Label className="form-label" for="name">
                Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="name"
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Name (Allow Only 100 Character)"
                    {...register('name', {
                      required: 'Please enter name',
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
            </Col>

            <Col xl={12} className="mb-1">
              <Label className="form-label" for="showContent">
                Select Content <span className="text-danger">*</span>
              </Label>
              <Controller
                id="showContent"
                name="showContent"
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    classNamePrefix="select"
                    options={contentOptions}
                    theme={selectThemeColors}
                    className={classnames('react-select', {
                      'is-invalid': selected !== null && selected === null
                    })}
                    {...field}
                  />
                )}
              />
            </Col>

            {selectedOption === 'IMAGE' ? (
              <>
                <Col xl={12} className="mb-1" display="flex">
                  <Label className="form-label" for="url">
                    Image Url <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    id="url"
                    name="url"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Enter Image URL"
                        {...register('url', {
                          required: 'Please enter URL',
                          pattern: {
                            value: imageRegex,
                            message: 'Please Enter Valid Image URL'
                          }
                        })}
                        invalid={errors.url ? true : false}
                        {...field}
                      />
                    )}
                  />
                  {errors && errors.url && (
                    <FormFeedback>{errors.url.message}</FormFeedback>
                  )}
                </Col>

                {/* {file ? 
                    <>
                        <Col xl={12} className="mb-1 " display="flex">
                          <Label className="form-label d-flex" for="fileName">
                            File Name
                          </Label>
                          <div className="d-flex ">
                            <Controller
                              name="fileName"
                              control={control}
                              render={({ field }) => (
                                <Input name="fileName" {...field} />
                              )}
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
                    </> 
                  : 
                    <>
                       <Col xl={12} className="mb-1">
                        <Label className="form-label" for="image">
                          Upload Image
                        </Label>
                        <Controller
                          name="image"
                          control={control}
                          {...register('image', {
                            required: false
                          })}
                          render={({ field }) => (
                            <Input
                              id="image"
                              type="file"
                              name="image"
                              {...register('image', {
                                required: false
                              })}
                              invalid={errors.image && true}
                              onChange={handleFile}
                              files={file}
                            />
                          )}
                        />
                        <p className="file-size mb-0">
                            {file ? renderFileSize(file?.size) : ''}
                          </p>
                      </Col>
                    </>
                  } */}
              </>
            ) : (
              <>
                <Col xl={12} className="mb-1" display="flex">
                  <Label className="form-label" for="url">
                    Video Url <span className="text-danger">*</span>
                  </Label>
                  <Controller
                    id="url"
                    name="url"
                    control={control}
                    render={({ field }) => (
                      <Input
                        placeholder="Enter Video URL"
                        {...register('url', {
                          required: 'Please enter Video URL',
                          pattern: {
                            value: videoRegex,
                            message: 'Please Enter Valid Video URL'
                          }
                        })}
                        invalid={errors.url ? true : false}
                        {...field}
                      />
                    )}
                  />
                  {errors && errors.url && (
                    <FormFeedback>{errors.url.message}</FormFeedback>
                  )}
                </Col>
              </>
            )}

            <Col xl={12} className="mb-1" display="flex">
              <Label className="form-label" for="displayOrder">
                Display Order <span className="text-danger">*</span>
              </Label>
              <Controller
                id="displayOrder"
                name="displayOrder"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter display order"
                    type="number"
                    maxLength={2}
                    {...register('displayOrder', {
                      required: 'Please enter display order',
                      pattern: {
                        value: numRegex,
                        message: 'Please Enter Order between 1 to 100'
                      }
                    })}
                    invalid={errors.displayOrder ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.displayOrder && (
                <FormFeedback>{errors.displayOrder.message}</FormFeedback>
              )}
            </Col>

            {/* <Col xl={12} className="mb-1">
              <Label className="form-label" for="showBanner">
                Show Banner <span className="text-danger">*</span>
              </Label>
              <Controller
                id="showBanner"
                name="showBanner"
                control={control}
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    classNamePrefix="select"
                    options={showBannerOptions}
                    theme={selectThemeColors}
                    className={classnames('react-select', {
                      'is-invalid': selected !== null && selected === null
                    })}
                    {...field}
                  />
                )}
              />
            </Col> */}

            <Col xl={12} display="flex">
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
              <ImageComp imageUrl={imageUrl} />
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
