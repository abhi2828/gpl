import React from 'react'
import { Button, Card } from 'reactstrap'
import '../../../sass/talent-philosophy/career-tracks.scss'
import { fetchCareerTracksList } from '../../../../masters/talent-philosophy/store'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import Spinner from '@components/spinner/Loading-spinner'

const CareerTracks = () => {
  const { careerTracksList, loader } = useSelector(
    (state) => state.talentPhilosophy
  )

  const dispatch = useDispatch()
  const [all, setAll] = useState(false)

  let navigate = useNavigate()
  const routeChange = (e, file, name) => {
    e.preventDefault()
    const data = {
      file: file,
      name: name
    }
    let path = `user-talent-philosophy/detail`
    // navigate(path, { state: data })
    window.localStorage.setItem('career-track', JSON.stringify(data))
    window.open(path, '_blank')
  }

  let myArray = careerTracksList?.slice(0, 5)

  const handleExploreAll = () => {
    setAll(true)
  }

  const handleExploreLess = () => {
    setAll(false)
  }

  useEffect(() => {
    dispatch(fetchCareerTracksList())
  }, [])
  return (
    <div className="careerTracks">
      <h2>Career Tracks</h2>
      <div className="careerTracks_div">
        {loader ? (
          <Spinner />
        ) : careerTracksList === undefined || careerTracksList?.length === 0 ? (
          <h3
            style={{
              display: 'grid',
              justifyContent: 'center',
              textAlign: 'center',
              color: '#9b034a'
            }}
          >
            "No Data Found!"
          </h3>
        ) : all ? (
          careerTracksList?.map(({ imageUrl, id, name, file }) => {
            return (
              <Card
                className="careerTracks_div-card"
                key={id}
                onClick={(e) => routeChange(e, file, name)}
              >
                <>
                  <img
                    className="careerTracks_div-card-img"
                    src={imageUrl}
                    alt="img"
                  />
                  <h5>{name}</h5>
                </>
              </Card>
            )
          })
        ) : (
          myArray?.map(({ imageUrl, id, name, file }) => {
            return (
              <Card
                className="careerTracks_div-card"
                key={id}
                onClick={(e) => routeChange(e, file, name)}
              >
                <>
                  <img
                    className="careerTracks_div-card-img"
                    src={imageUrl}
                    alt="img"
                  />
                  <h5>{name}</h5>
                </>
              </Card>
            )
          })
        )}
      </div>
      {!careerTracksList ? (
        ''
      ) : !all ? (
        <button className="careerTracks_btn" onClick={handleExploreAll}>
          EXPLORE ALL
        </button>
      ) : (
        <button className="careerTracks_btn" onClick={handleExploreLess}>
          EXPLORE LESS
        </button>
      )}
    </div>
  )
}

export default CareerTracks
