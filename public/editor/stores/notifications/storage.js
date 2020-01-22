import { addStorage, getService } from 'vc-cake'

const Utils = getService('utils')
const createKey = Utils.createKey

addStorage('notifications', (storage) => {
  storage.on('add', (data) => {
    const limit = 10
    if (!data) {
      return
    }
    if (data.cookie) {
      let cookieName = ''
      if (data.cookie.constructor === Object && data.cookie.name) {
        cookieName = data.cookie.name
      } else if (data.cookie.constructor === String) {
        cookieName = data.cookie
      }
      if (Utils.getCookie(cookieName)) {
        return
      }
    }
    const notifications = storage.state('notifications').get() || []
    if (!data.id) {
      data.id = createKey()
    } else if (notifications.find(item => item.id === data.id)) { // Already added notification
      return
    }
    notifications.push(data)

    if (notifications.length > limit) { // Remove first one if limit
      notifications.splice(0, 1)
    }

    storage.state('notifications').set(notifications)
  })

  storage.on('remove', (id) => {
    const notifications = storage.state('notifications').get()

    const removedItemIndex = notifications.findIndex(item => item.id === id)
    if (removedItemIndex >= 0) {
      const cookie = notifications[removedItemIndex].cookie
      if (cookie) {
        if (cookie.constructor === Object) {
          Utils.setCookie(cookie.name, true, cookie.expireInDays)
        } else if (cookie.constructor === String) {
          Utils.setCookie(cookie, true)
        }
      }

      notifications.splice(removedItemIndex, 1)
      storage.state('notifications').set(notifications)
    }
  })

  storage.on('portalChange', (selector) => {
    const portal = storage.state('portal').get()

    if (portal !== selector) {
      storage.state('portal').set(selector)
      // Remove all notifications on portal change
      storage.state('notifications').set([])
    }
  })
})
