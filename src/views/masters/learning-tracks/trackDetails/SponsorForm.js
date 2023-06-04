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

import classnames from 'classnames'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import { editSponsor, addSponsor } from '../store'
import { selectThemeColors } from '../../../../utility/Utils'
import Select from 'react-select'

const SponsorForm = ({ setShow, isEdit, setIsEdit, sponsorId, rowData }) => {
  const selectedTrack = useSelector((state) => state?.learningTrack)
  const { loader, selected, params } = useSelector(
    (state) => state?.learningTrack
  )
  const dispatch = useDispatch()
  const defaultValues = {
    name: '',
    sponsorId: ''
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

  const sponsorList = useSelector((state) => state?.sponsorMaster?.allSponsor)

  const sponserOptions = sponsorList?.map((sponser) => {
    return {
      label: sponser.sponsorName,
      value: sponser.id
    }
  })
  const handleModalClosed = () => {
    setShow(false)
    setIsEdit(false)
    reset()
  }
  const onSubmit = async (data) => {
    let response = ''
    if (isEdit) {
      response = await dispatch(
        editSponsor({
          id: rowData.id,
          sponsorMessage: data?.sponsorMessage,
          sponsorId: Array.of(data?.sponsorId?.value),
          learningTrackId: selectedTrack.LearningListById.id,
          params
        })
      )
    } else {
      response = await dispatch(
        addSponsor({
          sponsorMessage: data?.sponsorMessage,
          sponsorId: Array.of(data?.sponsorId?.value),
          learningTrackId: selectedTrack.LearningListById.id,
          params
        })
      )
    }
    if (response.payload) {
      handleModalClosed()
    }
  }

  useEffect(() => {
    if (isEdit) {
      const { trackSponsors } = selected
      if (trackSponsors) {
        const filteredSponsors = trackSponsors.filter(
          (val) => val.sponsor_id === sponsorId
        )
        let idData = {}
        sponsorList?.forEach((sponser) => {
          if (sponser.id == filteredSponsors[0].sponsor_id) {
            idData = {
              label: sponser.sponsorName,
              value: sponser.id
            }
          }
        })
        setValue('sponsorId', idData)
        setValue('sponsorMessage', rowData.sponsorMessage)
      }
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
            <h1 className="mb-0">{isEdit ? 'Edit' : 'Add'} Sponsor</h1>
          </div>

          <Row tag={Form} className="p-2" onSubmit={handleSubmit(onSubmit)}>
            <Col sm={12} display="flex" className="mb-1">
              <Label className="form-label" for="sponsorId">
                Sponsor Name <span className="text-danger">*</span>
              </Label>
              <Controller
                id="sponsorId"
                name="sponsorId"
                control={control}
                rules={{ required: 'Please select sponsor' }}
                render={({ field }) => (
                  <Select
                    isClearable={true}
                    placeholder="Select"
                    classNamePrefix="select"
                    options={sponserOptions}
                    theme={selectThemeColors}
                    className={classnames('react-select', {
                      'is-invalid': errors.sponsorId
                    })}
                    {...field}
                  />
                )}
              />
              {errors.sponsorId && (
                <FormFeedback>{errors.sponsorId.message}</FormFeedback>
              )}
            </Col>

            <Col sm={12} display="flex" className="mb-1">
              <Label className="form-label" for="Users">
                Message <span className="text-danger">*</span>
              </Label>
              <Controller
                id="sponsorMessage"
                name="sponsorMessage"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Message"
                    type="textarea"
                    maxLength="250"
                    {...register('sponsorMessage', {
                      required: 'Please enter message'
                    })}
                    invalid={errors.sponsorMessage ? true : false}
                    {...field}
                  />
                )}
              />
              {errors && errors.sponsorMessage && (
                <FormFeedback>{errors.sponsorMessage.message}</FormFeedback>
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

export default SponsorForm
