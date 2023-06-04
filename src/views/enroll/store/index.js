import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../app.config'

export const getEnrollData = createAsyncThunk(
  'enroll/getEnrollData',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/user-track', {
        params
      })
      return {
        params: response.data.params,
        enrollList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const getEnrollBulkUpload = createAsyncThunk(
  'enroll/getEnrollBulkUpload',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/enrollNow/upload', formData)
      toast.success('Enroll BulkUploaded successfully')
      dispatch(getEnrollData({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      // toast.error('Something went wrong')
      dispatch(setLoader(false))
      return false
    }
  }
)

export const getEnrollStatus = createAsyncThunk(
  'enroll/getEnrollStatus',
  async (payload, { dispatch }) => {
    dispatch(setLoader(true))
    let enrollStatus = payload.params.enrollStatus
    try {
      await axios.patch(baseUrl() + `/user-track/${payload.id}`, {
        enrollStatus
      })
      toast.success(`${payload.params.enrollStatus} successfully`)
      const { pageNo, pageSize, search } = payload.params
      dispatch(getEnrollData({ pageNo, pageSize, search }))
      dispatch(setLoader(false))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const addEnroll = createAsyncThunk(
  'enroll/addEnroll',
  async ({ name, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/enroll', { name })
      toast.success('Enrolled successfully')
      dispatch(getEnrollData({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      // toast.error('Something went wrong')
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editEnroll = createAsyncThunk(
  'enroll/editEnroll',
  async ({ id, name, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/subTrack/${id}`, { name })
      toast.success('Enroll edited successfully')
      dispatch(getEnrollData({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteEnroll = createAsyncThunk(
  'enroll/deleteEnroll',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/subTrack/${id}`)
      toast.success('Enroll deleted successfully')
      dispatch(getEnrollData({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const enroll = createSlice({
  name: 'enroll',
  initialState: {
    enrollList: [],
    loader: false,
    params: {
      pageNo: 1,
      pageSize: 10,
      search: ''
    },
    totalPages: 0,
    selected: null
  },
  reducers: {
    selectEnroll: (state, action) => {
      if (action.payload === null) {
        state.selected = null
      } else {
        state.selected = action.payload
      }
    },
    setLoader: (state, action) => {
      state.loader = action.payload
    },
    setPageNo: (state, action) => {
      state.params = { ...state.params, pageNo: action.payload }
    },
    setPageSize: (state, action) => {
      state.params = { ...state.params, pageSize: action.payload }
    },
    setSearch: (state, action) => {
      state.params = { ...state.params, search: action.payload }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getEnrollData.fulfilled, (state, action) => {
      state.enrollList = action.payload.enrollList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
  }
})

export const { selectEnroll, setLoader, setPageNo, setPageSize, setSearch } =
  enroll.actions

export default enroll.reducer
