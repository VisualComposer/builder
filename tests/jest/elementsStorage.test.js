/* global describe, test, expect */
import vcCake from 'vc-cake'
// Services & Storages
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/document/service.js'
import '../../public/editor/services/hubElements/service.js'
import '../../public/editor/services/cook/service.js'
import '../../public/editor/services/api/service.js'
import '../../public/editor/stores/events/eventsStorage'
import '../../public/editor/stores/elements/elementsStorage'
// Elements
import './devElements/row'

describe('Test elementsStorage', () => {
  test('Test elementsStorage', () => {
    const id = '123456'
    vcCake.env('debug', true)
    vcCake.start(() => {
      const elementsStorage = vcCake.getStorage('elements')
      elementsStorage.trigger('add', {tag: 'row', id: id})
    }).end(() => {
      const documentManager = vcCake.getService('document')
      const row = documentManager.get(id)
      expect(row.id).toBe(id)
    })
  })
})
