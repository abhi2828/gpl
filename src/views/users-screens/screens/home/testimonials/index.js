import React, { useState, useEffect } from 'react'
import DetailCard from '../../../components/card-detail/index.js'
import '../../../sass/home/Testimonials.scss'
import { Carousel } from 'react-responsive-carousel'
import { useSwipeable } from 'react-swipeable'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTestimonial } from '../../../../masters/testimonial/store/index.js'
import { useNavigate } from 'react-router-dom'
import Spinner from '@components/spinner/Loading-spinner'

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const { loader, testimonialList } = useSelector((state) => state.testimonial)
  const filteredList = useSelector((state) =>
    state.testimonial?.testimonialList?.filter((temp) => temp.isVisible)
  )
  const dispatch = useDispatch()
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
    let path = `all-testimonials`
    navigate(path)
  }

  useEffect(() => {
    const size = isMobile ? 1 : 3
    const result = []

    for (let i = 0; i < filteredList?.length; i += size) {
      const chunk = filteredList?.slice(i, i + size)
      result.push(chunk)
    }

    setList(result)
  }, [isMobile, testimonialList])

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
    dispatch(fetchTestimonial())
  }, [])

  return (
    <div className="testimonials">
      <div className="testimonials_sec1">
        <h1>Testimonials</h1>
        <p>Insights from Insiders</p>
      </div>
      <div className="testimonials_carousel">
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
          <Carousel autoPlay infiniteLoop={true} showThumbs={false} {...bind}>
            {list?.map((res) => (
              <div key={res} className="testimonials_sec2">
                {res?.map((card, i) => {
                  return <DetailCard i={i + 1} card={card} loader={loader} />
                })}
              </div>
            ))}
          </Carousel>
        )}
      </div>
      {list && list?.length ? (
        <div className="testimonials_sec3">
          <p className="pointer" onClick={routeChange}>
            VIEW ALL
          </p>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Testimonials
