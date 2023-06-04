import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { fetchLearningList } from '../../../../masters/learning-tracks/store'
import ProgramCard from '../../../components/card-program'
import UpcomingCard from '../../../components/card-upcoming'
import { CommonHeader } from '../../../components/common-header/CommonHeader'
import { MySpinner } from '../../learning-tracks'

const UpcomingViewAll = () => {
  const { loader, learningList } = useSelector((state) => state.learningTrack)
  const dispatch = useDispatch()

  let filter_learningList = learningList?.filter(
    (word) => word.status === 'UPCOMMING' && word?.isVisible
  )

  useEffect(() => {
    dispatch(fetchLearningList())
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])
  return (
    <>
      <CommonHeader name={'Upcoming Learning Tracks'} path={`/dashboard`} />
      <Row className="upcoming_all">
        {filter_learningList?.length ? (
          filter_learningList?.map((card, i) => (
            <Col md={4} key={card} className="" id={i}>
              <UpcomingCard card={card} loader={loader} />
            </Col>
          ))
        ) : (
          <>
            {' '}
            <MySpinner />
          </>
        )}
      </Row>
    </>
  )
}

export default UpcomingViewAll
