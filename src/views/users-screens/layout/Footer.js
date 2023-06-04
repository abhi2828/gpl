import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Container, Row } from 'reactstrap'
import { Mail } from 'react-feather'
import godrej from '../../../assets/images/userScreen/unnamed.png'
import '../sass/footer.scss'
import { padding } from '@mui/system'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
  const openCompose = () => {
    // const email = 'gpl.alchemy@godrejproperties.com'
    // const url = `https://outlook.live.com/owa/?to=${email}`
    // window.open(url, '_blank')
    window.location.href = 'mailto:gpl.alchemy@godrejproperties.com'
  }

  let navigate = useNavigate()
  const handleRedirect = () => {
    navigate('/dashboard')
    window.scrollTo(0, 0)
  }
  return (
    <div id="footer" className="userFooter">
      <div className="userFooter_sec1">
        <div>
          <div className="userFooter_sec1-1">
            <h3>Alchemy Navigation</h3>
            <div className="userFooter_sec1-first">
              <div className="userFooter_sec1-first-div1">
                <Link
                  className="userFooter_sec1-first-div1-link"
                  to="/dashboard"
                >
                  Home
                </Link>

                <Link
                  className="userFooter_sec1-first-div1-link"
                  to="/user-learning-tracks"
                >
                  Learning
                </Link>
                <Link
                  className="userFooter_sec1-first-div1-link"
                  to="/user-talent-philosophy"
                >
                  Careers
                </Link>
                <Link
                  className="userFooter_sec1-first-div1-link"
                  to="/my-journey"
                >
                  My Journey
                </Link>
              </div>
            </div>
          </div>
          <div className="userFooter_sec2">
            <h3>Need Some Help?</h3>
            <div className="userFooter_sec1-first-div2">
              <Link className="userFooter_sec1-first-div1-link" to="#footer">
                About Us
              </Link>
              <Link className="userFooter_sec1-first-div1-link" to="#footer">
                FAQs
              </Link>
              <Link className="userFooter_sec1-first-div1-link" to="#footer">
                Policy Document
              </Link>
              <Link className="userFooter_sec1-first-div1-link" to="#">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="userFooter_sec3">
          <span onClick={openCompose}>
            <Mail size={20} /> gpl.alchemy@godrejproperties.com
          </span>
        </div>
        <div className="userFooter_sec4">
          <div className="userFooter_sec3-last">
            <img
              className="userFooter_sec3-last-img"
              src={godrej}
              onClick={handleRedirect}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          width: '100%',
          textAlign: 'center',
          borderTop: '1px solid gray',
          padding: '10px 0px'
        }}
      >
        Copyright © 2023. Godrej Properties Limited
      </div>
    </div>
  )
}

export default Footer
