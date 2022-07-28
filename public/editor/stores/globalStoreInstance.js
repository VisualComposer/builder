import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

// This can be used outside of project -> devAddons, devElements
// vcCake.env('globalStore')
const globalStoreInstance = {
  getState: (key) => {
    if (key) {
      return store.getState()[key]
    }
    return null
  },
  addNotification: (data) => {
    store.dispatch(notificationAdded(data))
  }
}

export default globalStoreInstance
