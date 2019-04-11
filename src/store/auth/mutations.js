export function setAccessToken (state, data) {
  state.accessToken = data.accessToken
}

export function logout (state) {
  state.accessToken = null
}
