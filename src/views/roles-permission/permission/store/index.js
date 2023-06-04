// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import { baseUrl } from '../../../../app.config'
import { getUserData } from '../../../../utility/Utils'

export const permissionByModule = createAsyncThunk(
  'permissions/permissionByModule',
  async (params) => {
    const response = await axios.get(baseUrl() + '/permissions/byModule', {
      params
    })
    const list = response.data.data.map((temp) => {
      var obj = { ...temp, checked: null }
      obj.permissionList = temp.permissionList.map((item) => {
        return {
          ...item,
          checked: false
        }
      })
      return {
        ...obj,
        checked: false
      }
    })
    return {
      permissionListByModule: list
    }
  }
)

export const getAllPermissionList = createAsyncThunk(
  'permissions/getAllPermissionList',
  async (params) => {
    try {
      const response = await axios.get(baseUrl() + '/permissions', {
        params
      })

      const list = response.data.data.map((temp) => {
        return {
          ...temp,
          checked: null
        }
      })
      return {
        totalPages: response.data.count.total,
        params: response.data.params,
        permissions: list
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)

export const getPermissionAllList = createAsyncThunk(
  'permissions/getPermissionAllList',
  async (params) => {
    try {
      const response = await axios.get(baseUrl() + '/permissions/all', {
        params
      })
      const allList = response.data.data.map((temp) => {
        return {
          ...temp,
          checked: null
        }
      })

      return {
        //totalPages: response.data.count.total,
        //params: response.data.params,
        allPermissions: allList
      }
    } catch (e) {
      toast.error(e?.response?.data?.message)
    }
  }
)
export const addPermission = createAsyncThunk(
  'permissions/addPermission',
  async ({ permission, params }, { dispatch }) => {
    try {
      await axios.post(baseUrl() + '/permissions', {
        ...permission
      })
      toast.success('Permissions Added successfully')
      dispatch(getAllPermissionList({ ...params }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const updatePermission = createAsyncThunk(
  'permissions/updatePermission',
  async ({ permission, params, id }, { dispatch }) => {
    try {
      await axios.put(baseUrl() + `/permissions/${id}`, {
        ...permission
      })
      toast.success('Permissions Updated successfully')
      dispatch(getAllPermissionList({ ...params }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const deletePermission = createAsyncThunk(
  'permissions/deletePermission',
  async ({ id, pageNo, pageSize, search }, { dispatch }) => {
    dispatch(setLoader(true))
    try {
      await axios.delete(baseUrl() + `/permissions/${id}`),
        toast.success('Permissions Deleted successfully')
      dispatch(getAllPermissionList({ pageNo, pageSize, search: search }))
      return true
    } catch (error) {
      toast.error(error?.response?.data?.message)
      dispatch(setLoader(false))
      return false
    }
  }
)

export const permissionsSlice = createSlice({
  name: 'permissions',
  initialState: {
    permissions: [],
    allPermissions: [],
    permissionListByModule: [],
    reload: false,
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
    selectPermission: (state, action) => {
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

  extraReducers: {
    [addPermission.fulfilled]: (state, action) => {
      state.reload = !state.reload
    },
    [getAllPermissionList.fulfilled]: (state, action) => {
      state.permissions = action.payload?.permissions
      state.totalPages = action.payload?.totalPages
      state.loader = action.payload?.loader
    },
    [getPermissionAllList.fulfilled]: (state, action) => {
      state.allPermissions = action.payload.allPermissions
    },
    [permissionByModule.fulfilled]: (state, action) => {
      state.permissionListByModule = action.payload.permissionListByModule
    }
  }
})

export const {
  selectPermission,
  setLoader,
  setPageNo,
  setPageSize,
  setSearch
} = permissionsSlice.actions

export default permissionsSlice.reducer
