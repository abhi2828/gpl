import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const fetchDepartmentsList = createAsyncThunk(
  'functions/fetchDepartmentsList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/department', { params })
      return {
        departmentsList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchDepartmentsDropdown = createAsyncThunk(
  'functions/fetchDepartmentsDropdown',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/department')
      return {
        departmentsDropdown: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addDepartments = createAsyncThunk(
  'functions/addDepartments',
  async ({ name, description, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/department', {
        name,
        description
      })
      toast.success('Function added successfully')
      dispatch(fetchDepartmentsList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editDepartments = createAsyncThunk(
  'functions/editDepartments',
  async ({ id, name, description, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/department/${id}`, {
        name,
        description
      })
      toast.success('Function edited successfully')
      dispatch(fetchDepartmentsList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteDepartments = createAsyncThunk(
  'functions/deleteDepartments',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/department/${id}`)
      toast.success('Function deleted successfully')
      dispatch(fetchDepartmentsList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const functions = createSlice({
  name: 'functions',
  initialState: {
    departmentsList: [],
    departmentsDropdown: [],
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
    selectDepartments: (state, action) => {
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
    builder.addCase(fetchDepartmentsList.fulfilled, (state, action) => {
      state.departmentsList = action?.payload?.departmentsList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    }),
      builder.addCase(fetchDepartmentsDropdown.fulfilled, (state, action) => {
        state.departmentsDropdown = action?.payload?.departmentsDropdown
      })
  }
})

export const {
  selectDepartments,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} = functions.actions

export default functions.reducer
