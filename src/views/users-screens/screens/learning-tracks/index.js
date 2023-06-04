import React, { useState, useEffect } from 'react'
import { Button, Col, div, Row } from 'reactstrap'
import DetailCard from '../../components/card-detail'
import '../../sass/learning-track/learning-track.scss'
import Card from 'react-bootstrap/Card'
import Form from './Form'
import ImageCard from '../../components/imageCard/ImageCard'
import Banner from '../home/banner'
import { XCircle } from 'react-feather'
import { debounce } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchLearningtrackDropdown,
  fetchLearningList,
  setLoader,
  setPageNo,
  setSearch
} from '../../../masters/learning-tracks/store'

const LearningTracks = () => {
  const [show, setShow] = useState(false)
  const [trackName, setTrackName] = useState()
  const [cardList, setCardList] = useState([])
  const [all, setAll] = useState(false)

  let result = []
  const dispatch = useDispatch()

  const { loader, params, learningList } = useSelector(
    (state) => state.learningTrack
  )
  const { pageNo, pageSize, search } = params

  let index = 9

  // const handleExploreAll = () => {
  //   setAll(!all)
  //   dispatch(fetchLearningList())
  // }
  const handleExploreAll = () => {
    setAll(!all)
    dispatch(setPageNo(1))
    dispatch(setLoader(true))
    dispatch(
      fetchLearningList({
        search: search,
        pageSize: all ? pageSize : ''
      })
    )
  }

  const test = (card) => {
    setTrackName(card)
  }

  const handleClearSearch = () => {
    dispatch(setSearch(''))
    dispatch(setLoader(true))
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      // dispatch(setLoader(true))
      dispatch(
        fetchLearningList({
          search: search,
          pageSize: all ? '' : 10
        })
      )
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [search, all])

  useEffect(() => {
    search.length && handleClearSearch()
  }, [])

  return (
    <>
      <div className="learning_track">
        <div className="LT_search_header">
          <div>
            <p id="learning_track_id"> Learning Tracks</p>
          </div>
          <div>
            <div className="search_input_wrapper">
              <input
                type="text"
                placeholder="Search Learning Track"
                value={search}
                onChange={(temp) => {
                  dispatch(setSearch(temp.target.value))
                  dispatch(setLoader(true))
                }}
              />
              {search.length !== 0 ? (
                <span onClick={handleClearSearch}>
                  <XCircle size={18} />
                </span>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="learning_track_img">
        <Row xs={1} md={2} xl={3} className="learning_track_myCard">
          {loader ? (
            <p className="text-center w-100 text-light">Loading...</p>
          ) : learningList && learningList.length === 0 ? (
            <p className="text-center w-100 text-light">
              There are no Learning Tracks to display
            </p>
          ) : (
            learningList?.map(
              (card, i) =>
                card?.isVisible && (
                  <ImageCard
                    i={i}
                    card={card}
                    setShow={setShow}
                    test={test}
                    key={card?.id}
                  />
                )
            )
          )}
        </Row>
      </div>
      {learningList &&
        (learningList?.filter((e) => e?.isVisible)).length > 9 &&
        search.length === 0 &&
        !loader && (
          <div className="learnig_track_bottom d-flex justify-content-center">
            <button
              className="explore_all"
              onClick={!loader && handleExploreAll}
            >
              {loader ? 'loading' : `${all ? 'Explore less' : 'Explore All'}`}
            </button>
          </div>
        )}

      {show && (
        <Form show={show} setShow={setShow} trackName={trackName} all={all} />
      )}
    </>
  )
}

export default LearningTracks

export const MySpinner = () => {
  return (
    <div className="wrapper_spinner">
      <span className="spinner spinner--quarter"></span>
    </div>
  )
}
