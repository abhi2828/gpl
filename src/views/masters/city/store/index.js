import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const getCityData = createAsyncThunk(
  'city/getCityData',
  async (params, { dispatch }) => {
    const response = await axios.get(baseUrl() + '/business', {
      params
    })
    return {
      params: response.data.params,
      city: response.data.data
    }
  }
)

export const citySlice = createSlice({
  name: 'city',
  initialState: {
    city: [],
    loader: false,
    params: {},
    selected: null
  },
  reducers: {
    selectCity: (state, action) => {
      if (action.payload === null) {
        state.selected = null
      } else {
        state.selected = action.payload
      }
    },
    setLoader: (state, action) => {
      state.loader = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getCityData.fulfilled, (state, action) => {
      state.city = action.payload.city
    })
  }
})

export const { selectCity, setLoader } = citySlice.actions

export default citySlice.reducer
