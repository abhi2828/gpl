import React, { useRef, useEffect, useState } from 'react'
import { Col, Container, Row } from 'reactstrap'
import '../../../sass/inhouse/inhouse.scss'
import inhouse from '../../../../../assets/images/customIcon/inhouse.jpg'
import Check from '../../../../../assets/images/customIcon/check.svg'
const Inhouse = () => {
  // const componentRef = useRef(null)
  // const [visible, setVisible] = useState(false)
  // useEffect(() => {
  //   const handleScroll = () => {
  //     const componentPosition = componentRef?.current?.offsetTop
  //     const scrollPosition = window.scrollY + window.innerHeight
  //     if (scrollPosition > componentPosition) {
  //       setVisible(true)
  //     }
  //   }
  //   window.addEventListener('scroll', handleScroll)
  //   return () => {
  //     window.removeEventListener('scroll', handleScroll)
  //   }
  // }, [])
  return (
    <>
      <br />
      <br />
      <br />
      <div className="inhouse_sec">
        <Row className="myouterpadding">
          <Col md={8} className=" inhouse_sec1">
            <div className="content_warapper">
              <p>
                Drawing its essence from the word “alchemy” which means a
                magical process of transformation, creation or combination, GPL
                Alchemy is GPL's in-house learning academy built with a vision
                of taking a giant leap in organizational human capital.
              </p>
              <p>
                We believe organizations and individuals can be relevant
                forever, “immortal” if we continually invest in building a
                learning and agile culture.
              </p>
              <p>
                GPL Alchemy will commit to building this culture through curated
                experiences serving organizational and individual aspirations.
                The process of transformation is, finally, in the hands of the
                learner, each and every GPLite.
              </p>
            </div>
          </Col>
          <Col md={4} className="inhouse_right_sec2">
            <Row className="align-center card-height-100">
              <Col className="right_heading">
                <h1 className="title-left gplTitle">
                  GPL <span style={{ color: '#bc9a29' }}>Alchemy</span>
                </h1>
                <p className="left_sub_title text-left">
                  In-house Learning Academy
                </p>
                <hr />
                <p className="left_sub_title2 text-left">
                  Transforming Self, Teams & Organization
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <br />
      <br />
      <br />
      <div className="inhouse_sec2">
        <div className="sec1 p-3">
          <Row>
            <Col>
              <h1 className="card_title_1 text-center text-white">
                Alchemy<span className="fst-italic text-white">-ize </span>
                Yourself!
              </h1>
            </Col>
          </Row>
        </div>
        <div className="sec2">
          <Row className="sec2_width m-auto shadowBox">
            <Col
              md={6}
              id="leftsec"
              // className={visible ? 'animate' : ''}
              // ref={componentRef}
            >
              <p className="">
                GPL Alchemy is designed to have Learning Tracks that closely
                resonate with the 5 important & core areas of focus of The
                Quantum Growth Phase at GPL;
              </p>
              <ul>
                <li>Quality obsessed & Customer first</li>
                <li>Individual contribution to creating a winning Culture</li>
                <li>Disruptive Growth</li>
                <li>Profitable growth through strong asset management</li>
                <li>Operational Excellence</li>
              </ul>
              <p>
                The Learning Tracks will cover upon Business Capabilities,
                Culture & Leadership, and The Godrej Way.
              </p>
            </Col>
            <Col md={6} id="rightsec">
              <p>
                You can click on<span className="fst-italic "> Learning</span>{' '}
                tab and enroll yourself into Learning Tracks. You may also be
                nominated for certain learning tracks by your reporting manager
                or the HR team.
              </p>
              <p>
                Once you have enrolled yourself into a Learning Track, the HR
                team will evaluate your enrolment and update you about the
                status. Once your enrolment has been accepted, you can track
                your details and progress on
                <span className="fst-italic "> My Journey tab.</span>
              </p>
              <p>
                <span className="fst-italic "> Careers</span>&nbsp; tab helps
                you to express your career aspirations. The HR team shall use
                this data org-wide to design career development interventions.
                You may also view various possible career trajectories in Career
                Tracks section.
              </p>
              <p className="fst-italic">
                We wish you best for your development journey!
              </p>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default Inhouse
