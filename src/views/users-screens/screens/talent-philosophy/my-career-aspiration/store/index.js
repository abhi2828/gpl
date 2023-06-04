import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../../../app.config'

export const fetchCareerAspiration = createAsyncThunk(
  'careerAspiration/fetchCareerAspiration',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/user/career-aspiration')
      return {
        careerAspiration: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const downloaFile = async (newFile) => {
  try {
    const response = await axios
      .get(baseUrl() + `/downloadFile/${newFile}`)
      .then((response) => {
        let url = URL.createObjectURL(response.data)
        let a = document.createElement('a')
        a.href = url
        a.download = 'file.pdf'
        a.click()
        //window.location.href = response.url;
      })
    return {
      downloadedFile: response?.data?.data
    }
  } catch (e) {
    toast.error(e?.response?.data?.message)
  }
}

export const editCareerAspiration = createAsyncThunk(
  'careerAspiration/editCareerAspiration',
  async ({ id, careerAspiration, params }, { dispatch }) => {
    try {
      await axios.patch(baseUrl() + `/user/${id}/career-aspiration`, {
        careerAspiration
      })
      const newObject = JSON.parse(localStorage.getItem('userData'))
      newObject.careerAspiration = careerAspiration
      localStorage.setItem('userData', JSON.stringify(newObject))
      // toast.success('Career Aspiration Added Successfully')
      toast.success('Career Aspiration Added Successfully')
      dispatch(fetchCareerAspiration({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const careerAspiration = createSlice({
  name: 'careerAspiration',
  initialState: {
    careerAspiration: '',
    loader: true,
    downloadedFile: '',
    downloadedFileStatus: false
  },
  reducers: {
    setLoader: (state, action) => {
      state.loader = action.payload
    },
    setDownloadedFileStatus: (state, action) => {
      state.downloadedFileStatus = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCareerAspiration.fulfilled, (state, action) => {
      state.careerAspiration = action?.payload?.careerAspiration
      state.totalPages = action?.payload?.totalPages
      state.loader = false
      state.downloadedFileStatus = false
    })
  }
})

export const { setLoader, setDownloadedFileStatus } = careerAspiration.actions

export default careerAspiration.reducer
