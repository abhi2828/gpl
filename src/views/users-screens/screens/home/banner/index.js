import React, { Component, useEffect } from 'react'
import '../../../sass/home/Banner.scss'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import MaroonDoubleQuotation from '../../../../../assets/images/customIcon/MaroonDoubleQuotation.svg'
import BlueDoubleQuotation from '../../../../../assets/images/customIcon/BlueDoubleQuotation.svg'
import { useSwipeable } from 'react-swipeable'
import { useDispatch, useSelector } from 'react-redux'
import { getAllBanners } from '../../../../masters/banner/store'
import ReactPlayer from 'react-player'
import Spinner from '@components/spinner/Loading-spinner'
// import { Swipeable } from 'react-touch-events'

const Banner = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const { loader, bannerList } = useSelector((state) => state.bannerMaster)
  const list = bannerList?.filter((temp) => temp.isVisible)
  const dispatch = useDispatch()

  const bind = useSwipeable({
    onSwipedLeft: () => setCurrentSlide((currentSlide + 1) % list?.length),
    // onSwipedLeft: () => console.log('left'),
    onSwipedRight: () =>
      setCurrentSlide((currentSlide + list?.length - 1) % list?.length),
    delta: 50, // minimum distance required for a swipe
    velocity: 0.2, // minimum velocity required for a swipe
    preventDefaultTouchmoveEvent: true, // disable scrolling while swiping
    trackTouch: true, // track touch events instead of mouse events
    axis: 'x' // only detect horizontal swipes
  })

  // const handleSwipeLeft = () => {
  //   setCurrentSlide((currentSlide + 1) % slides.length)
  // }

  // const handleSwipeRight = () => {
  //   setCurrentSlide((currentSlide + slides.length - 1) % slides.length)
  // }

  // let url;
  useEffect(() => {
    dispatch(getAllBanners())
  }, [])
  return (
    // <Swipeable onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
    <div className="banner_wrapper">
      {list && list?.length ? (
        <div className="img_wraper_top">
          <img src={BlueDoubleQuotation} alt="" />
        </div>
      ) : (
        <></>
      )}
      {loader ? (
        <Spinner />
      ) : list?.length === 0 ? (
        <h3
          style={{
            display: 'grid',
            justifyContent: 'center',
            textAlign: 'center',
            color: 'orange',
            width: '100%',
            marginBottom: '0'
          }}
        >
          "No Data Found!"
        </h3>
      ) : (
        <Carousel
          className="banner"
          autoPlay
          infiniteLoop={true}
          showThumbs={false}
          selectedItem={currentSlide}
          onChange={setCurrentSlide}
          {...bind}
        >
          {list?.map((slide, index) => {
            return (
              <div className="banner_sec" key={index}>
                <div className="banner_sec-2">
                  {slide.showContent === 'IMAGE' ? (
                    <img
                      className="banner_sec-2-img"
                      src={slide.url}
                      alt="img1"
                    />
                  ) : (
                    <ReactPlayer
                      className="banner_sec-2-video"
                      url={slide.url}
                    />
                  )}
                </div>
              </div>
            )
          })}
        </Carousel>
      )}

      {list && list?.length ? (
        <div className="img_wraper_bottom">
          <img src={MaroonDoubleQuotation} alt="" />
        </div>
      ) : (
        <></>
      )}
    </div>

    // </Swipeable>
  )
}

export default Banner
