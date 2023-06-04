import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../app.config'

export const getBusinessData = createAsyncThunk(
  'business/getBusinessData',
  async (params, { dispatch }) => {
    const response = await axios.get(baseUrl() + '/business', {
      params
    })
    return {
      params: response.data.params,
      roles: response.data.data
    }
  }
)

export const businessSlice = createSlice({
  name: 'business',
  initialState: {
    business: [],
    loader: false,
    params: {},
    selected: null
  },
  reducers: {
    selectBusiness: (state, action) => {
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
    builder.addCase(getBusinessData.fulfilled, (state, action) => {
      state.business = action.payload.business
    })
  }
})

export const { selectBusiness, setLoader } = businessSlice.actions

export default businessSlice.reducer
