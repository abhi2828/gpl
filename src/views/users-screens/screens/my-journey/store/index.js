import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../../app.config'

export const fetchUserInfo = createAsyncThunk(
  'myJourney/fetchUserInfo',
  async () => {
    try {
      const response = await axios.get(baseUrl() + '/auth/gpl-employee-info')
      return {
        userInfo: response?.data?.data
        // totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
      setLoader(false)
    }
  }
)

export const viewUserCertificate = createAsyncThunk(
  'myJourney/viewUserCertificate',
  async (payload, { dispatch }) => {
    const { learningTrackId, userId, subTrackId } = payload
    try {
      const response = await axios.get(
        baseUrl() +
          `/user_certificate/certificate?learningTrackId=${learningTrackId}&userId=${userId}&subTrackId=${
            subTrackId ? subTrackId : ''
          } `
      )
      // const response = await axios.post(
      //   baseUrl() + `/user_certificate/certificate`,
      //   payload
      // )
      return {
        pdfUrl: response?.data?.data?.pdfUrl,
        imageUrl: response?.data?.data?.imageUrl
      }
    } catch (e) {
      // toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchSubtrackUrlList = createAsyncThunk(
  'myJourney/fetchSubtrackUrlList',
  async (payload, { dispatch }) => {
    try {
      const response = await axios.get(
        baseUrl() +
          `/user_certificate/certificate?learningTrackId=${payload.learningTrackId}&userId=${payload.userId}`
      )
      // const response = await axios.post(
      //   baseUrl() + `/user_certificate/certificate`,payload
      // )
      return {
        subTrackUrlList: response?.data?.data,
        subTrackId: payload.subTrackId
      }
    } catch (e) {
      // toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchUserEnroll = createAsyncThunk(
  'myJourney/fetchUserEnroll',
  async ({ userId }) => {
    try {
      const response = await axios.get(
        baseUrl() + '/learningTrack/enroll-list',
        { userId }
      )
      return {
        userEnroll: response?.data?.data?.trackList,
        userId: response?.data?.data?.userId
        // totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const myJourney = createSlice({
  name: 'myJourney',
  initialState: {
    userInfo: [],
    userEnroll: [],
    subTrackUrlList: [],
    userId: '',
    urls: [],
    // pdfUrl: '',
    // imageUrl:'',
    loader: true,
    selected: null
  },
  reducers: {
    setLoader: (state, action) => {
      state.loader = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.userInfo = action?.payload?.userInfo
      state.loader = false
    }),
      builder.addCase(fetchUserEnroll.fulfilled, (state, action) => {
        state.userId = action?.payload?.userId
        state.userEnroll = action?.payload?.userEnroll
        state.loader = false
      }),
      builder.addCase(viewUserCertificate.fulfilled, (state, action) => {
        state.urls = action.payload
        // state.pdfUrl = action?.payload?.pdfUrl
        // state.imageUrl = action?.payload?.imageUrl
        state.loader = false
      }),
      builder.addCase(fetchSubtrackUrlList.fulfilled, (state, action) => {
        state.subTrackUrlList = [...state?.subTrackUrlList, action?.payload]
        state.loader = false
      })
  }
})

export const { setLoader } = myJourney.actions

export default myJourney.reducer
