import React, { useEffect, useState } from 'react'
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
import { selectThemeColors } from '@utils'
import classnames from 'classnames'
import Select from 'react-select'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '../../../sass/home/Carousel-Modal.scss'
// import { addSponsor, editSponsor, selectSponsor, setLoader } from './store'
// import { fetchDepartmentsList } from '../department/store'
// import { fetchDesignationDropdown } from '../designation/store'
// import { fetchUserList } from '../../user/store'
// import { SpecialCharactersFieldValidion } from '../../../../utility/Commonfunction'
// import ImageComp from '../../../../utility/commonComponents/ImageComp'
// import sucessfully from '../../../../assets/images/customIcon/sucessfully.svg'
// import { characterRegex, numRegex } from '../../../../utility/Utils'
// import { enrollLearningTrack } from '../../../masters/learning-tracks/store'
import { Carousel } from 'react-responsive-carousel'
import { useSwipeable } from 'react-swipeable'
import ProgramCard from '../../../components/card-program'
import { ChevronsLeft, ChevronsRight } from 'react-feather'

const CarouselModal = ({
  setShow,
  show,
  gallaryCardIndex,
  setGallaryCardIndex,
  gallary_card_list
}) => {
  const [submitData, setsubmitData] = useState(false)
  const [currentSlide, setCurrentSlide] = React.useState(0)
  const [width, setWidth] = useState(window.innerWidth)
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
  // console.log('bind', bind)
  let { loader, learningList } = useSelector((state) => state?.learningTrack)
  const lastIndex = gallary_card_list.length - 1

  const dispatch = useDispatch()
  const handleModalClosed = () => {
    // setsubmitData(true)
    setShow(false)
  }

  const handleGallaryIndex = (type) => {
    if (type === 'left') {
      if (gallaryCardIndex > 0) {
        setGallaryCardIndex((gallaryCardIndex) => gallaryCardIndex - 1)
      }
    } else if (type === 'right') {
      if (gallaryCardIndex < gallary_card_list.length - 1)
        setGallaryCardIndex((gallaryCardIndex) => gallaryCardIndex + 1)
    }
  }
  return (
    <>
      <Modal
        isOpen={show}
        onClosed={handleModalClosed}
        toggle={handleModalClosed}
        className="modal-dialog-centered modal_width"
      >
        <Row className="header_style">
          <Col xs={4} className="maroon_color"></Col>
          <Col xs={4} className="primary_color"></Col>
          <Col xs={4} className="success_color"></Col>
        </Row>
        <ModalHeader
          className="bg-transparent "
          toggle={handleModalClosed}
        ></ModalHeader>
        <ModalBody className="cModalBody">
          <div className="gallaryCardCarousel">
            <Row>
              <Col
                xs={1}
                className="d-flex align-items-center pointer"
                onClick={() => handleGallaryIndex('left')}
              >
                <button
                  className="arrow_btn_left"
                  disabled={gallaryCardIndex === 0 ? true : false}
                >
                  <ChevronsLeft
                  // color={gallaryCardIndex === 0 ? '#636363' : '#1e1e1e'}
                  />
                </button>
              </Col>
              <Col xs={10}>
                <img
                  className="gallaryImgCard"
                  src={gallary_card_list[gallaryCardIndex]?.imageUrl}
                  alt=""
                />
              </Col>
              <Col
                xs={1}
                className="d-flex align-items-center pointer"
                onClick={() => handleGallaryIndex('right')}
              >
                <button
                  className="arrow_btn"
                  disabled={lastIndex === gallaryCardIndex ? true : false}
                >
                  <ChevronsRight
                  // color={
                  //   lastIndex === gallaryCardIndex ? '#636363' : '#1e1e1e'
                  // }
                  />
                </button>
              </Col>
            </Row>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default CarouselModal
