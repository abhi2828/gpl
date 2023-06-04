// ** React Imports
import { Fragment, lazy } from 'react'
import { Navigate, Route, useNavigate } from 'react-router-dom'
// ** Layouts
import BlankLayout from '@layouts/BlankLayout'
import VerticalLayout from '@src/layouts/VerticalLayout'
import HorizontalLayout from '@src/layouts/HorizontalLayout'
import UserLayout from '@src/layouts/UserLayout'
import LayoutWrapper from '@src/@core/layouts/components/layout-wrapper'

// ** Route Components
import PublicRoute from '@components/routes/PublicRoute'

// ** Utils
import { isObjEmpty } from '@utils'
// import LevelMaster from '../../views/masters/level'
// import TestimonialMaster from '../../views/masters/testimonial/Table'
// import DepartmentMaster from '../../views/masters/department/Table'
// import City from '../../views/masters/city'
// import Sponsor from '../../views/masters/sponsor'
// import BannerMaster from '../../views/masters/banner/Table'

import User from './User'
import { useEffect } from 'react'
import { getUserData } from '../../utility/Utils'
import { IS_ADMIN } from '../../utility/constants'
import { Redirect, Response } from '../../views/Redirect'
import SSORedirect from '../../views/SSORedirect'
import Admin from './Admin'

const getLayout = {
  blank: <BlankLayout />,
  vertical: <VerticalLayout />,
  horizontal: <HorizontalLayout />,
  user: <UserLayout />
}

// ** Document title
const TemplateTitle = '%s - GPL React Admin Template'

const Login = lazy(() => import('../../views/Login'))
const Register = lazy(() => import('../../views/Register'))
const ForgotPassword = lazy(() => import('../../views/ForgotPassword'))
const Error = lazy(() => import('../../views/Error'))
const Onboard = lazy(() => import('../../views/Onboard'))

// ** Default Route
// const DefaultRoute = '/dashboard'
const DefaultRoute = JSON.parse(
  localStorage.getItem('userData')
)?.permissions?.includes(IS_ADMIN)
  ? '/banner'
  : '/dashboard'

// ** Merge Routes
const Routes = [
  // {
  //   path: '/',
  //   index: true,
  //   element: <Navigate replace to={<BaseComponent />} />
  // },
  ...Admin,
  {
    path: '/onboard',
    element: <Onboard />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/sso-redirect',
    element: <SSORedirect />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/login',
    element: <Login />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/admin-login',
    element: <Login />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/redirect',
    element: <Redirect />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/response',
    element: <Response />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/register',
    element: <Register />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
    meta: {
      layout: 'blank'
    }
  },
  {
    path: '/error',
    element: <Error />,
    meta: {
      layout: 'blank'
    }
  },
  ...User
]
const getRouteMeta = (route) => {
  if (isObjEmpty(route.element.props)) {
    if (route.meta) {
      return { routeMeta: route.meta }
    } else {
      return {}
    }
  }
}

// ** Return Filtered Array of Routes & Paths
const MergeLayoutRoutes = (layout, defaultLayout) => {
  const LayoutRoutes = []

  if (Routes) {
    Routes.filter((route) => {
      let isBlank = false
      // ** Checks if Route layout or Default layout matches current layout
      if (
        (route.meta && route.meta.layout && route.meta.layout === layout) ||
        ((route.meta === undefined || route.meta.layout === undefined) &&
          defaultLayout === layout)
      ) {
        const RouteTag = PublicRoute

        // ** Check for public or private route
        if (route.meta) {
          route.meta.layout === 'blank' ? (isBlank = true) : (isBlank = false)
        }
        if (route.element) {
          const Wrapper =
            // eslint-disable-next-line multiline-ternary
            isObjEmpty(route.element.props) && isBlank === false
              ? // eslint-disable-next-line multiline-ternary
                LayoutWrapper
              : Fragment

          route.element = (
            <Wrapper {...(isBlank === false ? getRouteMeta(route) : {})}>
              <RouteTag route={route}>{route.element}</RouteTag>
            </Wrapper>
          )
        }

        // Push route to LayoutRoutes
        LayoutRoutes.push(route)
      }
      return LayoutRoutes
    })
  }
  return LayoutRoutes
}

const getRoutes = (layout) => {
  const defaultLayout = layout || 'user'
  // const layouts = ['vertical', 'horizontal', 'blank', 'user']
  const layouts = [layout, 'blank']

  const AllRoutes = []

  layouts.forEach((layoutItem) => {
    const LayoutRoutes = MergeLayoutRoutes(layoutItem, defaultLayout)

    AllRoutes.push({
      path: '/',
      element: getLayout[layoutItem] || getLayout[defaultLayout],
      children: LayoutRoutes
    })
  })

  return AllRoutes
}

export { DefaultRoute, TemplateTitle, Routes, getRoutes }
