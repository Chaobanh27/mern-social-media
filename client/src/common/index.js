import { API_ROOT } from '../utils/constants'
import authorizedAxiosInstance from '../utils/authorizeAxios'
import { toast } from 'react-toastify'

//User
export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!', { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`${API_ROOT}/api/users/verify`, data)
  toast.success('Account verified successfully! Now you can login to enjoy our services! Have a good day!', { theme: 'colored' })
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await authorizedAxiosInstance.get(`${API_ROOT}/api/users/refresh_token`)
  return response.data
}

export const suggestedFriendsAPI = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/suggested-friends`)
  return response.data
}

export const friendRequestAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/friend-request`, data)
  toast.success('the request has been sent successfully!', { theme: 'colored' })
  return response.data
}

export const getFriendRequestAPI = async () => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/get-friend-request`)
  return response.data
}

export const accectFriendRequestAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/users/accept-request`, data)
  toast.success('Accepted!', { theme: 'colored' })
  return response.data
}


//Post
export const getPostsAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/get-posts`, data)
  return response.data
}

export const getPostCommentAPI = async (id) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/get-comments/${id}`)
  return response.data
}

export const commentPostAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/comment/${id}`, data)
  toast.success('comment created successfully!', { theme: 'colored' })
  return response.data
}

export const replyPostCommentAPI = async (id, data) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/reply-comment/${id}`, data)
  toast.success('reply comment created successfully!', { theme: 'colored' })
  return response.data
}


export const likePostAPI = async (id) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/like/${id}`)
  return response.data
}

export const likePostCommentAPI = async (commentId, replyCommentId) => {
  const response = await authorizedAxiosInstance.post(`${API_ROOT}/api/posts/like-comment/${commentId}/${replyCommentId}`)
  return response.data
}

export const deletePostAPI = async (id) => {
  const response = await authorizedAxiosInstance.delete(`${API_ROOT}/api/posts/${id}`)
  toast.success('your post has been deleted!', { theme: 'colored' })
  return response.data
}