// ** MUI Imports
import Accordion from '@mui/material/Accordion'
import Typography from '@mui/material/Typography'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Probability from '../probability'
import Performance from '../performance'
import '../../../../sass/my-journey/probability.scss'
import { Button } from 'reactstrap'
import ProbabilityCertificate from '../../../../../../assets/images/customIcon/ProbabilityCertificate.pdf'
import { ChevronDown, Share, Award, Linkedin, Share2 } from 'react-feather'
import { useEffect, useState, useRef } from 'react'
import { LinkedinShareButton } from 'react-share'
import { useSelector } from 'react-redux'
import { viewUserCertificate } from '../../store'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { baseUrl } from '../../../../../../app.config'
import { toast } from 'react-hot-toast'
import { Spinner } from 'react-bootstrap'

const AccordionSimple = ({ track, userEnroll }) => {
  const [expanded, setExpanded] = useState(false)
  const [condi, setCondi] = useState(false)
  const { subTrackList, trackId } = track
  const [viewLoading, setViewLoading] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const location = useLocation()
  const completeList = subTrackList.map((e) => e.completeDate)

  const { userId } = useSelector((state) => state?.myJourney)

  const newId = location.state?.id

  const ref = useRef(null)
  useEffect(() => {
    if (newId) {
      const element = document.getElementById(newId)
      if (element) {
        ref.current = element
      }
    }
  }, [newId])

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [ref.current])

  useEffect(() => {
    if (completeList.length === 0 || completeList.includes(null)) {
      setCondi(true)
    }
  }, [track])

  const ViewCertificateOnNew = async () => {
    setViewLoading(true)
    if (!track?.fileUrl || !track?.imageUrl) {
      const payload = {
        userId: userId,
        learningTrackId: track?.trackId
      }
      axios
        .get(
          baseUrl() +
            `/user_certificate/certificate?learningTrackId=${
              payload.learningTrackId
            }&userId=${payload.userId}&subTrackId=${
              payload.subTrackId ? payload.subTrackId : ''
            } `
        )
        .then((res) => {
          setViewLoading(false)
          const urls = res.data.data
          if (urls?.pdfUrl) {
            window.open(urls?.pdfUrl)
          }
        })
        .catch((e) => {
          setViewLoading(false)
          toast.error(
            e?.response?.data?.message
              ? e?.response?.data?.message
              : 'server error'
          )
        })
    } else {
      setViewLoading(false)
      window.open(track.fileUrl)
    }
  }

  console.log('first', track?.imageUrl)

  const shareOnLinkedin = () => {
    setShareLoading(true)
    if (!track?.fileUrl || !track?.imageUrl) {
      const payload = {
        userId: userId,
        learningTrackId: track?.trackId
      }
      axios
        .get(
          baseUrl() +
            `/user_certificate/certificate?learningTrackId=${
              payload.learningTrackId
            }&userId=${payload.userId}&subTrackId=${
              payload.subTrackId ? payload.subTrackId : ''
            }`
        )
        .then((res) => {
          setShareLoading(false)
          const urls = res.data.data
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${urls.imageUrl}`
          )
        })
        .catch((e) => {
          setShareLoading(false)
          toast.error(
            e?.response?.data?.message
              ? e?.response?.data?.message
              : 'server error'
          )
        })
    } else {
      setShareLoading(false)
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${track.imageUrl}`
      )
    }
  }

  //TO PUBLISH / POST CERTIFICATE ON WORKPLACE

  const sharePost = () => {
    // window.location.href = `https://work.workplace.com/sharer.php?display=popup&u=https://picsum.photos/200/300&redirect_uri=${REDIRECT_URI}`

    // window.location.href = `https://work.workplace.com/sharer.php?display=popup&u=https://picsum.photos/200/300`
    setShareLoading(true)
    if (!track?.fileUrl || !track?.imageUrl) {
      const payload = {
        userId: userId,
        learningTrackId: track?.trackId
      }
      axios
        .get(
          baseUrl() +
            `/user_certificate/certificate?learningTrackId=${
              payload.learningTrackId
            }&userId=${payload.userId}&subTrackId=${
              payload.subTrackId ? payload.subTrackId : ''
            }`
        )
        .then((res) => {
          setShareLoading(false)
          const urls = res.data.data
          window.open(
            `https://work.workplace.com/sharer.php?display=popup&u=${urls.imageUrl}`
          )
        })
        .catch((e) => {
          setShareLoading(false)
          toast.error(
            e?.response?.data?.message
              ? e?.response?.data?.message
              : 'server error'
          )
        })
    } else {
      setShareLoading(false)
      window.open(
        `https://work.workplace.com/sharer.php?display=popup&u=${track.imageUrl}`
      )
    }
  }

  return (
    <div
      className="probabilityPerformance_sec"
      id={track?.trackName}
      // style={{
      //   width: '100%',
      //   overflowY: 'auto',
      //   // border: '2px solid gray',
      //   borderRadius: '10px',
      //   boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
      // }}
    >
      <Accordion expanded={newId === track?.trackName ? !expanded : expanded}>
        <AccordionSummary
          id="panel-header-1"
          aria-controls="panel-content-1"
          expandIcon={
            <ChevronDown
              onClick={(e) => setExpanded(!expanded)}
              size={50}
              className="probabilityPerformance_arrow"
            />
          }
        >
          <div className="probability_sec text-capitalize">
            <h1>{track?.trackName}</h1>
            {!condi ? (
              <div className="probability_btnSec">
                {/* <a> */}
                {/* <button
                  onClick={ViewCertificateOnNew}
                  className="probability_btnSec-btn-1 probability_btnSec-btn"
                > */}
                {!viewLoading ? (
                  <div>
                    <button
                      onClick={ViewCertificateOnNew}
                      className="probability_btnSec-btn-1 probability_btnSec-btn"
                    >
                      VIEW CERTIFICATE
                    </button>
                    <Award
                      onClick={ViewCertificateOnNew}
                      className="probability_btnSec-icon"
                      size={20}
                      // style={{ zIndex: '100' }}
                    />
                  </div>
                ) : (
                  <Spinner text="Loading..." color="white" size="sm" />
                )}
                {/* </button> */}
                {/* <abbr
                  title="VIEW CERTIFICATE"
                  className="probability_btnSec-icon"
                > */}
                {/* <Award
                  className="probability_btnSec-icon"
                  size={20}
                  onClick={ViewCertificateOnNew}
                /> */}
                {/* </abbr> */}
                {/* </a> */}
                {/* <button
                  onClick={shareOnLinkedin}
                  className="probability_btnSec-btn-2 probability_btnSec-btn"
                > */}
                {!shareLoading ? (
                  <div
                    style={{
                      display: 'grid',
                      gridAutoFlow: 'column',
                      gap: '10px'
                    }}
                  >
                    <button
                      onClick={shareOnLinkedin}
                      className="probability_btnSec-btn-2 probability_btnSec-btn"
                    >
                      SHARE
                    </button>
                    <button
                      onClick={sharePost}
                      className="probability_btnSec-btn-2 probability_btnSec-btn"
                    >
                      SHARE 2
                    </button>
                    <Share2
                      className="probability_btnSec-icon"
                      size={20}
                      onClick={shareOnLinkedin}
                    />
                  </div>
                ) : (
                  <Spinner text="Loading..." color="white" size="sm" />
                )}

                {/* <abbr title="SHARE" className="probability_btnSec-icon"> */}

                {/* </abbr> */}
              </div>
            ) : (
              <div className="probability_btnSec">
                {/* <a
                  href={''}
                  without
                  rel="noopener noreferrer"
                  target="_blank"
                  className="text-white"
                  style={{ display: 'grid', alignItems: 'center' }}
                > */}
                <button
                  className="probability_btnSec-btn-1 probability_btnSec-btn-1-disabled probability_btnSec-btn"
                  disabled
                >
                  VIEW CERTIFICATE
                </button>
                {/* <Award
                  className="probability_btnSec-btn-2 probability_btnSec-btn-1-disabled probability_btnSec-btn"
                  size={30}
                /> */}
                <Award
                  className="probability_btnSec-icon probability_btnSec-icon-disabled"
                  size={20}
                />
                <button
                  className="probability_btnSec-btn-2 probability_btnSec-btn-2-disabled probability_btnSec-btn"
                  disabled
                >
                  SHARE
                </button>
                {/* <Linkedin
                  className="probability_btnSec-btn-2 probability_btnSec-btn-2-disabled probability_btnSec-btn"
                  size={30}
                /> */}
                <Share2
                  className="probability_btnSec-icon probability_btnSec-icon-disabled"
                  size={20}
                />
              </div>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <Probability track={track} />
          <Performance track={track} />
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default AccordionSimple
