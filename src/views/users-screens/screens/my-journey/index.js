import React, { useEffect } from 'react'
import ProfileSection from './profileSection'
import '../../sass/talent-philosophy/talent-philosophy.scss'
import ProbabilityPerformance from './probability-performance'

const MyJourney = () => {
  return (
    <div className="talentPhilosophy">
      <ProfileSection />
      <ProbabilityPerformance />
    </div>
  )
}

export default MyJourney
