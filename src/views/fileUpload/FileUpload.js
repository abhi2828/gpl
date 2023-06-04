import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
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
import { Link } from 'react-router-dom'
// import { getModuleDropdown } from '../masters/modules/store'
import toast from 'react-hot-toast'
import { getFileUpload, setLoader } from './store'
import { getModuleDropdown } from '../masters/modules/store'

const defaultValues = {
  file: ''
}

const FileUpload= ({ setShowEnrollBulkUpload }) => {
  const [fileUpload, setFile] = useState('')

  const { loader, selected, params } = useSelector((state) => state?.enroll)

  const { moduleDropdown } = useSelector((state) => state?.masterModule)
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
  const fileTypes = ["txt", "doc", "docx","pdf", "jpg", "jpeg", "png", "gif", "mp3", "mp4", "avi", "mov", "ppt", "pptx", "xls", "xlsx", "zip", "rar"]
  const handleModalClosed = () => {
    setShowEnrollBulkUpload(false)
    reset()
  }

  const handleFile = (e) => {
    setValue('file', e.target.files[0])
    setFile(e.target?.files[0]?.name)
  }
  
  const onSubmit = async (data) => {
    const fileType = data.file.name.split(".").pop()
    if (!fileTypes.includes(fileType)) {
        toast.error("Invalid file type")
      return
    }
  
    const values = {
      file: data.file
    }
    let formData = new FormData()
    Object.entries(values).forEach((key) => {
      formData.append(`${key[0]}`, key[1])
    })
    let response = ''
    await dispatch(setLoader(true))
    response = await dispatch(
        getFileUpload({
        formData,
        params
      })
    )

    if (response) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    dispatch(getModuleDropdown())
  }, [])

  return (
    <>
      <Modal
        isOpen={true}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered modal-lg"
      >
        <ModalHeader
          className="bg-transparent "
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center mb-0">
            <h1 className="mb-0">File Upload</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            {!selected ? (
              <div className="mb-1">
                <Label className="form-label" for="file">
                  Upload File <span className="text-danger">*</span>
                </Label>

                <Controller
                  name="file"
                  control={control}
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
                      files={selected ? selected.file : fileUpload}
                    />
                  )}
                />
                {errors && errors.file && (
                  <FormFeedback>{errors.file.message}</FormFeedback>
                )}
              </div>
            ) : (
              <div className="mb-1">
                <Label className="form-label d-flex" for="file">
                  File Name
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
                    // onClick={() => handleRemovedFiles()}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            )}

            {/* <Label className="form-label" for="file">
              <Link to="/csv/enroll.csv" target="_blank" download>
                {' '}
                Click Here{' '}
              </Link>
              To Download Sample File
            </Label> */}

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

export default FileUpload
