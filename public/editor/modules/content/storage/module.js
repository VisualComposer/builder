import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')
const wipAssetsStorage = vcCake.getService('wipAssetsStorage')
const utils = vcCake.getService('utils')

vcCake.add('storage', (api) => {
  const DocumentData = api.getService('document')
  const rebuildRawLayout = (id, layout) => {
    let createdElements = []
    let columns = DocumentData.children(id)
    let lastColumnObject = null
    layout.forEach((size, i) => {
      if (columns[ i ] !== undefined) {
        lastColumnObject = columns[ i ]
        lastColumnObject.size = size
        api.request('data:update', lastColumnObject.id, lastColumnObject)
      } else {
        let createdElement = DocumentData.create({ tag: 'column', parent: id, size: size })
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
          api.request('data:update', el.id, el)
        })
        api.request('data:remove', column.id)
      })
    }
  }
  const addRowBackground = (id, element) => {
    let allBackgrounds = []

    let devices = {
      'desktop': 'xl',
      'tablet-landscape': 'lg',
      'tablet-portrait': 'md',
      'mobile-landscape': 'sm',
      'mobile-portrait': 'xs'
    }

    const pushBackground = (element) => {
      let designOptions = element.designOptions
      let elementBackground = {}
      if (designOptions && designOptions.used) {
        if (designOptions.deviceTypes === 'all' && (designOptions.all.backgroundColor !== '' || designOptions.all.backgroundImage.urls.length)) {
          elementBackground[ 'all' ] = true
        } else {
          for (let device in devices) {
            if ((designOptions[ device ].backgroundColor !== '' || designOptions[ device ].backgroundImage.urls.length)) {
              elementBackground[ devices[ device ] ] = true
            }
          }
        }
        allBackgrounds.push(elementBackground)
      }
    }

    let rowChildren = DocumentData.children(id)

    rowChildren.forEach((column) => {
      pushBackground(column)
    })

    pushBackground(element)

    let rowBackground = allBackgrounds.reduce(function (result, currentObject) {
      for (let key in currentObject) {
        if (currentObject.hasOwnProperty(key)) {
          result[ key ] = currentObject[ key ]
        }
      }
      return result
    }, {})

    element.background = rowBackground
    DocumentData.update(id, element)
  }
  const isElementOneRelation = (parent) => {
    let element = DocumentData.get(parent)
    let children = cook.getChildren(element.tag)
    if (children.length === 1) {
      return children[ 0 ].tag
    }
    return false
  }
  api.reply('data:add', (elementData, wrap = true, options = {}) => {
    let createdElements = []
    let element = cook.get(elementData)
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
    api.request('data:changed', DocumentData.children(false), 'remove')
  })

  api.reply('data:clone', (id) => {
    let dolly = DocumentData.clone(id)
    api.request('data:afterClone', dolly.id)
    api.request('data:changed', DocumentData.children(false), 'clone', dolly.id)
  })

  api.reply('data:update', (id, element) => {
    if (element.tag === 'row' && element.layout && element.layout.length) {
      rebuildRawLayout(id, element.layout)
      if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
        element.rowLayout = element.layout
        element.size = element.layout
      }
      element.layout = undefined
    }
    DocumentData.update(id, element)
    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      if (element.tag === 'column') {
        let parentId = DocumentData.get(id).parent
        let parentElement = DocumentData.get(parentId)

        if (parentElement) {
          addRowBackground(parentId, parentElement)
        }
      }
      if (element.tag === 'row') {
        addRowBackground(id, element)
      }
    }
    api.request('data:afterUpdate', id, element)
    api.request('data:changed', DocumentData.children(false), 'update', id)
  })
  api.reply('data:move', (id, data) => {
    if (data.action === 'after') {
      DocumentData.moveAfter(id, data.related)
    } else if (data.action === 'append') {
      DocumentData.appendTo(id, data.related)
    } else {
      DocumentData.moveBefore(id, data.related)
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
      wipAssetsStorage.setGlobalCss(settings.customStyles.global || '')
    }
    if (settings.customStyles && settings.customStyles.local !== undefined) {
      wipAssetsStorage.setCustomCss(settings.customStyles.local || '')
    }
    api.request('settings:changed', settings)
  })
})
