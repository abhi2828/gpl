import React, { useState, useEffect } from 'react'
import UpcomingCard from '../../../components/card-upcoming'
import '../../../sass/home/Upcoming-Programs.scss'
import img1 from '@src/assets/images/userScreen/program1.png'
import img2 from '@src/assets/images/userScreen/program2.png'
import img3 from '@src/assets/images/userScreen/program3.png'
import img4 from '@src/assets/images/userScreen/program4.png'
import { Carousel } from 'react-responsive-carousel'
import { useSwipeable } from 'react-swipeable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLearningList } from '../../../../masters/learning-tracks/store'
import { useNavigate } from 'react-router-dom'
import Spinner from '@components/spinner/Loading-spinner'

const UpcomingLearningTrack = ({ path }) => {
  const { loader, learningList } = useSelector((state) => state.learningTrack)
  // const learningList = learningList.filter((temp)=>{
  //   temp.status === "UPCOMMING"
  // })
  const dispatch = useDispatch()
  const [changePath, setChangePath] = useState(false)
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
    let path = `view-all`
    navigate(path)
  }

  // useEffect(() => {
  //   const size = isMobile ? 1 : 4
  //   let filter_learningList = learningList?.filter(
  //     (word) => word.status === 'UPCOMMING'
  //   )

  //   // setList(result?.slice(0, size))
  //   let result = []
  //   for (let i = 0; i < filter_learningList?.length; i += size) {
  //     const chunk = filter_learningList?.slice(i, i + size)
  //     result.push(chunk)
  //   }
  //   setList(result)
  // }, [isMobile, learningList])
  useEffect(() => {
    const size = isMobile ? 1 : 4
    let filter_learningList = learningList?.filter(
      (word) => word.status === 'UPCOMMING' && word?.isVisible
    )

    // setList(result?.slice(0, size))
    let result = []
    for (let i = 0; i < filter_learningList?.length; i += size) {
      const chunk = filter_learningList?.slice(i, i + size)
      result.push(chunk)
    }
    setList(result)
  }, [isMobile, learningList])

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
    dispatch(fetchLearningList())
  }, [])
  return (
    <>
      <div className="upcoming">
        <div className="upcoming_sec1">
          <h1>
            Upcoming <span className="upcoming_sec1_title1">Learning</span>
            <span className="upcoming_sec1_title2"> Tracks</span>
          </h1>
        </div>
        <div className="upcoming_carousel">
          {loader ? (
            <Spinner />
          ) : list?.length === 0 ? (
            <h3
              style={{
                display: 'grid',
                justifyContent: 'center',
                textAlign: 'center',
                color: '#9b034a'
              }}
            >
              "No Data Found!"
            </h3>
          ) : (
            <Carousel autoPlay={true} {...bind} infiniteLoop={true}>
              {list &&
                list.map((res) => (
                  <div className="upcoming_sec2">
                    {res?.map((card) => (
                      <UpcomingCard card={card} />
                    ))}
                  </div>
                ))}
            </Carousel>
          )}
        </div>
        {list && list?.length ? (
          <div className="upcoming_sec3">
            <p onClick={routeChange} className="pointer">
              VIEW ALL
            </p>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default UpcomingLearningTrack
