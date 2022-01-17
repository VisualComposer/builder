/* global describe, test, expect */
import vcCake from 'vc-cake'

// Services & Storages
import '../../public/editor/services/dataManager/service.js'
import '../../public/editor/services/roleManager/service.js'
import '../../public/editor/services/utils/service.js'
import store from 'public/editor/stores/store'
import {notificationAdded, notificationRemoved, portalChanged} from 'public/editor/stores/notifications/slice'

describe('Test notifications store', () => {
  vcCake.env('debug', true)
  vcCake.start(() => {
    let notificationId = null
    test('notificationsAdded', () => {
      const testData = {
        text: 'This test notification text',
        time: 5000
      }

      const copiedData = Object.assign({}, testData)

      store.dispatch(notificationAdded(testData))
      let notificationsState = store.getState().notifications.list
      let notificationData = Object.assign({}, notificationsState[ 0 ])

      expect(!!notificationData.id).toEqual(true)
      notificationId = notificationData.id
      delete notificationData.id

      expect(notificationData).toEqual(copiedData)
    })

    test('notificationsRemoved', () => {
      store.dispatch(notificationRemoved(notificationId))
      const notificationsState = store.getState().notifications.list
      expect(notificationsState).toEqual([])
    })

    test('portalChanged', () => {
      let portalData = '.test-selector'
      store.dispatch(portalChanged(portalData))
      const portalState = store.getState().notifications.portal
      expect(portalState).toEqual(portalData)
    })

    test('notifications store limiter', () => {
      for (let i = 0; i < 15; i++) {
        const testData = {
          text: 'This test notification text',
          time: 5000
        }
        store.dispatch(notificationAdded(testData))
      }

      let notificationsState = store.getState().notifications.list
      expect(notificationsState.length).toEqual(5)
    })
  })
})
