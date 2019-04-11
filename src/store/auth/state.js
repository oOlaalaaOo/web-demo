import { LocalStorage } from 'quasar'

export default {
  accessToken: null || LocalStorage.getItem('accessToken'),
  isAdmin: false
}
