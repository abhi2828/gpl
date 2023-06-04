import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../app.config'

export const getFileData = createAsyncThunk(
  'fileUpload/getFileData',
  async (params, { dispatch }) => {
    const response = await axios.get(baseUrl() + '/fileList', {
      params
    })

    return {
      params: response.data.params,
      fileUploadList: response?.data?.data,
      totalPages: response?.data?.count?.total
    }
  }
)

export const getFileUpload = createAsyncThunk(
  'fileUpload/getFileUpload',
  async ({ formData, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/upload-file', formData)
      toast.success('File upload successfully')
      dispatch(getFileData({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)
export const deleteFile = createAsyncThunk(
  'fileUpload/deleteFile',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    try {
      dispatch(setLoader(true))
      await axios.delete(baseUrl() + `/delete-file/${id}`)
      toast.success('File deleted successfully')
      dispatch(getFileData({ pageNo, pageSize, search: search }))
      dispatch(setLoader(false))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

// export const deleteEnroll = createAsyncThunk(
//   'enroll/deleteEnroll',
//   async ({ id, pageNo, pageSize, search }, { dispatch }) => {
//     dispatch(setLoader(true))
//     try {
//       await axios.delete(baseUrl() + `/subTrack/${id}`)
//       toast.success('Enroll deleted successfully')
//       dispatch(getEnrollData({ pageNo, pageSize, search: search }))
//       return true
//     } catch (e) {
//       toast.error(e?.response?.data?.message)
//       dispatch(setLoader(false))
//       return false
//     }
//   }
// )

export const fileUpload = createSlice({
  name: 'fileUpload',
  initialState: {
    fileUploadList: [],
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
    selectFile: (state, action) => {
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
    builder.addCase(getFileData.fulfilled, (state, action) => {
      state.fileUploadList = action.payload.fileUploadList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
  }
})

export const { selectFile, setLoader, setPageNo, setPageSize, setSearch } =
  fileUpload.actions

export default fileUpload.reducer
