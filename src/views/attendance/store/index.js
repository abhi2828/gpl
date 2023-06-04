import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../app.config'

export const getAttendanceData = createAsyncThunk(
  'attendance/getAttendanceData',
  async (params, { dispatch }) => {
    const response = await axios.get(baseUrl() + '/attendance', {
      params
    })
    return {
      params: response?.data?.params,
      totalPages: response?.data?.count?.total,
      AttendanceList: response?.data?.data
    }
  }
)

export const getAttendanceDetail = createAsyncThunk(
  'attendance/getAttendanceDetail',
  async ({ id }, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + `/attendance/${id}`)
      return {
        detail: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

// export const getAttendanceList = createAsyncThunk(
//   'attendance/getAttendanceData',
//   async (params, { dispatch }) => {
//     try {
//       const response = await axios.get(baseUrl() + '/attendance', { params })
//       return {
//         getList: response.data.data
//       }
//     } catch (e) {
//       toast.error(e?.response?.data?.message)
//     }
//   }
// )

export const attendanceBulkUpload = createAsyncThunk(
  'attendance/attendanceBulkUpload',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/attendance/upload', formData)
      toast.success('Attendance BulkUploaded successfully')
      dispatch(getAttendanceData({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const fetchAllAttendance = createAsyncThunk(
  'attendance/fetchAllAttendance',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/attendance')
      return {
        allAttendance: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addAttendance = createAsyncThunk(
  'attendance/addAttendance',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/attendance', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Attendance added successfully')
      dispatch(getAttendanceData({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editAttendance = createAsyncThunk(
  'attendance/editAttendance',
  async ({ id, attendanceName, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/sponsor/${id}`, attendanceName)
      toast.success('Attendance edited successfully')
      dispatch(getAttendanceData({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteAttendance = createAsyncThunk(
  'attendance/deleteAttendance',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/attendance/${id}`)
      toast.success('Attendance deleted successfully')
      dispatch(getAttendanceData({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    AttendanceList: [],
    getList: [],
    allAttendance: [],
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
    selectAttendance: (state, action) => {
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
    builder.addCase(getAttendanceData.fulfilled, (state, action) => {
      state.AttendanceList = action?.payload?.AttendanceList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
    builder.addCase(fetchAllAttendance.fulfilled, (state, action) => {
      state.allAttendance = action?.payload?.allAttendance
      state.loader = false
    })
    // builder.addCase(getAttendanceList.fulfilled, (state, action) => {
    //   state.getList = action?.payload?.getList
    // })
  }
})

export const {
  selectAttendance,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} = attendanceSlice.actions

export default attendanceSlice.reducer
