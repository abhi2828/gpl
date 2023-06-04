import { lazy } from 'react'

const Permissions = lazy(() =>
  import('../../views/roles-permission/permission')
)
const Roles = lazy(() => import('../../views/roles-permission/roles'))
const DesignationMaster = lazy(() => import('../../views/masters/designation'))
const TalentPhilosophy = lazy(() =>
  import('../../views/masters/talent-philosophy')
)
const LearningTracks = lazy(() => import('../../views/masters/learning-tracks'))
const ModulesMaster = lazy(() => import('../../views/masters/modules'))
const ProgramMaster = lazy(() => import('../../views/program-master'))
const Enroll = lazy(() => import('../../views/enroll'))
const CareerAspiration = lazy(() => import('../../views/careerAspiration'))
const BusinessUnit = lazy(() => import('../../views/businessUnitMaster'))
const Attendance = lazy(() => import('../../views/attendance'))
const FileUpload = lazy(() => import('../../views/fileUpload'))
const LevelMaster = lazy(() => import('../../views/masters/level'))
const TestimonialMaster = lazy(() => import('../../views/masters/testimonial'))
const DepartmentMaster = lazy(() => import('../../views/masters/functions'))
const City = lazy(() => import('../../views/masters/city'))
const Sponsor = lazy(() => import('../../views/masters/sponsor'))
const BannerMaster = lazy(() => import('../../views/masters/banner'))
const Trainer = lazy(() => import('../../views/masters/trainer'))
const UserMenu = lazy(() => import('../../views/masters/user'))
const TrackDetailsPage = lazy(() =>
  import('../../views/masters/learning-tracks/trackDetails/TrackDetailsPage')
)

const Admin = [
  {
    path: '/designation',
    element: <DesignationMaster />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/talent-philosophy',
    element: <TalentPhilosophy />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/learning-tracks',
    element: <LearningTracks />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/modules',
    element: <ModulesMaster />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/levels',
    element: <LevelMaster />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/banner',
    element: <BannerMaster />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/testimonials',
    element: <TestimonialMaster />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/function',
    element: <DepartmentMaster />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/roles',
    element: <Roles />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/permission',
    element: <Permissions />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/programMaster',
    element: <ProgramMaster />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/enroll',
    element: <Enroll />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/careerAspiration',
    element: <CareerAspiration />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/attendance',
    element: <Attendance />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/fileUpload',
    element: <FileUpload />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/businessUnit',
    element: <BusinessUnit />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/city',
    element: <City />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/sponsor',
    element: <Sponsor />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/trainer',
    element: <Trainer />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/user',
    element: <UserMenu />,
    meta: {
      layout: 'vertical'
    }
  },
  {
    path: '/learning-tracks-details',
    element: <TrackDetailsPage />,
    meta: {
      layout: 'vertical'
    }
  }
]

export default Admin
