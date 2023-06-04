import React, { useState } from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button, Col, Row } from 'reactstrap'
import { fetchLearningList } from '../../../../masters/learning-tracks/store'
import { CommonHeader_Gallary } from '../../../components/common-header/CommonHeader'
import { GallaryCard } from './RecentExecutedTrack'

const RecentExecutedTrackGallary = () => {
  const [contentType, setContentType] = useState(true)
  const { loader, learningList } = useSelector((state) => state.learningTrack)

  let filter_learningList = learningList?.filter(
    (word) =>
      word.status === 'LAUNCHED' &&
      word?.isVisible &&
      word?.trackStatus !== 'COMPLETE'
  )

  const dispatch = useDispatch()
  const handleContentType = (type) => {
    setContentType(type === 'video' ? false : true)
  }
  useEffect(() => {
    dispatch(fetchLearningList())
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])
  return (
    <>
      <CommonHeader_Gallary
        name={'Tracks Gallery'}
        path={'/dashboard/recent-executed-track'}
      />
      <div className="learning_middle_sec1 gallary_padding header_wraper d-flex justify-content-center text-center px-3 pb-1">
        <Button
          className={`${!contentType ? 'video mx-1' : 'Photos mx-1'}`}
          onClick={() => handleContentType('video')}
        >
          Videos
        </Button>
        <Button
          className={`${contentType ? 'video mx-1' : 'Photos mx-1'}`}
          onClick={handleContentType}
        >
          Photos
        </Button>
      </div>
      {/* <div className="extraarea"></div> */}
      {contentType ? (
        <GallaryCard data={filter_learningList} />
      ) : (
        <h2 className="text-center p-2 text-capitalize">no video to show</h2>
      )}
    </>
  )
}

export default RecentExecutedTrackGallary
