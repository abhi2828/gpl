import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const fetchCareerTracksList = createAsyncThunk(
  'talentPhilosophy/fetchCareerTracksList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/career-tracks', { params })
      return {
        careerTracksList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchChroList = createAsyncThunk(
  'talentPhilosophy/fetchChroList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/talent-philosophy')
      return {
        chroList: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addCareerTracks = createAsyncThunk(
  'talentPhilosophy/addCareerTracks',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/career-tracks', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      toast.success('Career Tracks added successfully')
      dispatch(fetchCareerTracksList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const addChroList = createAsyncThunk(
  'talentPhilosophy/addChroList',
  async ({ name, chroMessage, imageUrl }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/talent-philosophy', {
        name,
        chroMessage,
        imageUrl
      })
      toast.success('CHRO Updated successfully')
      // dispatch(fetchCareerTracksList({ ...params }))
      // dispatch(fetchChroList())
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editCareerTracks = createAsyncThunk(
  'talentPhilosophy/editCareerTracks',
  async ({ id, formData, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/career-tracks/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Career Tracks edited successfully')
      dispatch(fetchCareerTracksList({ ...params }))

      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteCareerTracks = createAsyncThunk(
  'talentPhilosophy/deleteCareerTracks',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/career-tracks/${id}`)
      toast.success('Career Tracks deleted successfully')
      dispatch(fetchCareerTracksList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const talentPhilosophy = createSlice({
  name: 'talentPhilosophy',
  initialState: {
    careerTracksList: [],
    chroList: [],
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
    selectCareerTracks: (state, action) => {
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
    builder.addCase(fetchCareerTracksList.fulfilled, (state, action) => {
      state.careerTracksList = action?.payload?.careerTracksList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    }),
      builder.addCase(fetchChroList.fulfilled, (state, action) => {
        state.chroList = action?.payload?.chroList
      })
  }
})

export const {
  selectCareerTracks,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} = talentPhilosophy.actions

export default talentPhilosophy.reducer
