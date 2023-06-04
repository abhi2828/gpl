import { Mail, Home, UserCheck, Briefcase } from 'react-feather'

export default [
  {
    id: 'designationMaster',
    title: 'Designation',
    icon: <Mail size={20} />,
    navLink: '/designation'
  },
  {
    id: 'talentPhilosophy',
    title: 'Talent Philosophy',
    icon: <Briefcase size={20} />,
    navLink: '/talent-philosophy'
    //show: [IS_ADMIN, IS_MENTOR]
  },
  {
    id: 'learningTracks',
    title: 'Learning Tracks',
    icon: <Mail size={20} />,
    navLink: '/learning-tracks'
  },
  {
    id: 'levelPage',
    title: 'Level ',
    icon: <Mail size={20} />,
    navLink: '/levels'
  },
  {
    id: 'testimonialsPage',
    title: 'Testimonials',
    icon: <Mail size={20} />,
    navLink: '/testimonialspage'
  },
  // {
  //   id: 'Modules',
  //   title: 'Modules',
  //   icon: <Mail size={20} />,
  //   navLink: '/modules'
  // },
  {
    id: 'function',
    title: 'Function',
    icon: <Mail size={20} />,
    navLink: '/function'
  },
  {
    id: 'businessUnit',
    title: 'BusinessUnit',
    icon: <Mail size={20} />,
    navLink: '/businessUnit'
  },
  {
    id: 'enroll',
    title: 'Enroll',
    icon: <UserCheck size={20} />,
    navLink: '/enroll'
  },
  {
    id: 'careerAspiration',
    title: 'Career Aspiration',
    icon: <UserCheck size={20} />,
    navLink: '/enroll'
  }
]
