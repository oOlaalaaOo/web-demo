import axios from 'axios'

export default async ({ Vue, store, router }) => {
  axios.defaults.baseURL = 'http://localhost:8000/'

  if (store.getters['auth/isLoggedIn']) {
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + store.getters['auth/accessToken']
  }
  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent
      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )
  // Add a response interceptor
  axios.interceptors.response.use(
    function (response) {
      return response
    },
    function (error) {
      if (error.response.statusText === 'Unauthorized') {
        router.push('/login')
      }
      if (error.response.data.message === 'Unauthenticated.') {
        store.dispatch('auth/logout')
        router.push('/login')
      }
      if (error.response.data.error && error.response.data.error === 'Token has expired') {
        store.dispatch('auth/logout')
        router.push('/login')
      }
      return Promise.reject(error)
    }
  )

  Vue.prototype.$axios = axios
}
