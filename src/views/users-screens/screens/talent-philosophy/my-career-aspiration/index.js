import React, { useEffect, useState, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { editCareerAspiration, fetchCareerAspiration, setLoader } from './store'

import '../../../sass/talent-philosophy/my-career-aspiration.scss'
import {
  fetchPermissions,
  setUserData
} from '../../../../../redux/authentication'

const MyCareerAspiration = () => {
  const { careerAspiration, loader } = useSelector(
    (state) => state.careerAspiration
  )

  const item = JSON.parse(localStorage.getItem('userData'))
  const { userData } = useSelector((state) => state.auth)
  const [val, setVal] = useState(
    item.careerAspiration ? item.careerAspiration : ''
  )
  const [condi, setCondi] = useState(false)
  const dispatch = useDispatch()

  const handleChange = (e) => {
    setVal(e.target.value)
    setCondi(false)
  }

  const onSubmit = async () => {
    if (!userData.updateCareerAspiration) {
      return
    }
    if (val === '') {
      setCondi(true)
    } else {
      await dispatch(setLoader(true))
      await dispatch(
        editCareerAspiration({
          id: userData?.id,
          careerAspiration: val
        })
      )
      // await dispatch(setUserData(val))
      // setVal('')
    }
  }

  useEffect(() => {
    // dispatch(fetchCareerAspiration())
  }, [])

  const disabled = userData.updateCareerAspiration

  return (
    <div className="myCareerAspiration">
      <h2> My Career Aspiration</h2>
      <textarea
        className="myCareerAspiration_input"
        placeholder="Please write your text here..."
        maxLength="1000"
        minLength="100"
        rows={8}
        disabled={!disabled}
        value={val}
        onChange={handleChange}
      ></textarea>
      {condi && <p style={{ color: 'orangered' }}>Please write text</p>}

      {disabled && (
        <input
          onClick={onSubmit}
          className="myCareerAspiration_submit"
          disabled={!disabled}
          type="button"
          value="SUBMIT"
        />
      )}
    </div>
  )
}

export default MyCareerAspiration
