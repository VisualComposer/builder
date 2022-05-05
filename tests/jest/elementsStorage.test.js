/* global describe, test, expect */
import vcCake from 'vc-cake'
import '../../public/variables'

// Services & Storages
import '../../public/editor/services/dataManager/service.js'
import '../../public/editor/services/roleManager/service.js'
import '../../public/editor/services/utils/service.js'
import '../../public/editor/services/document/service.js'
import '../../public/editor/services/cook/service.js'
import '../../public/editor/services/modernAssetsStorage/service.js'
import '../../public/editor/services/api/service.js'
import '../../public/config/wp-attributes'
import '../../public/editor/stores/elements/elementsStorage'
import '../../public/editor/stores/elements/elementSettings'
import '../../public/editor/modules/elementLimit/module'

// Elements
import '../../elements/row/row/index'
import '../../elements/column/column/index'
import '../../elements/textBlock/textBlock/index'

jest.useFakeTimers()

describe('Test elementsStorage', () => {
  const elementsStorage = vcCake.getStorage('elements')
  const documentManager = vcCake.getService('document')
  const cook = vcCake.getService('cook')

  const id = '123456'
  const testText = 'This test text, it must work as expected!'

  vcCake.env('VCV_DEBUG', true)
  vcCake.start(() => {
    test('ElementStorage add textBlock', () => {
      elementsStorage.trigger('add', { tag: 'textBlock', id: id })
      const textBlock = documentManager.get(id)
      expect(textBlock.id).toBe(id)
    })

    test('ElementsStorage update textBlock text', () => {
      const textBlock = cook.get(documentManager.get(id))
      textBlock.set('output', testText)
      const data = textBlock.toJS()
      elementsStorage.trigger('update', id, data)
      // jest.runAllTimers()
      const element = documentManager.get(id)
      expect(element.output).toBe(testText)
    })

    test('ElementsStorage clone textBlock', () => {
      elementsStorage.trigger('clone', id)
      const textBlocks = documentManager.filter((data) => {
        return data.tag === 'textBlock'
      })
      expect(textBlocks.length).toBe(2)
    })
    test('ElementsStorage move column', () => {
      const columnID = '654321'
      const textBlock = documentManager.get(id)
      const textBlockParentColumn = documentManager.get(textBlock.parent)
      const parentRow = documentManager.get(textBlockParentColumn.parent)
      elementsStorage.trigger('add', { tag: 'column', id: columnID })
      elementsStorage.trigger('move', columnID, {
        action: 'append',
        related: parentRow.id
      })
      const rowChildren = documentManager.children(parentRow.id)
      expect(rowChildren.length).toBe(2)
    })
    test('ElementsStorage remove textBlock', () => {
      elementsStorage.trigger('remove', id)
      const textBlocks = documentManager.filter((data) => {
        return data.tag === 'textBlock'
      })
      expect(textBlocks.length).toBe(1)
    })
  })
})
