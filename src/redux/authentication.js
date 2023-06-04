// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** UseJWT import to get config
import axios from 'axios'
import useJwt from '@src/auth/jwt/useJwt'
import toast from 'react-hot-toast'
import { getUserData } from '../utility/Utils'
import { baseUrl } from '../app.config'
import { SSO_LOGIN } from '../utility/constants'

const config = useJwt.jwtConfig

export const validate = createAsyncThunk(
  'authentication/validate',
  async ({ code }) => {
    try {
      const res = await axios.post(baseUrl() + '/saml/validate', {
        uuid: code
      })
      const response = res?.data?.data
      const data = {
        ...response,
        accessToken: response?.jwtToken,
        refreshToken: response?.refreshToken,
        role: response?.roles,
        permissions: response?.permission,
        name: response?.name,
        loggedInAs: SSO_LOGIN
      }

      localStorage.setItem('userData', JSON.stringify(data))
      localStorage.setItem(config.storageTokenKeyName, response?.jwtToken)
      localStorage.setItem(
        config.storageRefreshTokenKeyName,
        response?.refreshToken
      )

      return {
        uuid: response
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
      return null
    }
  }
)

export const getSAMLURL = createAsyncThunk(
  'authentication/getSAMLURL',
  async (flag) => {
    try {
      const response = await axios.get(baseUrl() + '/saml/login')
      return {
        redirectURL: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const updateCareerAspConfig = createAsyncThunk(
  'authentication/updateCareerAspConfig',
  async (flag) => {
    try {
      await axios.patch(baseUrl() + '/config/career-aspiration', {
        flag
      })
      return {
        flag
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchPermissions = createAsyncThunk(
  'authentication/fetchPermissions',
  async (params) => {
    try {
      const response = await axios.get(
        baseUrl() + '/permissions/user/' + getUserData().id
      )
      return {
        permissions: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
      return null
    }
  }
)

const initialUser = () => {
  const item = window.localStorage.getItem('userData')

  //** Parse stored json or if none return initialValue
  return item ? JSON.parse(item) : {}
}

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    loading: false,
    // redirectURL: "",
    userData: initialUser(),
    permissions: initialUser()?.permissions ?? []
  },
  reducers: {
    handleLogin: (state, action) => {
      state.userData = action.payload
      state[config.storageTokenKeyName] =
        action.payload[config.storageTokenKeyName]
      state[config.storageRefreshTokenKeyName] =
        action.payload[config.storageRefreshTokenKeyName]
      localStorage.setItem('userData', JSON.stringify(action.payload))
      localStorage.setItem(
        config.storageTokenKeyName,
        action.payload?.accessToken
      )
      localStorage.setItem(
        config.storageRefreshTokenKeyName,
        action.payload?.refreshToken
      )
    },

    handleLogout: (state) => {
      state.userData = {}
      state[config.storageTokenKeyName] = null
      state[config.storageRefreshTokenKeyName] = null
      // ** Remove user, accessToken & refreshToken from localStorage
      localStorage.clear()
    }
  },
  extraReducers: {
    [fetchPermissions.fulfilled]: (state, action) => {
      state.permissions = action.payload?.permissions
    },
    [updateCareerAspConfig.fulfilled]: (state, action) => {
      state.userData = {
        ...state.userData,
        updateCareerAspiration: action.payload.flag
      }
    }
    // [getSAMLURL.fulfilled]: (state, action) => {
    //   state.redirectURL = action.payload.redirectURL
    // }
  }
})

export const { handleLogin, handleLogout } = authSlice.actions

export default authSlice.reducer
