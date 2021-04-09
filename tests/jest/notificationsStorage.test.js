/* global describe, test, expect */
import vcCake from 'vc-cake'

// Services & Storages
import '../../public/editor/services/dataManager/service.js'
import '../../public/editor/services/roleManager/service.js'
import '../../public/editor/services/utils/service.js'
import '../../public/editor/stores/notifications/storage'

describe('Test notificationsStorage', () => {
  const notificationsStorage = vcCake.getStorage('notifications')
  vcCake.env('debug', true)
  vcCake.start(() => {
    let notificationId = null
    test('notificationsStorage add', () => {
      const testData = {
        position: 'bottom',
        transparent: true,
        rounded: true,
        text: 'This test notification text',
        time: 5000
      }

      const copiedData = Object.assign({}, testData)

      notificationsStorage.trigger('add', testData)
      let notificationsState = notificationsStorage.state('notifications').get()
      let notificationData = Object.assign({}, notificationsState[ 0 ])

      expect(!!notificationData.id).toEqual(true)
      notificationId = notificationData.id
      delete notificationData.id

      expect(notificationData).toEqual(copiedData)
    })

    test('notificationsStorage remove', () => {
      notificationsStorage.trigger('remove', notificationId)
      const notificationsState = notificationsStorage.state('notifications').get()
      expect(notificationsState).toEqual([])
    })

    test('notificationsStorage portal change', () => {
      let portalData = '.test-selector'
      notificationsStorage.trigger('portalChange', portalData)
      const portalState = notificationsStorage.state('portal').get()
      expect(portalState).toEqual(portalData)
    })

    test('notificationsStorage limiter', () => {
      for (let i = 0; i < 15; i++) {
        const testData = {
          position: 'bottom',
          transparent: true,
          rounded: true,
          text: 'This test notification text',
          time: 5000
        }
        notificationsStorage.trigger('add', testData)
      }

      let notificationsState = notificationsStorage.state('notifications').get()
      expect(notificationsState.length).toEqual(10)
    })
  })
})
