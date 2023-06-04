// ** React Imports
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AbilityContext } from '@src/utility/context/Can'
import { useContext, useState } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  Spinner
} from 'reactstrap'

// ** Utils
import { isUserLoggedIn } from '@utils'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'

import InputPasswordToggle from '@components/input-password-toggle'

// ** Icons Imports
// import logo from '@src/assets/images/logo/NTTS-r.png'
import Avatar from '@components/avatar'
import { Check } from 'react-feather'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { passwordRegex } from '../utility/Utils'
import { useEffect } from 'react'

const Onboard = () => {
  // ** Hooks
  const { skin } = useSkin()

  const defaultValues = {
    uuid: '',
    password: '',
    confirmPassword: ''
  }
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const location = useLocation()
  const [code, setCode] = useState('')

  useEffect(() => {
    const code = location?.search?.split('?token=')
    setCode(code[1])
  }, [])

  const {
    control,
    setError,
    getValues,
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })

  const illustration =
      skin === 'dark' ? 'reset-password-v2-dark.svg' : 'reset-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = (data) => {
    if (Object.keys(errors).length != 0) {
      return
    }

    setLoading(true)
    useJwt
      .onBoard({
        password: getValues('password'),
        confirmPassword: getValues('confirmPassword'),
        uuid: code
      })
      .then((res) => {
        navigate('/login')
        setLoading(false)
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>Onboarding successful</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <strong>Please Login with Password</strong>
                </li>
              </ul>
            </div>
          </div>
        )
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err?.response?.data?.message)
      })
  }

  if (!isUserLoggedIn()) {
    return (
      <div className="auth-wrapper auth-cover">
        <Row>
          <Link
            className="brand-logo"
            to="/"
            onClick={(e) => e.preventDefault()}
          >
            {/* <img className="fallback-logo" src={logo} alt="logo" height="40" /> */}
          </Link>
          {/* <Col
            className="d-none d-lg-flex align-items-center p-5"
            lg="8"
            sm="12"
          >
            <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
              <img className="img-fluid" src={source} alt="Login Cover" />
            </div>
          </Col> */}
          <Col
            className=" align-items-center auth-bg px-2 p-lg-5"
            lg="4"
            sm="12"
          >
            <Col lg="12">
              <CardTitle tag="h2" className="fw-bolder mb-1">
                Welcome to GPL! 👋
              </CardTitle>
              <Form className="mt-2" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="login-password">
                      Password
                    </Label>
                  </div>
                  <Controller
                    id="password"
                    name="password"
                    {...register('password', {
                      required: 'Please enter Password',
                      pattern: {
                        value: passwordRegex,
                        message:
                          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
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

                <div className="mb-1">
                  <div className="d-flex justify-content-between">
                    <Label className="form-label" for="confirmPassword">
                      Confirm Password
                    </Label>
                  </div>
                  <Controller
                    id="confirmPassword"
                    name="confirmPassword"
                    {...register('confirmPassword', {
                      required: 'Please enter Password',
                      pattern: {
                        value: passwordRegex,
                        message:
                          'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
                      },
                      validate: (value) => {
                        if (watch('password') != value) {
                          return 'Your passwords do no match'
                        }
                      }
                    })}
                    control={control}
                    render={({ field }) => (
                      <InputPasswordToggle
                        className="input-group-merge"
                        invalid={errors.confirmPassword && true}
                        {...field}
                      />
                    )}
                  />
                  {errors && errors.confirmPassword && (
                    <FormFeedback>
                      {errors.confirmPassword.message}
                    </FormFeedback>
                  )}
                </div>
                <Button color="primary" disabled={loading} block>
                  {loading ? (
                    <Spinner text="Loading..." color="white" size="sm" />
                  ) : (
                    'Submit'
                  )}
                </Button>
              </Form>
            </Col>
          </Col>
        </Row>
      </div>
    )
  } else {
    return <Navigate to="/" />
  }
}

export default Onboard
