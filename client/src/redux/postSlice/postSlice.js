import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '../../utils/authorizeAxios'
import { API_ROOT } from '../../utils/constants'
import { toast } from 'react-toastify'

const initialState = {
  currentPost: null
}

// Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng Middleware createAsyncThunk đi kèm với extraReducers

export const createPostAPI = createAsyncThunk(
  'post/createPostApi',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/create-post`, data)
    return response.data
  }
)
export const uploadFilePostAPI = createAsyncThunk(
  'post/uploadFilePostAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/upload-file`, data)
    return response.data
  }
)

// Khởi tạo một cái Slice trong kho lưu trữ - Redux Store
export const postSlice = createSlice({
  name: 'post',
  initialState,
  // Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  // ExtraReducers: Nơi xử lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(createPostAPI.fulfilled, (state, action) => {
      const post = action.payload
      state.currentPost = post
    })
    builder.addCase(uploadFilePostAPI.fulfilled, (state, action) => {
      const filePost = action.payload
      state.currentFilePost = filePost
    })
  }
})

// Selectors: Là nơi dành cho các components bên dưới gọi bằng hook useSelector() để lấy dữ liệu từ trong kho redux store ra sử dụng
export const selectCurrentPost = (state) => {
  return state.post.currentPost
}

export const selectCurrentFilePost = (state) => {
  return state.post.currentFilePost
}

export const postReducer = postSlice.reducer