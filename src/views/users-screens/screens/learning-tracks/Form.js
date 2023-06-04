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
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
// import { addSponsor, editSponsor, selectSponsor, setLoader } from './store'
// import { fetchDepartmentsList } from '../department/store'
// import { fetchDesignationDropdown } from '../designation/store'
// import { fetchUserList } from '../../user/store'
import { SpecialCharactersFieldValidion } from '../../../../utility/Commonfunction'
import ImageComp from '../../../../utility/commonComponents/ImageComp'
import sucessfully from '../../../../assets/images/customIcon/sucessfully.svg'
import { characterRegex, numRegex } from '../../../../utility/Utils'
import {
  enrollLearningTrack,
  fetchLearningList,
  setEnrollNowLoader,
  setLoader
} from '../../../masters/learning-tracks/store'

export const MoreInfo = ({ handleModalClosed, data, show }) => {
  return (
    <>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered modal_width"
      >
        <Row className="header_style">
          <Col xs={4} className="maroon_color"></Col>
          <Col xs={4} className="primary_color"></Col>
          <Col xs={4} className="success_color"></Col>
        </Row>
        <ModalHeader
          className="bg-transparent "
          // toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-center modal_img">
            <img
              src={sucessfully}
              className="cardImg img-fluid"
              alt="sucessfully"
            />
          </div>
          <div className="text-center modal_msg">
            <p> Enrolled Successfully!</p>
            <p>Thank you for your application</p>
          </div>
          <br />
          <br />
          <div className="mx-3 my-5">
            <table className="details">
              <tr>
                <td>Name:</td>
                <td>{data.name}</td>
              </tr>
              <tr>
                <td>EDP:</td>
                <td>{data.EDP}</td>
              </tr>
              <tr>
                <td>Track Applied For:</td>
                <td>{data.enrolling}</td>
              </tr>
            </table>
          </div>
          <div className="d-flex justify-content-center">
            <Button
              className="me-1 btn_css text-center"
              onClick={() => handleModalClosed('submitedTrack')}
            >
              TAKE ME BACK TO TRACK
            </Button>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

const EnrollFormModal = ({ setShow, show, trackName, all }) => {
  const [submitData, setsubmitData] = useState(false)
  const [sucessModal, setSucessModal] = useState(false)

  let { myTrackInfo, enrolledMsg, enrollNowLoader } = useSelector(
    (state) => state?.learningTrack
  )
  const defaultValues = {
    name: myTrackInfo
      ? myTrackInfo[0]?.firstName + ' ' + myTrackInfo[0]?.lastName
      : '',
    EDP: myTrackInfo ? myTrackInfo[0]?.employeeId : '',
    currentFunction: myTrackInfo ? myTrackInfo[0]?.functionName : '',
    currentRole: '',
    enrolling: trackName?.name
  }

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

  const handleModalSubmit = () => {
    setsubmitData(true)
    onSubmit()
    reset()

    // dispatch(selectSponsor(null))
  }

  const handleModalClosed = (submitedTrack) => {
    // setsubmitData(true)
    setShow(!show)
    reset()
    submitedTrack === 'submitedTrack' && dispatch(fetchLearningList())
    // dispatch(selectSponsor(null))
  }

  const onSubmit = async () => {
    // setsubmitData(true)
    dispatch(setEnrollNowLoader(true))
    //
    let response = ''

    const formData = {
      department: myTrackInfo[0]?.departmentDepartmentName,
      employeeId: myTrackInfo[0]?.employeeId,
      employeeLevel: myTrackInfo[0]?.level,
      functionName: myTrackInfo[0]?.functionName,
      trackId: trackName.id
    }
    // setLoader(true)
    response = await dispatch(
      enrollLearningTrack({
        formData
      })
    )
    if (response?.payload) {
      setSucessModal(true)
    }
  }
  useEffect(() => {
    if (myTrackInfo && trackName) {
      setValue(
        'name',
        myTrackInfo[0]?.firstName + ' ' + myTrackInfo[0]?.lastName
      )
      setValue('EDP', myTrackInfo[0]?.employeeId)
      setValue('currentFunction', myTrackInfo[0]?.functionName)
      setValue('currentRole', '')
      setValue('enrolling', trackName?.name)
    }
    // const timer = setTimeout(() => {
    //   dispatch(setLoader(true))
    //   dispatch(
    //     fetchLearningList({
    //       pageSize: all ? '' : 10
    //     })
    //   )
    // }, 1000)

    // return () => {
    //   clearTimeout(timer)
    // }
  }, [myTrackInfo, trackName, all])

  return (
    <>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered modal_width"
      >
        <Row className="header_style">
          <Col xs={4} className="maroon_color"></Col>
          <Col xs={4} className="primary_color"></Col>
          <Col xs={4} className="success_color"></Col>
        </Row>
        <ModalHeader
          className="bg-transparent "
          // toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody>
          <div className="text-center mb-2">
            <h1 className="mb-0">Enroll Now</h1>
          </div>
          <Row tag={Form} className="px-2" onSubmit={handleSubmit(onSubmit)}>
            <Col xs={6} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="name">
                  Name
                </Label>
                <Controller
                  id="name"
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter Name"
                        maxLength="100"
                        invalid={errors.name && true}
                        {...field}
                        disabled
                      />
                      {errors.name && (
                        <FormFeedback>{errors.name.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </div>
            </Col>

            <Col xs={6} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="EDP">
                  EDP Number
                </Label>
                <Controller
                  id="EDP"
                  name="EDP"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter EDP Number"
                        maxLength="100"
                        invalid={errors.EDP && true}
                        {...field}
                        disabled
                      />
                      {errors.EDP && (
                        <FormFeedback>{errors.EDP.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </div>
            </Col>

            <Col xs={6} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="currentFunction">
                  Current Function
                </Label>
                <Controller
                  id="currentFunction"
                  name="currentFunction"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter Current Function"
                        maxLength="100"
                        invalid={errors.current && true}
                        {...field}
                        disabled
                      />
                      {errors.current && (
                        <FormFeedback>{errors.current.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </div>
            </Col>

            <Col xs={6} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="currentRole">
                  Current Role
                </Label>
                <Controller
                  id="currentRole"
                  name="currentRole"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter Current Role"
                        maxLength="100"
                        invalid={errors.currentRole && true}
                        {...field}
                        disabled
                      />
                      {errors.currentRole && (
                        <FormFeedback>
                          {errors.currentRole.message}
                        </FormFeedback>
                      )}
                    </>
                  )}
                />
              </div>
            </Col>

            <Col xs={6} display="flex">
              <div className="mb-1">
                <Label className="form-label" for="enrolling">
                  Track Enrolling For
                </Label>
                <Controller
                  id="enrolling"
                  name="enrolling"
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        placeholder="Enter Track Enrolling For"
                        maxLength="100"
                        invalid={errors.enrolling && true}
                        {...field}
                        disabled
                      />
                      {errors.enrolling && (
                        <FormFeedback>{errors.enrolling.message}</FormFeedback>
                      )}
                    </>
                  )}
                />
              </div>
            </Col>
            <Col xs={12}>
              <p className="form_p text-center">
                Are you sure, you want to <br /> proceed ahead with enrollment?
              </p>
            </Col>

            <Col xs={12} className="text-center mt-2">
              <button
                className="btn me-1 btn_css"
                color="primary"
                type="submit"
                disabled={enrollNowLoader}
              >
                {enrollNowLoader ? (
                  <Spinner text="Loading..." color="white" size="sm" />
                ) : (
                  'YES I CONFIRM'
                )}
              </button>
              <button
                outline
                className="btn me-1 outline_btn_css blue_outline_btn_css"
                color="primary"
                onClick={handleModalClosed}
              >
                TAKE ME BACK TO TRACK
              </button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <MoreInfo
        handleModalClosed={handleModalClosed}
        data={defaultValues}
        show={sucessModal}
      />
    </>
  )
}

export default EnrollFormModal
