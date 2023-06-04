// ** React Imports
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { validate } from '../redux/authentication'
import SpinnerComponent from '../@core/components/spinner/Fallback-spinner'

const SSORedirect = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(async () => {
    // async const validate

    const code = location?.search?.split('?id=')
    if (code && code[1]) {
      const response = await dispatch(validate({ code: code[1] }))
      if (!response?.payload) {
        toast.error('User authentication failed.')
        window.location.replace('/login')
      }
      window.location.replace('/dashboard')
    }
    navigate('/login')
  }, [])

  if (!isUserLoggedIn()) {
    return <SpinnerComponent />
  } else {
    return <Navigate to="/dashboard" />
  }
}

export default SSORedirect
