// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { baseUrl } from '../../../../app.config'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'

export const getModuleDropdown = createAsyncThunk(
  'masterModule/getModuleDropdown',
  async () => {
    try {
      const response = await axios.get(baseUrl() + '/module')
      return {
        moduleDropdown: response.data.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const getModuleList = createAsyncThunk(
  'masterModule/getModuleList',
  async (params) => {
    try {
      const response = await axios.get(baseUrl() + '/module', { params })
      return {
        totalPages: response.data.data.count.total,
        moduleList: response?.data?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addModule = createAsyncThunk(
  'masterModule/addModule',
  async ({ moduleName, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/module', {
        moduleName
      })
      toast.success('Module Added successfully')
      dispatch(getModuleList({ ...params }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const updateModule = createAsyncThunk(
  'masterModule/updateModule',
  async ({ id, moduleName, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/module/${id}`, {
        moduleName
      })
      toast.success('Module Updated successfully')
      dispatch(getModuleList({ ...params }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteModule = createAsyncThunk(
  'masterModule/deleteModule',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/module/${id}`),
        toast.success('Module Deleted successfully')
      dispatch(getModuleList({ pageNo, pageSize, search: search }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const masterModule = createSlice({
  name: 'masterModule',
  initialState: {
    moduleDropdown: [],
    moduleList: [],
    selectMasterModule: [],
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
    selectModule: (state, action) => {
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

  extraReducers: {
    [getModuleDropdown.fulfilled]: (state, action) => {
      state.moduleDropdown = action?.payload?.moduleDropdown
    },
    [getModuleList.fulfilled]: (state, action) => {
      state.moduleList = action?.payload?.moduleList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    }
  }
})

export const { selectModule, setLoader, setPageNo, setPageSize, setSearch } =
  masterModule.actions

export default masterModule.reducer
