import React, { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { fetchLearningList } from '../../../../masters/learning-tracks/store'
import ProgramCard from '../../../components/card-program'
// import { fetchLearningList } from '../../../../masters/learning-tracks/store'
import { CommonHeader } from '../../../components/common-header/CommonHeader'
import { MySpinner } from '../../learning-tracks'
import { fetchUserEnroll } from '../../my-journey/store'
import CarouselModal from './CarouselModal'

const RecentExecutedTrack = () => {
  // const { loader, learningList } = useSelector((state) => state.learningTrack)
  const { userEnroll, loader } = useSelector((state) => state?.myJourney)

  const { userData } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  let result = userEnroll?.filter(
    (word) =>
      word?.status === 'LAUNCHED' &&
      word?.enrollStatus === 'ACCEPT' &&
      word?.trackStatus !== 'COMPLETE'
  )
  console.log('result', result)

  // setList(result.slice(0, size))
  useEffect(() => {
    dispatch(fetchUserEnroll({ userId: userData.id }))
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])
  return (
    <>
      <CommonHeader name={'Ongoing Tracks'} path={'/dashboard'} />
      <Row className="OngoingAll">
        {result?.length ? (
          result?.map(
            (card, i) => (
              // card?.isVisible && (
              <Col md={4} key={card} className="" id={i}>
                <ProgramCard i={i} card={card} loader={loader} />
              </Col>
            )
            // )
          )
        ) : (
          <MySpinner />
        )}
      </Row>
    </>
  )
}

export default RecentExecutedTrack

export const GallaryCard = ({ data, loader }) => {
  const [show, setShow] = useState(false)
  const [gallaryCardIndex, setGallaryCardIndex] = useState(0)
  const handleModalCarousel = (id) => {
    setGallaryCardIndex(id)
    setShow(true)
  }
  return (
    <>
      <CarouselModal
        setShow={setShow}
        show={show}
        gallary_card_list={data}
        gallaryCardIndex={gallaryCardIndex}
        setGallaryCardIndex={setGallaryCardIndex}
      />
      <Row className="recentExecutedTrack_padding">
        {data.map((card, i) => {
          return (
            <Col lg={3} md={4} sm={6} key={card} className="" id={i}>
              <div className="programCard_sec1">
                <img
                  className="gallary_card"
                  src={card.imageUrl}
                  alt="CardImage"
                  onClick={() => handleModalCarousel(i)}
                />
                <br />
                <br />
              </div>
            </Col>
          )
        })}
      </Row>
    </>
  )
}
