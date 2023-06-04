import React, { useEffect, useState } from 'react'
import '../../../sass/talent-philosophy/chros-desk.scss'
import { useSelector, useDispatch } from 'react-redux'
import { fetchChroList } from '../../../../masters/talent-philosophy/store'
import { set } from 'react-hook-form'
import Spinner from '@components/spinner/Loading-spinner'
import godrej from '../../../../../assets/images/userScreen/godrej.png'
import { Col } from 'reactstrap'

const ChrosDesk = () => {
  const { chroList, loader } = useSelector((state) => state.talentPhilosophy)
  const dispatch = useDispatch()
  const [chro, setChro] = useState('')
  const [width, setWidth] = useState(window.innerWidth)
  const isMobile = width <= 600

  function handleWindowSizeChange() {
    setWidth(window.innerWidth)
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange)
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
  }, [])

  useEffect(() => {
    dispatch(fetchChroList())
  }, [])
  return (
    <div className="chrosDesk">
      <h2>From the CHRO’S Desk</h2>
      {loader ? (
        <div
          style={{
            width: '100%',
            display: 'grid',
            justifyContent: 'center'
          }}
        >
          <Spinner />
        </div>
      ) : chroList === undefined || chroList?.length === 0 ? (
        <h3
          style={{
            width: '100%',
            display: 'grid',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#9b034a'
          }}
        >
          "No Data Found!"
        </h3>
      ) : (
        chroList?.map((data) => {
          return (
            <div className="chro1" key={data?.id}>
              <div className="chrosDesk_sec11">
                <img
                  className="chrosDesk_sec11-img1"
                  src={data?.imageUrl}
                  alt="godrej"
                />
                <p className="chro_para1">
                  <strong>{data?.name}</strong>
                </p>
              </div>

              <div className="chromsg">
                <p
                  className={`${data?.chroMessage?.length < 300 && 'chromsg1'}`}
                >
                  {data?.chroMessage}
                </p>
                <div className="footerChro">
                  <strong> -CHRO at Godrej Properties(GPL)</strong>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default ChrosDesk
