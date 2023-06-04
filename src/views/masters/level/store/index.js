import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const fetchLevelList = createAsyncThunk(
  'levelMaster/fetchLevelList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/level', { params })
      return {
        levelList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchLevelDropdown = createAsyncThunk(
  'levelMaster/fetchLevelDropdown',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/level')
      return {
        leveldropdown: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addLevel = createAsyncThunk(
  'levelMaster/addLevel',
  async ({ levelName, description, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/level', {
        levelName,
        description
      })
      toast.success('Level added successfully')
      dispatch(fetchLevelList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editLevel = createAsyncThunk(
  'levelMaster/editLevel',
  async ({ id, levelName, description, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/level/${id}`, {
        levelName,
        description
      })
      toast.success('Level edited successfully')
      dispatch(fetchLevelList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteLevel = createAsyncThunk(
  'levelMaster/deleteLevel',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/level/${id}`)
      toast.success('Level deleted successfully')
      dispatch(fetchLevelList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const levelMaster = createSlice({
  name: 'levelMaster',
  initialState: {
    levelList: [],
    leveldropdown: [],
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
    selectLevel: (state, action) => {
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
    builder.addCase(fetchLevelList.fulfilled, (state, action) => {
      state.levelList = action?.payload?.levelList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    }),
      builder.addCase(fetchLevelDropdown.fulfilled, (state, action) => {
        state.leveldropdown = action?.payload?.leveldropdown
      })
  }
})

export const { selectLevel, setLoader, setPageNo, setPageSize, setSearch } =
  levelMaster.actions

export default levelMaster.reducer
