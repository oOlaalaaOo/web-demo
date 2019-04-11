export function setDetails (state, data) {
  state.details = data.details
}

export function setList (state, data) {
  state.list = data
}

export function setMeta (state, data) {
  state.meta = data
}

export function clearList (state) {
  state.list = []
  state.meta = {}
}
