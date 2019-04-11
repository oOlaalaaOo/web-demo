import axios from 'axios'
import { LocalStorage } from 'quasar'

export async function login ({ commit }, payload) {
  try {
    let resp = await axios.post('oauth/token', {
      username: payload.email,
      password: payload.password,
      client_id: 2,
      client_secret: 'kXnr1IsI1bT731GapR4bdvzNkjs8yys50XtCsBEy',
      grant_type: 'password'
    })
    let accessToken = resp.data.access_token
    commit('setAccessToken', { accessToken: accessToken })
    setAxiosHeaders(accessToken)
    return Promise.resolve(resp)
  } catch (err) {
    return Promise.reject(err)
  }
}

function setAxiosHeaders (accessToken) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
  LocalStorage.set('accessToken', accessToken)
}

export function logout ({ commit }) {
  LocalStorage.remove('accessToken')
  commit('logout')
}

export async function signUp ({ commit }, payload) {
  try {
    let resp = await axios.post('api/user/sign-up', payload)
    return Promise.resolve(resp)
  } catch (err) {
    return Promise.reject(err)
  }
}
