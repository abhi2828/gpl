import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const getAllBanners = createAsyncThunk(
  'bannerMaster/getAllBanners',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/banner', { params })
      return {
        bannerList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)
export const updateBannerStatus = createAsyncThunk(
  'testimonial/updateBannerStatus',
  async ({ id, isVisible, params }, { dispatch }) => {
    try {
      await axios.patch(baseUrl() + `/banner/${id}`, { isVisible: isVisible })
      toast.success('Banner status updated successfully.')
      await dispatch(getAllBanners({ ...params }))
      return { id }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
)
export const addBanner = createAsyncThunk(
  'bannerMaster/addBanner',
  async (
    { showContent, showBanner, url, description, displayOrder, name, params },
    { dispatch }
  ) => {
    try {
      await axios.post(baseUrl() + '/banner', {
        showContent,
        showBanner,
        url,
        description,
        displayOrder,
        name
      })
      toast.success('Banner added successfully')
      dispatch(getAllBanners({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editBanner = createAsyncThunk(
  'bannerMaster/editBanner',
  async (
    {
      id,
      name,
      showContent,
      showBanner,
      url,
      description,
      displayOrder,
      params
    },
    { dispatch }
  ) => {
    try {
      await axios.put(baseUrl() + `/banner/${id}`, {
        name,
        showContent,
        showBanner,
        url,
        description,
        displayOrder
      })
      toast.success('Banner edited successfully')
      dispatch(getAllBanners({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteBanner = createAsyncThunk(
  'bannerMaster/deleteBanner',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/banner/${id}`)
      toast.success('Banner deleted successfully')
      dispatch(getAllBanners({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const bannerMaster = createSlice({
  name: 'bannerMaster',
  initialState: {
    bannerList: [],
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
    selectBanner: (state, action) => {
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
    builder.addCase(getAllBanners.fulfilled, (state, action) => {
      state.bannerList = action?.payload?.bannerList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
  }
})

export const { selectBanner, setLoader, setPageNo, setPageSize, setSearch } =
  bannerMaster.actions

export default bannerMaster.reducer
