import axios from 'axios'
import jwtDefaultConfig from './jwtDefaultConfig'
import toast from 'react-hot-toast'
import { getUserData, hasPermission } from '../../../utility/Utils'
import { ADMIN_LOGIN, IS_ADMIN, IS_USER } from '../../../utility/constants'

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig }

  // ** For Refreshing Token
  isAlreadyFetchingAccessToken = false

  // ** For Refreshing Token
  subscribers = []

  constructor(jwtOverrideConfig) {
    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig }

    // ** Request Interceptor
    axios.interceptors.request.use(
      (request) => {
        const accessToken = this.getToken()
        // alert(accessToken)
        // ** If token is present add it to request's Authorization Header
        if (accessToken) {
          // ** eslint-disable-next-line no-param-reassign
          request.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
        }
        return request
      },
      (error) => Promise.reject(error)
    )

    // ** Add request/response interceptor
    axios.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        // ** const { config, response: { status } } = error
        const { config, response } = error
        const originalRequest = config
        if (response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.setToken(null)
            this.isAlreadyFetchingAccessToken = true
            this.refreshToken()
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken) => {
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`
              resolve(axios(originalRequest))
            })
          })
          return retryOriginalRequest
        } else if (response.status === 403) {
          localStorage.clear()
          toast.error('Unauthorized access!')
          setTimeout(() => {
            window.location.replace('/')
          }, 500)
        }
        return Promise.reject(error)
      }
    )
  }

  onAccessTokenFetched(accessToken) {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    )
  }

  addSubscriber(callback) {
    this.subscribers.push(callback)
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName)
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName)
  }

  setToken(value) {
    localStorage.setItem(this.jwtConfig.storageTokenKeyName, value)
  }

  setRefreshToken(value) {
    localStorage.setItem(this.jwtConfig.storageRefreshTokenKeyName, value)
  }

  login(...args) {
    return axios.post(this.jwtConfig.loginEndpoint, ...args)
  }
  onBoard(...args) {
    return axios.post(this.jwtConfig.onBoard, ...args)
  }
  forgotPassword(...args) {
    return axios.post(this.jwtConfig.forgotPassword, ...args)
  }

  forgotPasswordConfirm(...args) {
    return axios.put(this.jwtConfig.forgotPasswordConfirm, ...args)
  }
  register(...args) {
    return axios.post(this.jwtConfig.registerEndpoint, ...args)
  }

  async refreshToken() {
    fetch(
      this.jwtConfig.refreshEndpoint +
        `?refreshToken=${this.getRefreshToken()}`,
      {
        method: 'POST'
      }
    )
      .then((r) => r.json())
      .then((t) => {
        this.isAlreadyFetchingAccessToken = false
        if (t.data) {
          // ** Update accessToken in localStorage
          this.setToken(t.data)
          // this.setRefreshToken(r.data.refreshToken)

          this.onAccessTokenFetched(t.data)
        } else {
          let path = throwUserOutOfTheApplication()

          localStorage.clear()
          toast.error('Session Expired !!!! Please Login Again')
          setTimeout(() => {
            window.location.replace(path)
          }, 1000)
        }
      })
      .catch((err) => console.log('catch ' + err))

    // return await axios.post(this.jwtConfig.refreshEndpoint + `?refreshToken=${this.getRefreshToken()}`).then((r)=> r).catch(err => console.log(err))
  }
}

const throwUserOutOfTheApplication = () => {
  let path = '/'
  if (hasPermission(IS_USER) && hasPermission(IS_ADMIN)) {
    const data = getUserData()
    if (data.loggedInAs === ADMIN_LOGIN) {
      path = '/login'
    } else {
      path = '/redirect'
    }
  } else if (hasPermission(IS_USER)) {
    path = '/redirect'
  }

  return path
}
