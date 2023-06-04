import React, { Suspense } from 'react'
import Spinner from '@components/spinner/Loading-spinner'
import './index.css'

// ** Router Import
import Router from './router/Router'
import { isUserLoggedIn } from './utility/Utils'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPermissions } from './redux/authentication'
import { useEffect } from 'react'
import { handleLastLayout, handleLayout } from './redux/layout'
import { ADMIN_LOGIN, IS_ADMIN, IS_USER, SSO_LOGIN } from './utility/constants'
import { useNavigate } from 'react-router-dom'
import User from './router/routes/User'
import Admin from './router/routes/Admin'
import { getUserData } from './utility/Utils'

const App = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { permissions } = useSelector((state) => state.auth)
  const userPath = User.map((item) => item.path)
  const adminPath = Admin.map((item) => item.path)
  const pathname = window.location.pathname

  const setAdminLayoutAndRedirect = () => {
    dispatch(handleLayout('vertical'))
    dispatch(handleLastLayout('vertical'))
    if (!adminPath.includes(pathname)) navigate('/banner')
  }

  const setUserLayoutAndRedirect = () => {
    dispatch(handleLayout('user'))
    dispatch(handleLastLayout('user'))
    if (!userPath.includes(pathname)) navigate('/dashboard')
  }

  useEffect(() => {
    if (isUserLoggedIn()) {
      dispatch(fetchPermissions())
      if (permissions) {
        if (permissions?.includes(IS_ADMIN) && permissions?.includes(IS_USER)) {
          const data = getUserData()
          if (data.loggedInAs === ADMIN_LOGIN) {
            setAdminLayoutAndRedirect()
          } else if (data.loggedInAs === SSO_LOGIN) {
            setUserLayoutAndRedirect()
          } else {
            localStorage.clear()
            navigate('/login')
          }
        } else if (permissions?.includes(IS_ADMIN)) {
          setAdminLayoutAndRedirect()
        } else if (permissions?.includes(IS_USER)) {
          setUserLayoutAndRedirect()
        }
      }
    } else {
      localStorage.clear()
      const publicRoutes = [
        '/onboard',
        '/admin-login',
        '/sso-redirect',
        '/forgot-password',
        '/redirect'
      ]
      if (!publicRoutes.includes(window.location.pathname)) navigate('/login')
    }
  }, [permissions?.length])

  return (
    <Suspense fallback={<Spinner />}>
      <Router />
    </Suspense>
  )
}

export default App
