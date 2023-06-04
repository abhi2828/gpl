import React, { useState, useEffect } from 'react'
import '../../../sass/home/Recent-Executed-Programs.scss'
import ProgramCard from '../../../components/card-program'
import { Carousel } from 'react-responsive-carousel'
import { useSwipeable } from 'react-swipeable'
import { useDispatch, useSelector } from 'react-redux'
import Spinner from '@components/spinner/Loading-spinner'
import { useNavigate } from 'react-router-dom'
import { fetchLearningList } from '../../../../masters/learning-tracks/store'
import { fetchUserEnroll } from '../../my-journey/store'

const RecentExecutedTrack = () => {
  // const { loader, learningList } = useSelector((state) => state.learningTrack)
  const { userEnroll, loader } = useSelector((state) => state?.myJourney)

  const { userData } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [list, setList] = useState([])
  const [width, setWidth] = useState(window.innerWidth)
  const isMobile = width <= 768
  const bind = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((currentSlide + 1) % slides.length),
    // onSwipedLeft: () => console.log('left'),
    onSwipedRight: () =>
      setCurrentSlide((currentSlide + slides.length - 1) % slides.length),
    delta: 50, // minimum distance required for a swipe
    velocity: 0.2, // minimum velocity required for a swipe
    preventDefaultTouchmoveEvent: true, // disable scrolling while swiping
    trackTouch: true, // track touch events instead of mouse events
    axis: 'x' // only detect horizontal swipes
  })

  let navigate = useNavigate()
  const routeChange = () => {
    let path = `/dashboard/recent-executed-track`
    navigate(path)
  }

  useEffect(() => {
    const size = isMobile ? 1 : 3
    let result = []
    let filter_learningList = userEnroll?.filter(
      (word) =>
        word?.status === 'LAUNCHED' &&
        word?.enrollStatus === 'ACCEPT' &&
        word?.trackStatus !== 'COMPLETE'
    )
    for (let i = 0; i < filter_learningList?.length; i += size) {
      const chunk = filter_learningList?.slice(i, i + size)
      result.push(chunk)
    }
    setList(result)
  }, [isMobile, userEnroll])

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }
  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  useEffect(() => {
    // dispatch(fetchLearningList({ status: 1 }))
    // Please dont change this until DEMO - Shubham
    dispatch(fetchUserEnroll({ userId: userData.id }))
    // dispatch(fetchLearningList())
  }, [])

  return (
    <>
      <div className="home_recent">
        {/* <div className="rec_top py-3"> */}
        <h1>Ongoing Tracks</h1>

        <div className="recentBottom">
          <div className="carousel">
            {' '}
            {loader ? (
              <Spinner />
            ) : list?.length === 0 ? (
              <h3
                style={{
                  display: 'grid',
                  justifyContent: 'center',
                  textAlign: 'center',
                  color: 'rgb(155, 3, 74)'
                }}
              >
                "No Data Found!"
              </h3>
            ) : (
              <Carousel
                autoPlay
                infiniteLoop={true}
                showThumbs={false}
                {...bind}
              >
                {list.map((res, index) => (
                  <div key={res} className="recent_sec2" id={index}>
                    {res?.map((card, i) => {
                      return (
                        <ProgramCard
                          card={card}
                          loader={loader}
                          parent={'recent'}
                        />
                      )
                    })}
                  </div>
                ))}
              </Carousel>
            )}
            {list && list?.length ? (
              <div className="recentBottom_view">
                <p className="pointer" onClick={routeChange}>
                  VIEW ALL
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default RecentExecutedTrack
