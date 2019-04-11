import axios from 'axios'

export async function fetchDetails ({ commit }, payload) {
  try {
    let resp = await axios.get('api/user/details')
    let data = resp.data
    commit('setDetails', { details: data })
    return Promise.resolve(resp)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function updateEmail ({ commit }, payload) {
  try {
    let resp = await axios.post('api/user/email/update', payload)
    commit('setDetails', resp.data.data)
    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function updateBasicDetails ({ commit }, payload) {
  try {
    let resp = await axios.post('api/user/basic-details/update', payload)
    commit('setDetails', resp.data.data)
    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function updatePassword ({ commit }, payload) {
  try {
    let resp = await axios.post('api/user/password/update', payload)
    if (resp.data.status === 'ok') {
      commit('setDetails', resp.data.data)
    }
    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function fetchList ({ commit }, payload) {
  try {
    let sortType = payload.pagination.descending === true ? 'Descending' : 'Ascending'
    let page = payload.pagination.page
    let perPage = payload.pagination.rowsPerPage
    let sortBy = payload.pagination.sortBy
    let searchUserName = payload.filter

    let resp = await axios.get('api/user/all', {
      params: {
        page: page,
        per_page: perPage,
        search_user_name: searchUserName,
        sort_type: sortType,
        sort_by: sortBy
      }
    })

    // let listData = resp.data.data
    // let listMeta = resp.data.meta

    // commit('setList', listData)
    // commit('setMeta', listMeta)

    return Promise.resolve(resp)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function updateName ({ commit }, payload) {
  try {
    let resp = await axios.post('api/user/name/update', payload)
    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function deleteUsers ({ commit }, payload) {
  try {
    let resp = await axios.post('api/user/delete', payload)
    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}
