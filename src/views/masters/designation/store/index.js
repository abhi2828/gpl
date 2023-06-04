import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const fetchDesignationList = createAsyncThunk(
  'designationMaster/fetchDesignationList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/designation', { params })
      return {
        designationList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchDesignationDropdown = createAsyncThunk(
  'designationMaster/fetchDesignationDropdown',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/designation')
      return {
        designationDropdown: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addDesignation = createAsyncThunk(
  'designationMaster/addDesignation',
  async ({ name, description, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/designation', {
        name,
        description
      })
      toast.success('designation added successfully')
      dispatch(fetchDesignationList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editDesignation = createAsyncThunk(
  'designationMaster/editDesignation',
  async ({ id, name, description, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/designation/${id}`, {
        name,
        description
      })
      toast.success('Designation edited successfully')
      dispatch(fetchDesignationList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteDesignation = createAsyncThunk(
  'designationMaster/deleteDesignation',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/designation/${id}`)
      toast.success('designation deleted successfully')
      dispatch(fetchDesignationList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const designationMaster = createSlice({
  name: 'designationMaster',
  initialState: {
    designationList: [],
    designationDropdown: [],
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
    selectDesignation: (state, action) => {
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
    builder.addCase(fetchDesignationList.fulfilled, (state, action) => {
      state.designationList = action?.payload?.designationList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    }),
      builder.addCase(fetchDesignationDropdown.fulfilled, (state, action) => {
        state.designationDropdown = action?.payload?.designationDropdown
      })
  }
})

export const {
  selectDesignation,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} = designationMaster.actions

export default designationMaster.reducer
