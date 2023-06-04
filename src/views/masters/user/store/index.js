import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const fetchUserList = createAsyncThunk(
  'userMaster/fetchUserList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/user', { params })
      return {
        userList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)
export const fetchAllUserList = createAsyncThunk(
  'userMaster/fetchAllUserList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/user')
      return {
        userAllList: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)
export const addUser = createAsyncThunk(
  'userMaster/addUser',
  async ({ data, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/auth/register', {
        ...data
      })
      toast.success('User added successfully!')
      dispatch(fetchUserList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editUser = createAsyncThunk(
  'userMaster/editUser',
  async ({ payload, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/user/${payload.id}`, { ...payload })
      toast.success('User edited successfully!')
      dispatch(fetchUserList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteUser = createAsyncThunk(
  'userMaster/deleteUser',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/user/${id}`)
      toast.success('User deleted successfully!')
      dispatch(fetchUserList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const userMaster = createSlice({
  name: 'userMaster',
  initialState: {
    userList: [],
    userAllList: [],
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
    selectUser: (state, action) => {
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
    builder.addCase(fetchUserList.fulfilled, (state, action) => {
      state.userList = action?.payload?.userList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    }),
      builder.addCase(fetchAllUserList.fulfilled, (state, action) => {
        state.userAllList = action?.payload?.userAllList
      })
  }
})

export const { selectUser, setLoader, setPageNo, setPageSize, setSearch } =
  userMaster.actions

export default userMaster.reducer
