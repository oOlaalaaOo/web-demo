export function setList (state, data) {
  state.list = data
}

export function pushList (state, data) {
  state.list.push(data)
}

export function setMeta (state, data) {
  state.meta = data
}

export function setDetails (state, data) {
  state.details = data
}

export function clearList (state) {
  state.list = []
  state.meta = {}
}
