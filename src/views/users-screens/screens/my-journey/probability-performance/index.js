import React, { useEffect } from 'react'
import Performance from './performance'
import Probability from './probability'
import '../../../sass/my-journey/probability-performance.scss'
import AccordionSimple from './accordian'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserEnroll } from '../store'
import Spinner from '@components/spinner/Loading-spinner'

const ProbabilityPerformance = () => {
  const { userEnroll, loader } = useSelector((state) => state?.myJourney)
  const { userData } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUserEnroll({ userId: userData.id }))
  }, [])
  return (
    <div className="probabilityPerformance">
      <h1>My Learning Tracks</h1>
      {loader ? (
        <div
          style={{
            display: 'grid',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#9b034a',
            width: '100%',
            marginBottom: '0'
          }}
        >
          {' '}
          <Spinner />
        </div>
      ) : userEnroll === undefined || userEnroll?.length === 0 ? (
        <h3
          style={{
            display: 'grid',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#9b034a',
            width: '100%',
            marginBottom: '0'
          }}
        >
          No data found !
        </h3>
      ) : (
        userEnroll?.map((track) => {
          return <AccordionSimple track={track} userEnroll={userEnroll} />
        })
      )}
    </div>
  )
}

export default ProbabilityPerformance
