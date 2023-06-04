// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseUrl } from '../../../app.config'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchCareerAspirationList = createAsyncThunk(
  'careerAspirationAdmin/fetchCareerAspirationList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/user/career-aspiration', {
        params
      })
      return {
        careerAspirationList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const CareerAspirationExport = createAsyncThunk(
  'careerAspirationAdmin/CareerAspirationExport',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/user/export', formData)
      toast.success('Career Aspiration Exported successfully')
      dispatch(fetchCareerAspirationList({ ...params }))
      // return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      // dispatch(setLoader(false))
      // return false
    }
  }
)

export const careerAspirationAdmin = createSlice({
  name: 'careerAspirationAdmin',
  initialState: {
    careerAspirationList: [],
    loader: true,
    params: {
      pageNo: 1,
      pageSize: 10,
      search: ''
    },
    totalPages: 0,
    selected: null
  },
  reducers: {
    selectCareerAspiration: (state, action) => {
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
    builder.addCase(fetchCareerAspirationList.fulfilled, (state, action) => {
      state.careerAspirationList = action?.payload?.careerAspirationList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
  }
})

export const {
  selectCareerAspiration,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} = careerAspirationAdmin.actions

export default careerAspirationAdmin.reducer
