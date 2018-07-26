/* global describe, test, expect */
import vcCake from 'vc-cake'
import '../../public/default-variables'

// Services & Storages
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/document/service.js'
import '../../public/editor/services/hubElements/service.js'
import '../../public/editor/services/cook/service.js'
import '../../public/editor/services/api/service.js'
import '../../public/editor/stores/elements/elementsStorage'
import '../../public/config/wp-attributes'

// Elements
import './devElements/row'
import './devElements/column'
import './devElements/textBlock'

describe('Test elementsStorage', () => {
  const elementsStorage = vcCake.getStorage('elements')
  const documentManager = vcCake.getService('document')
  const cook = vcCake.getService('cook')

  const id = '123456'
  const testText = 'This test text, it must work as expected!'

  vcCake.env('debug', true)
  vcCake.start(() => {
    elementsStorage.trigger('add', { tag: 'textBlock', id: id })
    test('ElementStorage add textBlock', () => {
      const textBlock = documentManager.get(id)
      expect(textBlock.id).toBe(id)
    })
    test('ElementsStorage update textBlock text', () => {
      const textBlock = cook.get(documentManager.get(id))
      textBlock.set('output', testText)
      const data = textBlock.toJS()
      elementsStorage.trigger('update', id, data)
      const element = documentManager.get(id)
      expect(element.output).toBe(testText)
    })
    test('ElementsStorage remove textBlock', () => {
      elementsStorage.trigger('remove', id)
      const textBlocks = documentManager.filter((data) => {
        return data.get('tag') === 'textBlock'
      })
      expect(textBlocks.length).toBe(0)
    })
  })
})
