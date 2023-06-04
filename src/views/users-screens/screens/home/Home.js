import React from 'react'
import Banner from './banner'
import '../../sass/home/Home.scss'
import RecentExecutedTrack from './recent-executed-tracks'
import Testimonials from './testimonials'
import UpcomingLearningTrack from './upcoming-learning-track'
import ProfileForm from '../../components/form-profile'
import Inhouse from './inhouse'

const Home = () => {
  return (
    <div className="home">
      <Banner />
      <Inhouse />
      <Testimonials />
      <UpcomingLearningTrack />
      <RecentExecutedTrack />
    </div>
  )
}

export default Home
