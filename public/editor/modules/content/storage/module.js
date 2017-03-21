import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')
const utils = vcCake.getService('utils')

vcCake.add('storage', (api) => {
  const DocumentData = api.getService('document')
  const rebuildRawLayout = (id, layout) => {
    if (!layout) {
      layout = vcCake.getService('document').children(id)
        .map((element) => {
          return element.size || 'auto'
        })
    }
    let getLastInRow = (columns) => {
      let lastColumnIndex = []
      let rowValue = 0

      columns.forEach((col, index) => {
        let colValue = ''
        if (col === 'auto') {
          colValue = 0.03
        } else {
          if (col.indexOf('%') >= 0) {
            colValue = parseFloat(col.replace('%', '').replace(',', '.')) / 100
          } else {
            let column = col.split('/')
            let numerator = column[ 0 ]
            let denominator = column[ 1 ]
            colValue = numerator / denominator
          }
        }

        let newRowValue = (rowValue + colValue).toString()
        newRowValue = newRowValue.slice(0, (newRowValue.indexOf('.')) + 4)

        if (newRowValue > 1) {
          lastColumnIndex.push(index - 1)
          rowValue = 0
        }

        if (!columns[ index + 1 ]) {
          lastColumnIndex.push(index)
        }

        rowValue += colValue
      })

      return lastColumnIndex
    }
    let lastColumns = getLastInRow(layout)
    let createdElements = []
    let columns = DocumentData.children(id)
    let lastColumnObject = null
    layout.forEach((size, i) => {
      let lastInRow = lastColumns.indexOf(i) >= 0
      let firstInRow = i === 0 || lastColumns.indexOf(i - 1) >= 0
      if (columns[ i ] !== undefined) {
        lastColumnObject = columns[ i ]
        lastColumnObject.size = size
        lastColumnObject.lastInRow = lastInRow
        lastColumnObject.firstInRow = firstInRow
        DocumentData.update(lastColumnObject.id, lastColumnObject)
        api.request('data:afterUpdate', lastColumnObject.id, lastColumnObject)
      } else {
        let createdElement = DocumentData.create({ tag: 'column', parent: id, size: size, lastInRow: lastInRow, firstInRow: firstInRow })
        createdElements.push(createdElement.id)
      }
    })
    api.request('data:afterAdd', createdElements)
    if (columns.length > layout.length) {
      let removingColumns = columns.slice(layout.length)
      removingColumns.forEach((column) => {
        let childElements = DocumentData.children(column.id)
        childElements.forEach((el) => {
          el.parent = lastColumnObject.id
          DocumentData.update(el.id, el)
          api.request('data:afterUpdate', el.id, el)
        })
        DocumentData.delete(column.id)
      })
    }
  }
  const isElementOneRelation = (parent) => {
    let element = DocumentData.get(parent)
    let children = cook.getChildren(element.tag)
    if (children.length === 1) {
      return children[ 0 ].tag
    }
    return false
  }
  const updateSubelementsIds = (element) => {
    let elementObject = Object.assign(element)
    let elementKeys = element.filter((k, v, s) => { return s.type === 'element' })
    elementKeys.forEach((k) => {
      let data = elementObject.get(k) || {}
      data.id = utils.createKey()
      elementObject.set(k, data)
    })
    return elementObject
  }
  api.reply('data:add', (elementData, wrap = true, options = {}) => {
    let createdElements = []
    let element = cook.get(elementData)
    if (vcCake.env('FIX_SUBELEMENT_ID')) {
      element = updateSubelementsIds(element)
    }
    if (wrap && !element.get('parent') && !element.relatedTo([ 'RootElements' ])) {
      let rowElement = DocumentData.create({ tag: 'row' })
      createdElements.push(rowElement.id)
      let columnElement = DocumentData.create({ tag: 'column', parent: rowElement.id })
      createdElements.push(columnElement.id)
      elementData.parent = columnElement.id
    }
    let data = DocumentData.create(elementData, {
      insertAfter: options && options.insertAfter ? options.insertAfter : false
    })
    createdElements.push(data.id)

    if (wrap && element.get('tag') === 'row') {
      let columnData = cook.get({ tag: 'column', parent: data.id })
      if (columnData) {
        let columnElement = DocumentData.create(columnData.toJS())
        createdElements.push(columnElement.id)
      }
    }
    if (data.tag === 'column') {
      rebuildRawLayout(data.parent)
    }
    if (data.tag === 'row') {
      rebuildRawLayout(data.id)
    }

    if (!options.silent) {
      api.request('data:afterAdd', createdElements)
      api.request('data:changed', DocumentData.children(false), 'add', data.id)
    }
  })
  api.reply('data:remove', (id) => {
    vcCake.setData('lockActivity', false)
    api.request('data:beforeRemove', id)
    let element = DocumentData.get(id)
    DocumentData.delete(id)
    if (element && element.parent && !DocumentData.children(element.parent).length && element.tag === isElementOneRelation(element.parent)) {
      DocumentData.delete(element.parent)
    }
    if (element.tag === 'column') {
      rebuildRawLayout(element.parent)
    }
    api.request('data:changed', DocumentData.children(false), 'remove')
  })

  api.reply('data:clone', (id) => {
    let dolly = DocumentData.clone(id)
    if (vcCake.env('FIX_SUBELEMENT_ID')) {
      let element = cook.get(dolly)
      element = updateSubelementsIds(element)
      dolly = element.toJS()
    }
    if (dolly.tag === 'column') {
      rebuildRawLayout(dolly.parent)
    }
    api.request('data:afterClone', dolly.id)
    api.request('data:changed', DocumentData.children(false), 'clone', dolly.id)
  })

  api.reply('data:update', (id, element) => {
    if (element.tag === 'row' && element.layout && element.layout.layoutData && element.layout.layoutData.length) {
      rebuildRawLayout(id, element.layout.layoutData)
      element.layout.layoutData = undefined
    }
    DocumentData.update(id, element)
    api.request('data:afterUpdate', id, element)
    api.request('data:changed', DocumentData.children(false), 'update', id)
  })
  api.reply('data:move', (id, data) => {
    let element = DocumentData.get(id)
    if (data.action === 'after') {
      DocumentData.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      DocumentData.appendTo(id, data.related)
    } else {
      DocumentData.moveBefore(id, data.related)
    }
    if (element.tag === 'column') {
      // rebuild previous column
      rebuildRawLayout(element.parent)
      // rebuild next column
      let newElement = DocumentData.get(id)
      rebuildRawLayout(newElement.parent)
    }
    api.request('data:changed', DocumentData.children(false), 'move', id)
  })
  api.reply('data:merge', (content) => {
    const substituteIds = {}
    Object.keys(content).sort((a, b) => {
      if (content[ a ].order === undefined || content[ b ].order === undefined) {
        return 0
      }
      if (content[ a ].order > content[ b ].order) {
        return 1
      }
      if (content[ a ].order < content[ b ].order) {
        return -1
      }
      return 0
    }).forEach((key) => {
      let element = content[ key ]
      let newId = utils.createKey()
      if (substituteIds[ element.id ]) {
        element.id = substituteIds[ element.id ]
      } else {
        substituteIds[ element.id ] = newId
        element.id = newId
      }
      if (element.parent && substituteIds[ element.parent ]) {
        element.parent = substituteIds[ element.parent ]
      } else if (element.parent && !substituteIds[ element.parent ]) {
        substituteIds[ element.parent ] = utils.createKey()
        element.parent = substituteIds[ element.parent ]
      }
      delete element.order
      api.request('data:add', element, false, { silent: true })
      api.request('data:afterAdd', [ element.id ])
    })
    api.request('data:changed', DocumentData.children(false), 'merge')
  })
  api.reply('data:reset', (content) => {
    DocumentData.reset(content || {})
    Object.keys(content).forEach((id) => {
      if (content[ id ].tag && content[ id ].tag === 'row') {
        rebuildRawLayout(id)
      }
    })
    api.request('data:changed', DocumentData.children(false), 'reset')
  })
  api.reply('app:add', (parent = null, tag = null, options) => {
    if (parent) {
      let oneTag = isElementOneRelation(parent)
      if (oneTag) {
        let data = cook.get({ tag: oneTag, parent: parent })
        window.setTimeout(() => { api.request('data:add', data.toJS(), true, options) }, 0)
      }
    }
  })
  api.reply('settings:update', (settings) => {
    if (settings.customStyles && settings.customStyles.global !== undefined) {
      vcCake.getData('globalAssetsStorage').setGlobalCss(settings.customStyles.global || '')
    }
    if (settings.customStyles && settings.customStyles.local !== undefined) {
      vcCake.getData('globalAssetsStorage').setCustomCss(settings.customStyles.local || '')
    }
    api.request('settings:changed', settings)
  })
})
