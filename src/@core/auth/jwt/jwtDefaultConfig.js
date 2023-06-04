import { baseUrl } from '../../../app.config'

// ** Auth Endpoints
export default {
  loginEndpoint: baseUrl() + '/auth/login',
  // registerEndpoint: baseUrl() + '/auth/register',
  refreshEndpoint: baseUrl() + '/auth/refresh-token',
  // logoutEndpoint: '/jwt/logout',
  onBoard: baseUrl() + '/auth/onboard',
  forgotPassword: baseUrl() + '/auth/forgot-password',
  forgotPasswordConfirm: baseUrl() + '/auth/forgot-password/confirm',
  // ** This will be prefixed in authorization header with token
  // ? e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // ** Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
  setUserName: 'name'
}
