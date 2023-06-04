import React from 'react'
import { ArrowRightCircle } from 'react-feather'
import '../../sass/card-upcoming.scss'
import Spinner from '@components/spinner/Loading-spinner'
import { generatePath, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {
  fetchLearningListById,
  selectLearningTrack
} from '../../../masters/learning-tracks/store'
import view_all_arrow from '../../../../assets/images/customIcon/view_all_arrow.svg'

const UpcomingCard = ({ card, loader }) => {
  const dispatch = useDispatch()

  let navigate = useNavigate()
  const routeChange = () => {
    let { id } = card
    let myStatus = card.enrollStatus
    const data = {
      status: myStatus
    }
    // dispatch(fetchLearningListById(id))
    let path = `/user-learning-tracks/details/${id}`
    navigate(path, { state: data })
  }
  return (
    <div className="programCard" onClick={routeChange}>
      {loader ? (
        <Spinner />
      ) : (
        <div className="programCard_sec1">
          <img
            className="programCard_sec1-img"
            src={card?.imageUrl}
            alt="cardImage"
          />
        </div>
      )}
      {loader ? (
        <Spinner />
      ) : (
        <div className="programCard_sec2">
          <div className="programCard_sec2-detail">
            <h5>{card?.name}</h5>
            <p>
              {card?.description?.split('').length > 70 ? (
                <>
                  {`${card?.description.substring(0, 70)}...`}
                  <span
                    style={{ color: '#0077b9', zIndex: '100' }}
                    onClick={routeChange}
                  >
                    See More
                  </span>
                </>
              ) : (
                card?.description
              )}
            </p>
          </div>
          {/* <ArrowRightCircle
            className="upcomingCard_sec2-arrow"
            size={24}
            onClick={routeChange}
          /> */}
          <div className="view_details" onClick={routeChange}>
            <img
              src={view_all_arrow}
              className="upcomingCard_sec2-arrow"
              alt=""
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default UpcomingCard
