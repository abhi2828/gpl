import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const fetchSponsorList = createAsyncThunk(
  'sponsorMaster/fetchSponsorList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/sponsor', { params })
      return {
        sponsorList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const getSponsorList = createAsyncThunk(
  'sponsorMaster/getSponsorList',
  async (params) => {
    try {
      const response = await axios.get(baseUrl() + '/sponsor', { params })
      return {
        getList: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchAllSponsor = createAsyncThunk(
  'sponsorMaster/fetchAllSponsor',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/sponsor')
      return {
        allSponsor: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addSponsor = createAsyncThunk(
  'sponsorMaster/addSponsor',
  async ({ sponsorName, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/sponsor', { ...sponsorName })
      toast.success('Sponsor added successfully')
      dispatch(fetchSponsorList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editSponsor = createAsyncThunk(
  'sponsorMaster/editSponsor',
  async ({ id, sponsorName, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/sponsor/${id}`, sponsorName)
      toast.success('Sponsor edited successfully')
      dispatch(fetchSponsorList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteSponsor = createAsyncThunk(
  'sponsorMaster/deleteSponsor',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/sponsor/${id}`)
      toast.success('Sponsor deleted successfully')
      dispatch(fetchSponsorList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const sponsorMaster = createSlice({
  name: 'sponsorMaster',
  initialState: {
    sponsorList: [],
    getList: [],
    allSponsor: [],
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
    selectSponsor: (state, action) => {
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
    builder.addCase(fetchSponsorList.fulfilled, (state, action) => {
      state.sponsorList = action?.payload?.sponsorList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
    builder.addCase(fetchAllSponsor.fulfilled, (state, action) => {
      state.allSponsor = action?.payload?.allSponsor
      state.loader = false
    })
    builder.addCase(getSponsorList.fulfilled, (state, action) => {
      state.getList = action?.payload?.getList
    })
  }
})

export const { selectSponsor, setLoader, setPageNo, setPageSize, setSearch } =
  sponsorMaster.actions

export default sponsorMaster.reducer
