import React from 'react'
import ChrosDesk from './chros-desk'
import '../../sass/talent-philosophy/talent-philosophy.scss'
import MyCareerAspiration from './my-career-aspiration'
import CareerTracks from './career-tracks'
import { useState } from 'react'
import HumanResource from './human-resource/HumanResource'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBannerList } from '../../../masters/talent-philosophy/store'
import { useEffect } from 'react'

const TalentPhilosophy = () => {
  return (
    <>
      <div className="talentPhilosophy">
        <ChrosDesk />
        <MyCareerAspiration />
        <CareerTracks />
      </div>
    </>
  )
}

export default TalentPhilosophy
