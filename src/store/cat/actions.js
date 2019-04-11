import axios from 'axios'

export async function fetchList ({ commit }, payload) {
  try {
    let page = 0
    let perPage = 6
    let searchCatName = null
    let sortType = 'Descending'

    if (payload) {
      if (payload.page) {
        page = payload.page
      }

      if (payload.perPage) {
        perPage = payload.perPage
      }

      if (payload.searchCatName) {
        searchCatName = payload.searchCatName
      }

      if (payload.sortType) {
        sortType = payload.sortType
      }
    }

    let resp = await axios.get('api/cat/all', {
      params: {
        page: page,
        per_page: perPage,
        search_cat_name: searchCatName,
        sort_type: sortType
      }
    })

    let listData = resp.data.data
    let listMeta = resp.data.meta

    commit('clearList')
    commit('setList', listData)
    commit('setMeta', listMeta)

    return Promise.resolve(resp)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function add ({ commit }, payload) {
  try {
    let resp = await axios.post('api/cat/add', payload)

    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function fetchDetails ({ commit }, payload) {
  try {
    let resp = await axios.get('api/cat/' + payload.id)
    commit('setDetails', resp.data.data)
    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function update ({ commit }, payload) {
  try {
    let resp = await axios.post('api/cat/update', payload)
    commit('setDetails', resp.data.data)
    return Promise.resolve(resp.data)
  } catch (err) {
    return Promise.reject(err)
  }
}
