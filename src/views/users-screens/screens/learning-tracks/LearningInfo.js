import React, { useState } from 'react'
import Card from 'react-bootstrap/Card'
import { Col, Row, Spinner } from 'reactstrap'
import arrow_up_circle from '../../../../assets/images/customIcon/arrow_up_circle.svg'
import EnrollFormModal from './Form'
import '../../sass/learning-track/learning-track.scss'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'
import {
  fetchLearningListById,
  fetchMyTrackinfo,
  setLearningListById
} from '../../../masters/learning-tracks/store'
import { useDispatch, useSelector } from 'react-redux'
import ShowDetailsModal from './ShowDetailsModal'
import { MySpinner } from './index'
import { getStatus } from '../../../../utility/Utils'

export const LearningInfoHeader = ({ setShow, LearningListById }) => {
  const [loader, setLoader] = useState(false)
  const location = useLocation()
  const status = location?.state?.status
  const trackStatus = location?.state?.trackStatus
  const dispatch = useDispatch()
  let navigate = useNavigate()
  const routeChange = () => {
    navigate(-1)
    dispatch(setLearningListById([]))
  }
  const handleOpenModal = async () => {
    setLoader(true)
    const res = await dispatch(fetchMyTrackinfo())
    if (res.payload) {
      setShow(true)
    }
    setLoader(false)
  }

  let trackEnrollCloseDate = new Date(
    LearningListById?.enrollCloseDate !== null &&
      LearningListById?.enrollCloseDate
  )
  return (
    <div className="learning_info_sec_header">
      <div className="header_wraper d-flex align-items-center">
        <button className="bg_maroon_color" onClick={routeChange}>
          <img src={arrow_up_circle} alt="back" />
        </button>
        <h2>{LearningListById?.name}</h2>
      </div>

      <div className="middle_sec2">
        <button
          className={`btn bg_primary_color text-capitalize  learningTrack_card-btn
          
          ${
            getStatus(
              status,
              LearningListById?.status,
              trackEnrollCloseDate,
              trackStatus
            ) === 'Enroll Now'
              ? 'enroll'
              : getStatus(
                  status,
                  LearningListById?.status,
                  trackEnrollCloseDate,
                  trackStatus
                ) === 'In Progress'
              ? 'bg_success_color'
              : '_app_closed'
          }`}
          onClick={() =>
            getStatus(
              status,
              LearningListById?.status,
              trackEnrollCloseDate,
              trackStatus
            ) === 'Enroll Now' && handleOpenModal()
          }
          disabled={loader}
        >
          {loader ? (
            <Spinner />
          ) : (
            getStatus(
              status,
              LearningListById?.status,
              trackEnrollCloseDate,
              trackStatus
            )
          )}
        </button>
        {LearningListById?.fileUrl && (
          <a
            href={LearningListById?.fileUrl}
            download={LearningListById?.fileUrl
              ?.substring(LearningListById?.fileUrl?.lastIndexOf('_') + 1)
              .replace('.pdf', '')}
            target="_blank"
          >
            <button outline color="primary" className="mx-1 moreinfo">
              DOWNLOAD BROCHURE
            </button>
          </a>
        )}
      </div>
    </div>
  )
}

const LearningInfoSec = ({ LearningListById }) => {
  const {
    description,
    objective,
    curriculum,
    trackSponsors,
    trackTrainer,
    subTrackEntity,
    trackDepartmentEntity
  } = LearningListById
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [userDetailsModal, setuserDetailsModal] = useState({})
  const [userType, setuserType] = useState('')

  let openDetailsModal = (id, userType) => {
    setuserType(userType)
    setShowDetailsModal(true)
    setuserDetailsModal({ ...id })
  }
  let closeDetails = () => {
    setShowDetailsModal(false)
  }

  useEffect(() => {}, [])
  return (
    <>
      <ShowDetailsModal
        closeDetails={closeDetails}
        userDetailsModal={userDetailsModal}
        userType={userType}
        showDetailsModal={showDetailsModal}
      />

      <div className="box">
        <Row className="learning_info_sec d-flex justify-content-between">
          <Col md={8}>
            <div className="title mb-3 Description" id="sec1">
              <h3>Description & Objectives</h3>

              {/* <p className="mb-1 mt-2">{description}</p> */}
              <div
                className=""
                style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: objective }}
              ></div>
            </div>

            <div className="title mb-3 Curriculum" id="sec2">
              <h3>Track Curriculum </h3>

              <div
                className=" my-1"
                style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: curriculum }}
              ></div>
            </div>
            <div className="title mb-1 sub_track" id="sec3">
              <h3 className="mb-2">Sub-Tracks </h3>
              <ul>
                {subTrackEntity?.map((temp) => (
                  <li key={temp.id} className="mb-1 list">
                    <label>{temp.name}</label>
                  </li>
                ))}
              </ul>
            </div>
            <div className="title mb-1 Description" id="sec4">
              <h3 className="mb-2">Applicable Functions </h3>
              {trackDepartmentEntity?.map(
                ({ departmentDescription, departmentId, departmentName }) => (
                  <li key={departmentId} className="mb-1 list">
                    <label>{departmentName}</label>
                  </li>
                )
              )}
            </div>
          </Col>

          <Col md={4} className="right_sec">
            <p className="user_title LT_details">Tracks Details</p>
            <Row className="mb-2">
              <div className="on_click">
                <div className="flex align_center">
                  <div className="sponser_align">
                    <p className="LT_date">
                      <strong>Application Start Date</strong> :
                      <span>&nbsp;{LearningListById.startDate}</span>
                    </p>
                    <p className="LT_date">
                      <strong>Application End Date</strong> :
                      <span>&nbsp;{LearningListById.endDate}</span>
                    </p>
                    <p className="LT_date">
                      <strong>Application Close Date</strong> :
                      <span>&nbsp;{LearningListById.enrollCloseDate}</span>
                    </p>
                  </div>
                </div>
              </div>
            </Row>
            <p className="user_title">Sponsor</p>
            <Row className="mb-3">
              {trackSponsors?.map((e, index) => {
                let id = e
                return (
                  <div
                    onClick={() => openDetailsModal(e, 'sponsor')}
                    key={index}
                    className="on_click mb-2"
                  >
                    <div className="flex align_center">
                      <div className="">
                        <Card.Img
                          src={e.sponsorImage}
                          className="sponser_profile_img"
                        />
                      </div>
                      <div className="sponser_align">
                        <p className="user_name">{e?.sponsorName}</p>
                        <p className="user_type">{e?.designationName}</p>
                      </div>
                    </div>
                    <Row>
                      <Col>
                        <p className="user_description">
                          {e?.sponsorMessage?.split(' ').length > 100
                            ? `${e?.sponsorMessage.substring(0, 100)}...`
                            : e?.sponsorMessage}
                        </p>
                      </Col>
                    </Row>
                  </div>
                )
              })}
            </Row>
            <p className="user_title trainer_title">Trainer</p>
            <Row className="mb-3">
              {trackTrainer?.map((e, index) => {
                // let id = e
                return (
                  <div
                    onClick={() => openDetailsModal(e, 'trainer')}
                    className="on_click"
                    key={index}
                  >
                    <div className="flex flex align_center">
                      <div className="" key={index}>
                        <Card.Img
                          variant="top"
                          src={e.trainersMasterImageUrl}
                          className="sponser_profile_img"
                        />
                      </div>
                      <div className="sponser_align">
                        <p className="user_name">{e?.trainersMasterName}</p>
                        <p className="user_type gray marginBottom-8">
                          {e?.designationName}
                        </p>
                        <p className="user_details pointer">Trainer Details</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </Row>

            <p className="user_title trainer_title">Total Enrollment</p>
            <Row>
              <Col>
                <div className="">
                  <p className="total_enrollment">
                    {LearningListById?.maxEnroll}
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </>
  )
}

export const LearningInfoBanner = ({ LearningListById }) => {
  return (
    <>
      {LearningListById.bannerUrl ? (
        <div className="banner_image_learning">
          <div className="img-fluid">
            <img src={LearningListById.bannerUrl} alt="" />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

const ScrollTabs = () => {
  const location = useLocation()
  const [active, setActive] = useState('sec1')
  const handleClickScroll = (id) => {
    setActive(id)
    var element = document.getElementById(id)
    var headerOffset = 90
    var elementPosition = element.getBoundingClientRect().top
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  useEffect(() => {
    const functionStatus = location?.state?.functionStatus
    if (functionStatus) {
      handleClickScroll('sec4')
    }
  }, [])
  return (
    <Row className="selectionTabs m-0">
      <Col>
        <Row>
          <Col xm={8}>
            <button
              key={1}
              className={
                active === 'sec1'
                  ? 'btn learning_track_btn-active learning_track_fontSize learning_track_btn-active-1'
                  : 'btn learning_track_btn learning_track_fontSize'
              }
              onClick={() => handleClickScroll('sec1')}
            >
              Description & Objectives
            </button>

            <button
              key={2}
              className={
                active === 'sec2'
                  ? 'btn learning_track_btn-active learning_track_fontSize learning_track_btn-active-2'
                  : 'btn learning_track_btn learning_track_fontSize'
              }
              onClick={() => handleClickScroll('sec2')}
            >
              Track Curriculum
            </button>

            <button
              key={3}
              className={
                active === 'sec3'
                  ? 'btn learning_track_btn-active learning_track_fontSize learning_track_btn-active-3'
                  : 'btn learning_track_btn learning_track_fontSize'
              }
              onClick={() => handleClickScroll('sec3')}
            >
              Sub-Tracks
            </button>

            <button
              key={3}
              className={
                active === 'sec4'
                  ? 'btn learning_track_btn-active learning_track_fontSize learning_track_btn-active-3'
                  : 'btn learning_track_btn learning_track_fontSize'
              }
              onClick={() => handleClickScroll('sec4')}
            >
              Applicable Functions
            </button>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

const LearningInfo = ({ handleInfo }) => {
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)

  const { LearningListById, loader } = useSelector(
    (state) => state?.learningTrack
  )
  const { id } = useParams()
  useEffect(() => {
    dispatch(fetchLearningListById(id))
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <>
      {LearningListById.length < 1 ? (
        <MySpinner />
      ) : (
        <>
          <LearningInfoBanner LearningListById={LearningListById} />
          {show && (
            <EnrollFormModal
              LearningListById={LearningListById}
              setShow={setShow}
              show={show}
              trackName={LearningListById}
            />
          )}
          <LearningInfoHeader
            LearningListById={LearningListById}
            handleInfo={handleInfo}
            setShow={setShow}
          />
          <ScrollTabs />
          <LearningInfoSec LearningListById={LearningListById} />
        </>
      )}
    </>
  )
}

export default LearningInfo
