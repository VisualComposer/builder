/* global describe, test, expect */
import vcCake from 'vc-cake'
// Services & Storages
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/document/service.js'
import '../../public/editor/services/hubElements/service.js'
import '../../public/editor/services/cook/service.js'
import '../../public/editor/services/api/service.js'
import '../../public/editor/stores/elements/elementsStorage'
// Elements
import './devElements/row'
import './devElements/column'
import './devElements/textBlock'

describe('Test elementsStorage', () => {
  test('Test elementsStorage', () => {
    const id = '123456'
    vcCake.env('debug', true)
    vcCake.start(() => {
      const elementsStorage = vcCake.getStorage('elements')
      elementsStorage.trigger('add', {tag: 'textBlock', id: id}, false)
    }).end(() => {
      const documentManager = vcCake.getService('document')
      const textBlock = documentManager.get(id)
      expect(textBlock.id).toBe(id)
    })
  })
})
