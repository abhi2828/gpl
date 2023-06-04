import { React, useState, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  fetchLearningListById,
  selectLearningTrack,
  setLearningListById,
  setLoader
} from '../store'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Card, CardBody, Col, Row } from 'reactstrap'
import SubTrackTable from './SubTrackTable'
import SponsorTable from './SponsorTable'

import Spinner from '@components/spinner/Loading-spinner'
import ImageComp from '../../../../utility/commonComponents/ImageComp'

const TrackDetailsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { LearningListById, totalPages, selected, params, loader } =
    useSelector((state) => state?.learningTrack)

  const location = useLocation()
  const [show, setShow] = useState(false)

  const trackId = location?.state?.trackId

  useEffect(() => {
    if (!trackId) {
      navigate('/learning-tracks')
    }
    dispatch(setLoader(true))
    dispatch(setLearningListById(null))

    const timer = setTimeout(() => {
      const id = trackId
      dispatch(fetchLearningListById(id))
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const htmlDecode = (input) => {
    var e = document.createElement('div')
    e.innerHTML = input
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue
  }

  return (
    <>
      {/* <div className="react-dataTable">
        <DataTable
          // pagination
          // subHeader
          // responsive
          // highlightOnHover
          // paginationServer
          //   progressComponent={<Spinner />}
          //   progressPending={loader}
          // columns={columns}
          // data={[LearningListById]}
          // sortIcon={<ChevronDown />}
          // className="react-dataTable"
          //   paginationComponent={renderPaginationComponent}
          subHeaderComponent={
            <CustomHeader
              showAddButton={false}
              showSearch={false}
              title="Learning Track Details"
            />
          }
        />
      </div> */}

      {/* <br />
      <br /> */}

      {/* <SubTrackTable /> */}

      {/* {show && <SubTrackForm show={show} setShow={setShow} />} */}
      {loader ? (
        <Spinner />
      ) : (
        <>
          <Card>
            <div className="mt-1">
              <Col
                xl={{ size: 12 }}
                lg={{ size: 12 }}
                sm={{ size: 12 }}
                xs={{ order: 12 }}
              >
                <h4 className="fw-bolder ms-1 me-2 mt-1 d-flex text-capitalize">
                  <div
                    onClick={() => {
                      navigate('/learning-tracks')
                      dispatch(selectLearningTrack(null))
                    }}
                  >
                    <ChevronLeft className="me-1" />
                  </div>
                  {LearningListById?.name}
                </h4>
              </Col>
            </div>
            <CardBody>
              <Row>
                <Col>
                  <ul className="list-unstyled">
                    {/* <li className="mb-75">
                      <span className="fw-bolder me-25">Summary : </span>
                      <span>{LearningListById?.description ?? '-'}</span>
                    </li> */}
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Start Date : </span>
                      <span>{LearningListById?.startDate ?? '-'}</span>
                    </li>
                    <li className="mb-75">
                      <span className="fw-bolder me-25">Status: </span>
                      <span>{LearningListById?.status ?? '-'}</span>
                    </li>
                  </ul>
                </Col>
                <Col>
                  <ul className="list-unstyled">
                    <li className="mb-75">
                      <span className="fw-bolder me-25">End Date: </span>
                      <span>{LearningListById?.endDate ?? '-'}</span>
                    </li>
                  </ul>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="mb-1">
                    <h6>Objective</h6>
                    <div
                      className="info-container"
                      dangerouslySetInnerHTML={{
                        __html: LearningListById?.objective
                      }}
                    />
                  </div>
                </Col>
                <Col>
                  <div className=" mb-1">
                    <h6>Curriculum</h6>
                    <div
                      className="info-container"
                      dangerouslySetInnerHTML={{
                        __html: LearningListById?.curriculum
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className=" mb-2 ">
                    <h6>Image</h6>
                    <ImageComp
                      style={{ height: 200 }}
                      imageUrl={LearningListById?.imageUrl}
                      className=""
                    />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card>
            <Col
              lg={{ size: 3, order: 1 }}
              sm={{ size: 12 }}
              xs={{ order: 1 }}
              style={{ width: '100%' }}
            >
              <SponsorTable trackDetail={LearningListById} />
            </Col>
          </Card>
          <Card>
            <Col
              lg={{ size: 3, order: 1 }}
              sm={{ size: 12 }}
              xs={{ order: 1 }}
              style={{ width: '100%' }}
            >
              <SubTrackTable trackDetail={LearningListById} />
            </Col>
          </Card>
        </>
      )}
    </>
  )
}

export default TrackDetailsPage
