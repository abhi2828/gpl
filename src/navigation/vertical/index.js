import {
  Mail,
  Home,
  UserCheck,
  DollarSign,
  Briefcase,
  Film,
  Shield,
  Circle,
  List,
  Grid,
  BarChart,
  User,
  FilePlus,
  MessageSquare
} from 'react-feather'
import { IS_ADMIN } from '../../utility/constants'

export default [
  {
    id: 'banner',
    title: 'Banner',
    icon: <Film size={20} />,
    navLink: '/banner',
    show: [IS_ADMIN]
  },
  {
    id: 'testimonialPage',
    title: 'Testimonials',
    icon: <MessageSquare size={20} />,
    navLink: '/testimonials',
    show: [IS_ADMIN]
  },
  {
    id: 'learningTracks',
    title: 'Learning Tracks',
    icon: <List size={20} />,
    navLink: '/learning-tracks',
    show: [IS_ADMIN]
  },
  {
    id: 'talentPhilosophy',
    title: 'Talent Philosophy',
    icon: <Briefcase size={20} />,
    navLink: '/talent-philosophy',
    show: [IS_ADMIN]
  },
  {
    id: 'masters',
    title: 'Masters',
    icon: <Grid size={20} />,
    show: [IS_ADMIN],
    children: [
      {
        id: 'function',
        title: 'Function',
        icon: <Circle size={12} />,
        navLink: '/function',
        show: [IS_ADMIN]
      },
      {
        id: 'designationMaster',
        title: 'Designation',
        icon: <Circle size={12} />,
        navLink: '/designation',
        show: [IS_ADMIN]
      },
      {
        id: 'levelPage',
        title: 'Levels',
        icon: <Circle size={12} />,
        navLink: '/levels',
        show: [IS_ADMIN]
      },
      {
        id: 'sponsor',
        title: 'Sponsor',
        icon: <Circle size={20} />,
        navLink: '/sponsor',
        show: [IS_ADMIN]
      },
      {
        id: 'trainer',
        title: 'Trainer',
        icon: <Circle size={20} />,
        navLink: '/trainer',
        show: [IS_ADMIN]
      }
    ]
  },
  {
    id: 'roles-permissions',
    title: 'Roles & Permissions',
    icon: <Shield size={20} />,
    show: [IS_ADMIN],
    children: [
      {
        id: 'roles',
        title: 'Roles',
        icon: <Circle size={12} />,
        show: [IS_ADMIN],
        navLink: '/roles'
      },
      {
        id: 'permissions',
        title: 'Permissions',
        icon: <Circle size={12} />,
        show: [IS_ADMIN],
        navLink: '/permission'
      },
      {
        id: 'Modules',
        title: 'Modules',
        icon: <Circle size={20} />,
        navLink: '/modules',
        show: [IS_ADMIN]
      }
    ]
  },
  {
    id: 'attendance',
    title: 'Attendance',
    icon: <Mail size={20} />,
    navLink: '/attendance',
    show: [IS_ADMIN]
  },
  {
    id: 'fileUpload',
    title: 'File Upload',
    icon: <FilePlus size={20} />,
    navLink: '/fileUpload',
    show: [IS_ADMIN]
  },
  {
    id: 'enroll',
    title: 'Enroll',
    icon: <UserCheck size={20} />,
    navLink: '/enroll',
    show: [IS_ADMIN]
  },
  {
    id: 'careerAspiration',
    title: 'Career Aspiration',
    icon: <UserCheck size={20} />,
    navLink: '/careerAspiration',
    show: [IS_ADMIN]
  },
  {
    id: 'user',
    title: 'User',
    icon: <User size={20} />,
    navLink: '/user',
    show: [IS_ADMIN]
  }
]
