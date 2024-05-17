import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from '../utils/formatter'
import { refreshTokenAPI } from '../common'
import { logoutUserAPI } from '../redux/userSlice/userSlice'

let axiosReduxStore
export const injectStore = mainStore => {
  axiosReduxStore = mainStore
}
let authorizedAxiosInstance = axios.create()
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use((config) => {
  interceptorLoadingElements(true)

  return config
}, (error) => {
  return Promise.reject(error)
})


let refreshTokenPromise = null

authorizedAxiosInstance.interceptors.response.use((response) => {
  interceptorLoadingElements(false)

  return response
}, (error) => {

  interceptorLoadingElements(false)

  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }

  const originalRequests = error.config
  if (error.response?.status === 410 && !originalRequests._retry) {
    originalRequests._retry = true

    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        .then(data => {
          return data?.accessToken
        })
        .catch(() => {
          axiosReduxStore.dispatch(logoutUserAPI(false))
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    // eslint-disable-next-line no-unused-vars
    return refreshTokenPromise.then(accessToken => {
      return authorizedAxiosInstance(originalRequests)
    })

  }

  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance

