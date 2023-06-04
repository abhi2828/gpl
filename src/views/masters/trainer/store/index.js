import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const fetchTrainerList = createAsyncThunk(
  'trainerMaster/fetchTrainerList',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/trainer', { params })
      return {
        trainerList: response?.data?.data,
        totalPages: response?.data?.count?.total
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const getDropdownList = createAsyncThunk(
  'trainerMaster/getDropdownList',
  async (params) => {
    try {
      const response = await axios.get(baseUrl() + '/trainer', { params })
      return {
        dropdownList: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const fetchAllTrainer = createAsyncThunk(
  'trainerMaster/fetchAllTrainer',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/trainer')
      return {
        allTrainer: response?.data?.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const addTrainer = createAsyncThunk(
  'trainerMaster/addTrainer',
  async ({ TrainerName, params }, { dispatch }) => {
    try {
      const response = await axios.post(baseUrl() + '/trainer', {
        ...TrainerName
      })
      toast.success(response?.data?.message)
      dispatch(fetchTrainerList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const editTrainer = createAsyncThunk(
  'trainerMaster/editTrainer',
  async ({ id, TrainerName, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/trainer/${id}`, { ...TrainerName })
      toast.success('Trainer edited successfully!')
      dispatch(fetchTrainerList({ ...params }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteTrainer = createAsyncThunk(
  'trainerMaster/deleteTrainer',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      const response = await axios.delete(baseUrl() + `/trainer/${id}`)
      toast.success(response?.data?.message)
      dispatch(fetchTrainerList({ pageNo, pageSize, search: search }))
      return true
    } catch (e) {
      toast.error(e?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const trainerMaster = createSlice({
  name: 'trainerMaster',
  initialState: {
    trainerList: [],
    dropdownList: [],
    allTrainer: [],
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
    selectTrainer: (state, action) => {
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
    builder.addCase(fetchTrainerList.fulfilled, (state, action) => {
      state.trainerList = action?.payload?.trainerList
      state.totalPages = action?.payload?.totalPages
      state.loader = false
    })
    builder.addCase(getDropdownList.fulfilled, (state, action) => {
      state.dropdownList = action?.payload?.dropdownList
    })
    builder.addCase(fetchAllTrainer.fulfilled, (state, action) => {
      state.allTrainer = action?.payload?.allTrainer
    })
  }
})

export const { selectTrainer, setLoader, setPageNo, setPageSize, setSearch } =
  trainerMaster.actions

export default trainerMaster.reducer
