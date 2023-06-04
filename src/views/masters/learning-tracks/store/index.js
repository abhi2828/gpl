// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseUrl } from '../../../../app.config'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchLearningList = createAsyncThunk(
  'learningTrack/fetchLearningList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/learningTrack', {
        params
      })
      return {
        learningList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchLearningListAll = createAsyncThunk(
  'learningTrack/fetchLearningListAll',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/learningTrack')
      return {
        learningListAll: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const fetchLearningListById = createAsyncThunk(
  'learningTrack/fetchLearningListById',

  async (id) => {
    const response = await axios.get(baseUrl() + `/learningTrack/${id}`)

    return {
      LearningListById: response?.data?.data
    }
  }
)

export const fetchLearningtrackDropdown = createAsyncThunk(
  'learningTrack/fetchLearningtrackDropdown',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/learningTrack')
      return {
        learningTrackAll: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addLearningTrack = createAsyncThunk(
  'learningTrack/addLearningTrack',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/learningTrack/sponsor-trainer', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Learning Track Added successfully')
      dispatch(fetchLearningList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const LearningTrackBulkUpload = createAsyncThunk(
  'learningTrack/LearningTrackBulkUpload',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/learningTrack/uploadTracks', formData)
      toast.success('Learning Track BulkUploaded successfully')
      dispatch(fetchLearningList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const updateLearningTrack = createAsyncThunk(
  'learningTrack/updateCategory',
  async ({ id, formData, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/learningTrack/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Learning Track Updated successfully')
      await dispatch(fetchLearningList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const updateLearningTrackStatus = createAsyncThunk(
  'learningTrack/updateLearningTrackStatus',
  async ({ id, isVisible, params }, { dispatch }) => {
    try {
      await axios.patch(baseUrl() + `/learningTrack/${id}`, {
        isVisible: isVisible
      })
      toast.success('Learning Track status updated successfully')
      await dispatch(fetchLearningList({ ...params }))
      return { id }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
)

export const deleteLearningTrack = createAsyncThunk(
  'learningTrack/deleteLearningTrack',

  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/learningTrack/${id}`),
        toast.success('Learning Track Deleted successfully')
      await dispatch(fetchLearningList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const fetchMyTrackinfo = createAsyncThunk(
  'learningTrack/fetchMyTrackinfo',
  async () => {
    try {
      const response = await axios.get(baseUrl() + '/auth/gpl-employee-info')
      return {
        myTrackInfo: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
      return false
    }
  }
)
export const enrollLearningTrack = createAsyncThunk(
  'learningTrack/enrollLearningTrack',
  async ({ formData }, { dispatch }) => {
    try {
      const response = await axios.post(
        baseUrl() + '/user-track/enroll',
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      )
      dispatch(fetchLearningListAll())
      return {
        enrollNowLoader: false
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
      return {
        enrolledMsg: e?.response?.data?.message
      }
    }
  }
)

export const addSponsor = createAsyncThunk(
  'learningTrack/addSponsor',
  async (
    { sponsorMessage, sponsorId, learningTrackId, params },
    { dispatch }
  ) => {
    try {
      dispatch(setLoader(true))
      await axios.post(baseUrl() + '/track_sponsor/addTrackSponsor', {
        learningTrackId,
        sponsorId,
        sponsorMessage
      })
      toast.success('Sponsor added successfully')
      dispatch(fetchLearningListById(learningTrackId))
      dispatch(setLoader(false))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)
export const editSponsor = createAsyncThunk(
  'learningTrack/addSponsor',
  async (
    { id, sponsorMessage, sponsorId, learningTrackId, params },
    { dispatch }
  ) => {
    try {
      dispatch(setLoader(true))
      await axios.put(baseUrl() + `/track_sponsor/${id}`, {
        learningTrackId,
        sponsorId,
        sponsorMessage
      })
      toast.success('Sponsor edited successfully')
      dispatch(setLoader(false))
      dispatch(fetchLearningListById(learningTrackId))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)
export const deleteSponsor = createAsyncThunk(
  'learningTrack/deleteSubTrack',
  async ({ id, learningTrackId }, { dispatch }) => {
    try {
      dispatch(setLoader(true))
      await axios.delete(baseUrl() + `/track_sponsor/${id}`)
      toast.success('Sponsor deleted successfully')
      dispatch(fetchLearningListById(learningTrackId))
      dispatch(setLoader(false))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)
// export const enrollLearningTrack = createAsyncThunk(
//   'sponsorMaster/addSponsor',
//   async ({ sponsorName, params }, { dispatch }) => {
//     try {
//       await axios.post(baseUrl() + '/sponsor', { ...sponsorName })
//       toast.success('Enrolled Learning Track successfully')
//       dispatch(fetchSponsorList({ ...params }))
//       return true
//     } catch (e) {
//       toast.error(e?.response?.data?.message)
//       dispatch(setLoader(false))
//       return false
//     }
//   }
// )

export const learningTrack = createSlice({
  name: 'learningTrack',
  initialState: {
    learningList: [],
    learningListAll: [],
    myTrackInfo: [],
    LearningListById: [],
    learningTrackAll: [],
    upcomingTracks: [],
    loader: true,
    enrollNowLoader: false,
    enrolledMsg: '',
    params: {
      pageNo: 1,
      pageSize: 10,
      search: ''
    },
    totalPages: 0,
    selected: null
  },
  reducers: {
    selectLearningTrack: (state, action) => {
      if (action.payload === null) {
        state.selected = null
      } else {
        state.selected = action.payload
      }
    },
    setLearningListById: (state, action) => {
      if (action.payload === null) {
        state.LearningListById = []
      } else {
        state.LearningListById = action.payload
      }
    },
    setLoader: (state, action) => {
      state.loader = action.payload
    },
    setEnrollNowLoader: (state, action) => {
      state.enrollNowLoader = action.payload
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
    builder.addCase(fetchLearningList.fulfilled, (state, action) => {
      state.learningList = action?.payload?.learningList
      state.totalPages = action?.payload?.totalPages
      state.upcomingTracks = action?.payload?.upcomingTracks
      state.loader = false
    })
    builder.addCase(fetchLearningListAll.fulfilled, (state, action) => {
      state.learningListAll = action?.payload?.learningListAll
      state.loader = false
    })
    builder.addCase(fetchLearningtrackDropdown.fulfilled, (state, action) => {
      state.learningTrackAll = action?.payload?.learningTrackAll
    })
    builder.addCase(fetchLearningListById.fulfilled, (state, action) => {
      state.LearningListById = action?.payload?.LearningListById
      state.loader = false
      state.selected = action?.payload?.LearningListById
    })
    builder.addCase(fetchMyTrackinfo.fulfilled, (state, action) => {
      state.myTrackInfo = action?.payload?.myTrackInfo
      state.loader = false
    })
    builder.addCase(enrollLearningTrack.fulfilled, (state, action) => {
      state.enrollNowLoader = action?.payload?.enrollNowLoader
      state.enrolledMsg = action?.payload?.enrolledMsg
      state.loader = false
    })
  }
})

export const {
  selectLearningTrack,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch,
  setEnrollNowLoader,
  setLearningListById
} = learningTrack.actions

export default learningTrack.reducer
