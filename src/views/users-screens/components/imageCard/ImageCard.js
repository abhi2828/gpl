import React from 'react'
import { Button, Col, Row, Spinner } from 'reactstrap'
import Card from 'react-bootstrap/Card'
import { generatePath, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLearningListById,
  fetchMyTrackinfo,
  selectLearningTrack,
  setLoader
} from '../../../masters/learning-tracks/store'
import { useState } from 'react'
import calendar from '../../../../assets/images/customIcon/calendar.svg'
import clock from '../../../../assets/images/customIcon/clock.svg'
import list from '../../../../assets/images/customIcon/list.svg'
import '../../sass/learning-track/learning-track-card.scss'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { getStatus } from '../../../../utility/Utils'

const ImageCard = ({ card, setShow, test }) => {
  const [loader, setLoader] = useState(false)
  const [functionStatus, setFunctionStatus] = useState(true)
  const dispatch = useDispatch()
  let { id } = card
  const handleOpenModal = async (e) => {
    test(card)
    setLoader(true)
    let res = await dispatch(fetchMyTrackinfo())
    if (res.payload) {
      setShow(true)
    }
    setLoader(false)
  }

  let navigate = useNavigate()
  const routeChange = (card) => {
    // let myStatus = card.enrollStatus
    const data = {
      status: card.enrollStatus,
      trackStatus: card?.trackStatus
    }
    dispatch(selectLearningTrack())
    let path = `details`
    navigate(`${path}/${id}`, { state: data })
  }
  const routeChangeDepartment = (card) => {
    setFunctionStatus(true)
    let myStatus = card.enrollStatus
    const data = {
      status: myStatus,
      functionStatus: functionStatus
    }
    dispatch(selectLearningTrack())
    let path = `details`
    navigate(`${path}/${id}`, { state: data })
  }
  let startDate = card?.startDate?.replaceAll('-', ' ').split(' ')
  let start_date_array = startDate?.slice(0, -1)

  let endDate = card?.endDate?.replaceAll('-', ' ').split(' ')
  let end_date_array = endDate?.slice(0, -1)

  let enrollCloseDate =
    card?.enrollCloseDate !== null &&
    card?.enrollCloseDate?.replaceAll('-', ' ').split(' ')
  let enroll_close_date_array =
    card?.enrollCloseDate !== null && enrollCloseDate?.slice(0, -1)

  function DateMonthconverter(monthNumber) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    return months[monthNumber - 1]
  }
  let curentDate = new Date()
  let trackEnrollCloseDate = new Date(
    card?.enrollCloseDate !== null && card?.enrollCloseDate
  )

  let finalDate = `${DateMonthconverter(start_date_array[1])} ${
    start_date_array[0]
  } to ${DateMonthconverter(end_date_array[1])} ${end_date_array[0]} `

  let closeDate = `${enrollCloseDate[2]} ${DateMonthconverter(
    enroll_close_date_array[1]
  )} ${enroll_close_date_array[0]} `

  return (
    <>
      <Col className="my-1 learningTrack_card px-1">
        <Card>
          <Card.Img variant="top" src={card?.imageUrl ? card.imageUrl : ''} />
          <Card.Body className="p-2">
            <Card.Title className="mt-1">
              {card.name ? card?.name : ''}
            </Card.Title>

            <Card.Text className="">
              {card?.detail ? card?.detail : ''}
            </Card.Text>
            <Card.Text className="mt-1">
              <div className="line_wrapper">
                <img src={calendar} alt="" />
                <span className="px-1">{finalDate}</span>
              </div>
            </Card.Text>
            <Card.Text className="mt-1">
              <img src={clock} alt="" />
              <span className="px-1">
                {` Application  ${
                  card.status === 'UPCOMMING'
                    ? 'yet to start'
                    : 'end on ' + closeDate
                }`}
              </span>
            </Card.Text>
            <Card.Text className="mt-1">
              <img src={list} alt="" />
              <div className="line_wrapper">
                <span className="ms-2">
                  Applicable Functions:{' '}
                  {card?.department?.split('').length > 15 ? (
                    <>
                      {`${card?.department.substring(0, 5)}`}
                      <span
                        onClick={() => routeChangeDepartment(card)}
                        style={{ color: 'rgb(0,119,185)' }}
                      >
                        ...See more
                      </span>
                    </>
                  ) : (
                    card?.department
                  )}
                </span>
              </div>
            </Card.Text>
            <div
              className="d-flex mt-2 card_button_sec"
              style={{ justifyContent: 'center' }}
            >
              <button
                id={card.id}
                className={`btn bg_primary_color text-capitalize  learningTrack_card-btn ${
                  getStatus(
                    card.enrollStatus,
                    card?.status,
                    trackEnrollCloseDate,
                    card?.trackStatus
                  ) === 'Enroll Now'
                    ? 'enroll'
                    : getStatus(
                        card?.enrollStatus,
                        card?.status,
                        trackEnrollCloseDate,
                        card?.trackStatus
                      ) === 'In Progress'
                    ? 'bg_success_color'
                    : // : card?.trackStatus === 'COMPLETE' ? 'bg_primary_color'
                      '_app_closed'
                }`}
                onClick={() =>
                  getStatus(
                    card.enrollStatus,
                    card?.status,
                    trackEnrollCloseDate,
                    card?.trackStatus
                  ) === 'Enroll Now' && handleOpenModal()
                }
                disabled={loader}
              >
                {loader ? (
                  <Spinner text="Loading..." color="white" size="sm" />
                ) : (
                  getStatus(
                    card?.enrollStatus,
                    card?.status,
                    trackEnrollCloseDate,
                    card?.trackStatus
                  )
                )}
              </button>

              <button
                color="primary"
                className="moreinfo ms-1 learningTrack_card-btn"
                onClick={() => routeChange(card)}
              >
                MORE INFO
              </button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </>
  )
}

export default ImageCard
