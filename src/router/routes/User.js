import { lazy } from 'react'

const Home = lazy(() => import('../../views/users-screens/screens/home/Home'))
const MyJoureny = lazy(() =>
  import('../../views/users-screens/screens/my-journey/index')
)
const UserLearningTracks = lazy(() =>
  import('../../views/users-screens/screens/learning-tracks/index')
)
const LearningInfo = lazy(() =>
  import('../../views/users-screens/screens/learning-tracks/LearningInfo')
)

const TalentPhilosophy = lazy(() =>
  import('../../views/users-screens/screens/talent-philosophy/index')
)
const HumanResource = lazy(() =>
  import(
    '../../views/users-screens/screens/talent-philosophy/human-resource/HumanResource'
  )
)
const RecentExecutedTrack = lazy(() =>
  import(
    '../../views/users-screens/screens/home/recent-executed-tracks/RecentExecutedTrack'
  )
)
const RecentExecutedTrackGallary = lazy(() =>
  import(
    '../../views/users-screens/screens/home/recent-executed-tracks/RecentExecutedTrackGallary'
  )
)
const AllTestimonials = lazy(() =>
  import('../../views/users-screens/screens/home/testimonials/AllTestimonials')
)
const UpcomingViewAll = lazy(() =>
  import(
    '../../views/users-screens/screens/home/upcoming-learning-track/UpcomingViewAll'
  )
)

const User = [
  {
    path: '/dashboard',
    element: <Home />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/my-journey',
    element: <MyJoureny />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/user-learning-tracks',
    element: <UserLearningTracks />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/user-learning-tracks/details/:id',
    element: <LearningInfo />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/user-talent-philosophy',
    element: <TalentPhilosophy />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/user-talent-philosophy/detail',
    element: <HumanResource />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/dashboard/all-testimonials',
    element: <AllTestimonials />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/dashboard/recent-executed-track',
    element: <RecentExecutedTrack />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/dashboard/recent-executed-track/details',
    element: <RecentExecutedTrackGallary />,
    meta: {
      layout: 'user'
    }
  },
  {
    path: '/dashboard/view-all',
    element: <UpcomingViewAll />,
    meta: {
      layout: 'user'
    }
  }
]

export default User
