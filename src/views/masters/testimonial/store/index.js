// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseUrl } from '../../../../app.config'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchTestimonial = createAsyncThunk(
  'testimonial/fetchTestimonial',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/testimonial', { params })
      return {
        testimonialList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addTestimonial = createAsyncThunk(
  'testimonial/addTestimonial',
  async (
    { userName, departmentId, designationId, testimonial, imageUrl, params },
    { dispatch }
  ) => {
    try {
      const response = await axios.post(baseUrl() + '/testimonial', {
        userName,
        departmentId,
        designationId,
        testimonial,
        imageUrl
      })
      toast.success(response?.data?.message)
      dispatch(fetchTestimonial({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const updateTestimonial = createAsyncThunk(
  'testimonial/updateTestimonial',
  async (
    {
      id,
      userName,
      departmentId,
      designationId,
      testimonial,
      imageUrl,
      params
    },
    { dispatch }
  ) => {
    try {
      await axios.put(baseUrl() + `/testimonial/${id}`, {
        userName,
        departmentId,
        designationId,
        testimonial,
        imageUrl
      })
      toast.success('Testimonial edited successfully')
      await dispatch(fetchTestimonial({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)
export const updateTestimonialStatus = createAsyncThunk(
  'testimonial/updateTestimonialStatus',
  async ({ id, isVisible, params }, { dispatch }) => {
    try {
      await axios.patch(baseUrl() + `/testimonial/${id}`, {
        isVisible: isVisible
      })
      toast.success('Testimonial status updated successfully')
      await dispatch(fetchTestimonial({ ...params }))
      return { id }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
)
export const deleteTestimonial = createAsyncThunk(
  'testimonial/deleteTestimonial',

  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/testimonial/${id}`),
        toast.success('Testimonial Deleted successfully')
      await dispatch(fetchTestimonial({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const testimonial = createSlice({
  name: 'testimonial',
  initialState: {
    testimonialList: [],
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
    selectTestimonial: (state, action) => {
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
    builder.addCase(fetchTestimonial.fulfilled, (state, action) => {
      state.testimonialList = action?.payload?.testimonialList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
  }
})

export const {
  selectTestimonial,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} = testimonial.actions

export default testimonial.reducer
