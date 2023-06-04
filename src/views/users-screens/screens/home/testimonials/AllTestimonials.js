import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Col, Row } from 'reactstrap'
import { fetchTestimonial } from '../../../../masters/testimonial/store'
import DetailCard from '../../../components/card-detail'
import { CommonHeader } from '../../../components/common-header/CommonHeader'
import '../../../sass/home/Testimonials.scss'

const AllTestimonials = () => {
  const { loader, testimonialList } = useSelector((state) => state.testimonial)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchTestimonial())
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <>
      <CommonHeader name={'Testimonials'} path={`/dashboard`} />
      <div className="testimonials_all">
        {testimonialList?.map((card, i) =>
          card?.isVisible ? (
            <DetailCard i={i} card={card} loader={loader} />
          ) : (
            <></>
          )
        )}
      </div>
    </>
  )
}

export default AllTestimonials
