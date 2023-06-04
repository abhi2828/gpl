import React from 'react'
import { ArrowRightCircle } from 'react-feather'
import '../../sass/card-program.scss'
import Spinner from '@components/spinner/Loading-spinner'
import { useNavigate } from 'react-router-dom'
import view_all_arrow from '../../../../assets/images/customIcon/view_all_arrow.svg'

const ProgramCard = ({ card, loader, parent }) => {
  let navigate = useNavigate()
  const routeChange = () => {
    // let { id } = card
    // dispatch(fetchLearningListById(id))
    // let path =
    //   parent === 'upcomming'
    //     ? `/user-learning-tracks/details/${id}`
    //     : '/dashboard/recent-executed-track/details'
    let path = '/my-journey'
    navigate(path, { state: { id: card?.trackName } })
  }

  return (
    <div className="programCard" onClick={routeChange}>
      {loader ? <Spinner /> : <ImageCard imageUrl={card.imageUrl} />}
      {loader ? (
        <Spinner />
      ) : (
        <div className="programCard_sec2">
          <div className="programCard_sec2-detail">
            <h5>{card?.trackName}</h5>

            <p>
              {card?.description?.split('').length > 80 ? (
                <>
                  {`${card?.description.substring(0, 80)}...`}
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

export default ProgramCard

const ImageCard = ({ imageUrl }) => {
  return (
    <>
      <div className="programCard_sec1">
        <img className="programCard_sec1-img" src={imageUrl} alt="CardImage" />
      </div>
    </>
  )
}
