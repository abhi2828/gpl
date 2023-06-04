import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { Link, useNavigate } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'

// ** Third Party Components
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, Controller } from 'react-hook-form'
import {
  Row,
  Col,
  Form,
  Input,
  Label,
  Button,
  CardText,
  CardTitle,
  FormFeedback,
  Spinner
} from 'reactstrap'
import '@styles/react/pages/page-authentication.scss'
import '@styles/react/pages/page-login.scss'
import { useState } from 'react'
import { useEffect } from 'react'
import { emailRegex, passwordRegex } from '@src/utility/Utils'

// ** Actions
import { handleLogin } from '@store/authentication'

// ** Utils
import { getHomeRouteForLoggedInUser } from '@utils'
import { handleLastLayout, handleLayout } from '../redux/layout'
import { getUserData, hasPermission } from '../utility/Utils'
import { ADMIN_LOGIN, IS_ADMIN, IS_USER } from '../utility/constants'

const defaultValues = {
  email: '',
  password: ''
}

const Login = () => {
  const { skin } = useSkin()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [isAdmin, setAdmin] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    control,
    setError,
    handleSubmit,
    register,
    formState: { errors }
  } = useForm({ defaultValues })

  const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  useEffect(() => {
    if (localStorage.getItem('userData')) {
      if (hasPermission(IS_ADMIN)) {
        setAdmin(true)
        navigate(getHomeRouteForLoggedInUser('admin'))
      } else {
        navigate('/dashboard')
      }
    }
  }, [])

  const onSubmit = async (data) => {
    if (Object.values(data).every((field) => field.length > 0)) {
      setLoading(true)
      const res = await useJwt
        .login({ email: data.email, password: data.password })
        .then(async (res) => {
          const data = {
            ...res.data.data,
            accessToken: res.data.data.jwtToken,
            refreshToken: res.data.data.refreshToken,
            role: res.data.data.roles,
            permissions: res.data.data.permission,
            name: res.data.data.name,
            loggedInAs: ADMIN_LOGIN
          }

          // !!!! DO NOT DELETE THIS COMMENT. THIS WILL BE UNCOMMENTED IN THE END !!!!

          // if(!data?.permissions?.includes(IS_ADMIN)){
          //   toast.error('User does not have ADMIN access. Please contact the administrator for more details.')
          //   setLoading(false)
          //   return false
          // }

          await dispatch(handleLogin(data))

          if (data.permissions?.includes(IS_ADMIN)) {
            dispatch(handleLayout('vertical'))
            dispatch(handleLastLayout('vertical'))
          } else if (data.permissions?.includes(IS_USER)) {
            dispatch(handleLayout('user'))
            dispatch(handleLastLayout('user'))
          }

          setLoading(false)

          toast.success('Login successfully')

          return true
        })
        .catch((error) => {
          setLoading(false)
          toast.error(
            error?.response?.data?.message
              ? error?.response?.data?.message
              : 'Server Error'
          )
          return false
        })

      const path = getUserData()?.permissions?.includes(IS_ADMIN)
        ? '/banner'
        : '/dashboard'
      if (res) {
        navigate(path)
      }
    }
  }

  return (
    <div className="auth-wrapper auth-cover loginPage">
      <Col
        className="d-flex align-items-center auth-bg px-2 p-lg-5"
        lg="4"
        sm="12"
      >
        <Col className=" mx-auto">
          <CardTitle tag="h2" className="fw-bold mb-1">
            <span className="title-1">Welcome to</span>{' '}
            <span className="title title-g">G</span>
            <span className="title title-p">P</span>
            <span className="title title-l">L</span>{' '}
            <span className="title">Alchemy</span>
          </CardTitle>
          <CardText className="mb-2">
            Please sign-in to your account and start the adventure
          </CardText>
          <Row tag={Form} className="p-1" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2">
              <Controller
                id="email"
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    autoFocus
                    placeholder={`Email ID`}
                    {...register('email', {
                      required: ' Please Enter Your Email Address',
                      pattern: {
                        value: emailRegex,
                        message: 'Please Enter Valid Email address'
                      }
                    })}
                    invalid={errors.email && true}
                    {...field}
                  />
                )}
              />
              {errors && errors.email && (
                <FormFeedback>{errors.email.message}</FormFeedback>
              )}
            </div>

            <div className="mb-1">
              <Controller
                id="password"
                name="password"
                {...register('password', {
                  required: 'Please Enter Your Password',
                  pattern: {
                    value: passwordRegex,
                    message: 'Please Enter Valid Password'
                  }
                })}
                control={control}
                render={({ field }) => (
                  <InputPasswordToggle
                    className="input-group-merge"
                    invalid={errors.password && true}
                    {...field}
                  />
                )}
              />
              {errors && errors.password && (
                <FormFeedback>{errors.password.message}</FormFeedback>
              )}
            </div>

            <div className="check-sec">
              {/* <div className="form-check">
                <Input type="checkbox" id="remember-me" />
                <Label className="form-check-label" for="remember-me">
                  Remember Me
                </Label>
              </div> */}
              <Link to="/forgot-password" className="auth-login-form pb-1">
                <small>Forgot Password?</small>
              </Link>
            </div>
            <Button
              className="btn1"
              type="submit"
              color="primary"
              disabled={loading}
              block
            >
              {loading ? (
                <Spinner text="Loading..." color="white" size="sm" />
              ) : (
                'Sign in'
              )}
            </Button>
          </Row>
        </Col>
      </Col>
    </div>
  )
}

export default Login
