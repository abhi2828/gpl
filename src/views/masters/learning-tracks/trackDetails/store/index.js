// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseUrl } from '../../../../../app.config'
import { fetchLearningListById } from '../../store'
// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'

export const fetchSubTrackList = createAsyncThunk(
  'subTrack/fetchSubTrackList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/subTrack', { params })
      return {
        subTrackList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addSubTrack = createAsyncThunk(
  'subTrack/addSubTrack',
  async (
    {
      name,
      startDate,
      endDate,
      completedDate,
      starPerformer,
      learningTrackId,
      params
    },
    { dispatch }
  ) => {
    try {
      await axios.post(baseUrl() + '/subTrack', {
        name,
        startDate,
        endDate,
        completedDate,
        starPerformer,
        learningTrackId
      })
      toast.success('SubTrack added successfully')

      params = {
        ...params,
        learningTrackId
      }
      dispatch(fetchSubTrackList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editSubTrack = createAsyncThunk(
  'subTrack/editSubTrack',
  async (
    {
      id,
      name,
      startDate,
      endDate,
      completedDate,
      starPerformer,
      learningTrackId,
      params
    },
    { dispatch }
  ) => {
    try {
      await axios.put(baseUrl() + `/subTrack/${id}`, {
        name,
        startDate,
        endDate,
        completedDate,
        starPerformer,
        learningTrackId
      })
      toast.success('SubTrack edited successfully')
      params = {
        ...params,
        learningTrackId
      }
      dispatch(fetchSubTrackList({ ...params }))
      return true
    } catch (e) {
      // toast.error(e?.response?.data?.message)
      toast.success('SubTrack edited successfully')
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteSubTrack = createAsyncThunk(
  'subTrack/deleteSubTrack',
  async ({ id, pageNo, pageSize, search, learningTrackId }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/subTrack/${id}`)
      toast.success('SubTrack deleted successfully')
      dispatch(fetchSubTrackList({ learningTrackId }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const subTrack = createSlice({
  name: 'subTrack',
  initialState: {
    subTrackList: [],
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
    selectSubTrack: (state, action) => {
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
    builder.addCase(fetchSubTrackList.fulfilled, (state, action) => {
      state.subTrackList = action?.payload?.subTrackList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
  }
})

export const { selectSubTrack, setLoader, setPageNo, setPageSize, setSearch } =
  subTrack.actions

export default subTrack.reducer
