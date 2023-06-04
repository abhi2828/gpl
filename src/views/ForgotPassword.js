// ** React Imports
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AbilityContext } from '@src/utility/context/Can'
import { useContext, useState } from 'react'

// ** Reactstrap Imports
import {
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
  Spinner
} from 'reactstrap'

// ** Utils
import { isUserLoggedIn } from '@utils'
import OtpInput from 'react-otp-input'
// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'
import useJwt from '@src/auth/jwt/useJwt'
import { handleLogin } from '@store/authentication'

import InputPasswordToggle from '@components/input-password-toggle'

// ** Icons Imports
import { ChevronLeft } from 'react-feather'
// import logo from '@src/assets/images/logo/NTTS-r.png'
import Avatar from '@components/avatar'
import { Check } from 'react-feather'

// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useAutoFocus } from '../utility/hooks/useAutoFocus'
import { emailRegex, passwordRegex } from '../utility/Utils'

const ForgotPassword = () => {
  // ** Hooks
  const { skin } = useSkin()

  const defaultValues = {
    email: ''
  }
  const ability = useContext(AbilityContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputIndex, setInputIndex] = useState(0)
  const [otpValues, setOtpValues] = useState('')

  const {
    control,
    setError,
    getValues,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({ defaultValues })
  const illustration =
      skin === 'dark'
        ? 'forgot-password-v2-dark.svg'
        : 'forgot-password-v2.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default

  const onSubmit = (data) => {
    setLoading(true)
    useJwt
      .forgotPassword({ email: data.email })
      .then((res) => {
        setShow(true)
        setLoading(false)
        toast(
          <div className="d-flex">
            <div className="me-1">
              <Avatar size="sm" color="success" icon={<Check size={12} />} />
            </div>
            <div className="d-flex flex-column">
              <h6>OTP SENT!</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <strong>Please Check Inbox</strong>
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

  const handleChange = (e) => {
    // const { value, name } = e.target
    setOtpValues(e)
  }

  const confirmPasswordOTP = (data) => {
    if (Object.keys(errors).length != 0) {
      return
    }

    setLoading(true)
    useJwt
      .forgotPasswordConfirm({
        email: getValues('email'),
        otp: otpValues,
        password: getValues('password')
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
              <h6>Password Changed Successfully</h6>
              <ul className="list-unstyled mb-0">
                <li>
                  <strong>Please Login with New Password</strong>
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
            className="d-none  align-items-center p-5"
            lg="8"
            sm="12"
          >
            <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
              <img className="img-fluid" src={source} alt="Login Cover" />
            </div>
          </Col> */}
          <Col
            className="d-flex align-items-center auth-bg px-2 p-lg-5"
            // lg="4"
            // sm="12"
          >
            {!show ? (
              <>
                <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
                  <CardTitle tag="h2" className="fw-bold mb-1">
                    Forgot Password? 🔒
                  </CardTitle>
                  <CardText className="mb-2">
                    Enter your email and we'll send you OTP to reset your
                    password
                  </CardText>
                  <Form
                    className="auth-forgot-password-form mt-2"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="mb-1">
                      <Label className="form-label" for="email">
                        Email
                      </Label>
                      <Controller
                        id="email"
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <Input
                            autoFocus
                            // type="email"
                            {...register('email', {
                              required: ' Please Enter Your Email Id',
                              pattern: {
                                value: emailRegex,
                                message: 'Please Enter Valid Email Id'
                              }
                            })}
                            placeholder="john@example.com"
                            invalid={errors.email && true}
                            {...field}
                          />
                        )}
                      />
                      {errors && errors.email && (
                        <FormFeedback>{errors.email.message}</FormFeedback>
                      )}
                    </div>
                    <Button color="primary" disabled={loading} block>
                      {loading ? (
                        <Spinner text="Loading..." color="white" size="sm" />
                      ) : (
                        'Send OTP'
                      )}
                    </Button>
                  </Form>
                  <p className="text-center mt-2">
                    <Link to="/login">
                      <ChevronLeft className="rotate-rtl me-25" size={14} />
                      <span className="align-middle">Back to login</span>
                    </Link>
                  </p>
                </Col>
              </>
            ) : (
              <>
                <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
                  <CardTitle tag="h2" className="fw-bolder mb-1">
                    New Password 🔒
                  </CardTitle>
                  <CardText className="mb-75">
                    We sent a OTP to your Email. Enter the OTP from the Mail in
                    the field below and Enter New Password.
                  </CardText>
                  <Form
                    className="mt-2"
                    onSubmit={(e) => {
                      e.preventDefault(), handleSubmit(confirmPasswordOTP())
                    }}
                  >
                    <h6>Type your 6 digit OTP code</h6>
                    <div className="auth-input-wrapper d-flex align-items-center justify-content-between">
                      <OtpInput
                        value={otpValues}
                        onChange={(e) => handleChange(e)}
                        numInputs={6}
                        isInputNum={true}
                        inputStyle={{
                          width: '3rem',
                          height: '3rem',
                          margin: ' 0.5rem 0.5rem',
                          padding: ' 0.571rem 0rem',
                          backgroundColor: '#fff',
                          backgroundClip: 'padding-box',
                          border: '1px solid #d8d6de',
                          borderRadius: '0.357rem'
                        }}
                      />
                    </div>
                    <div className="mb-1 mt-2">
                      <div className="d-flex justify-content-between">
                        <Label className="form-label" for="login-password">
                          Enter New Password
                        </Label>
                      </div>
                      <Controller
                        id="password"
                        name="password"
                        {...register('password', {
                          required: 'Please enter your Password',
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
                    <Button color="primary" disabled={loading} block>
                      {loading ? (
                        <Spinner text="Loading..." color="white" size="sm" />
                      ) : (
                        'Submit'
                      )}
                    </Button>
                  </Form>

                  <p className="text-center mt-2">
                    {/* <span>Didn’t get the code?</span> <hr />
                    <a href="/" onClick={handleSubmit(onSubmit)}>
                      Resend
                    </a>{' '}
                    <span>or</span>{' '} */}
                    <Link to="/login">
                      <ChevronLeft className="rotate-rtl me-25" size={14} />
                      <span className="align-middle">Login with password</span>
                    </Link>
                  </p>
                </Col>
              </>
            )}
          </Col>
        </Row>
      </div>
    )
  } else {
    return <Navigate to="/" />
  }
}

export default ForgotPassword
