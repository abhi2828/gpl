// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'

export const getRolesData = createAsyncThunk(
  'roles/getRolesData',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/roles', {
        params
      })
      return {
        totalPages: response.data.count.total,
        params: response.data.params,
        roles: response.data.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const getRolesDropdown = createAsyncThunk(
  'roles/getRolesDropdown',
  async (params, { dispatch }) => {
    try {
      const response = await axios.get(baseUrl() + '/roles')
      return {
        rolesDropdown: response.data.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const getRolesDataById = createAsyncThunk(
  'roles/getRolesDataById',
  async (id) => {
    try {
      const response = await axios.get(baseUrl() + `/roles/${id}/permissions`, {
        id
      })
      return {
        // totalPages: response.data.count.total,
        params: response.data.params,
        roles: response.data.data
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const getAllRoles = async () => {
  try {
    const response = await axios.get(baseUrl() + '/roles/all')
    return {
      roles: response.data.data
    }
  } catch (e) {
    toast.error(e?.response?.data?.message)
  }
}

export const addRoles = createAsyncThunk(
  'roles/addRoles',
  async ({ roleName, description, permissionId, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/roles', {
        roleName,
        description,
        permissionId
      })
      toast.success('Role Added successfully')
      dispatch(getRolesData({ ...params }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const updateRoles = createAsyncThunk(
  'roles/updateRoles',
  async ({ roleName, description, permissionId, id, params }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/roles/${id}`, {
        roleName,
        description,
        permissionId
      })
      toast.success('Role Updated successfully')
      dispatch(getRolesData({ ...params }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deleteRoles = createAsyncThunk(
  'roles/deleteRoles',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/roles/${id}`),
        toast.success('Role Deleted successfully')
      await dispatch(getRolesData({ pageNo, pageSize, search: search }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    rolesDropdown: [],
    loader: true,
    permissionsOfRole: [],
    totalPages: 0,
    params: {
      pageNo: 1,
      pageSize: 10,
      search: ''
    },
    selected: null
  },
  reducers: {
    selectRoles: (state, action) => {
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
    builder
      .addCase(getRolesData.fulfilled, (state, action) => {
        state.roles = action.payload?.roles
        state.totalPages = action.payload?.totalPages
        state.loader = action.payload?.loader
      })
      .addCase(getRolesDataById.fulfilled, (state, action) => {
        state.permissionsOfRole = action.payload?.roles
      }),
      builder.addCase(getRolesDropdown.fulfilled, (state, action) => {
        state.rolesDropdown = action.payload?.rolesDropdown
      })
  }
})

export const { selectRoles, setLoader, setPageNo, setPageSize, setSearch } =
  rolesSlice.actions

export default rolesSlice.reducer
