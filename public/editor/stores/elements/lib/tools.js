
export const rebuildRawLayout = (id, layout, documentManager) => {
  let elements = []
  let columns = documentManager.children(id)
  let lastColumnObject = null
  layout.forEach((size, i) => {
    if (columns[ i ] !== undefined) {
      lastColumnObject = columns[ i ]
      lastColumnObject.size = size
      // api.request('data:update', lastColumnObject.id, lastColumnObject)
      documentManager.update(lastColumnObject.id, lastColumnObject)
      elements.push([lastColumnObject, 'update'])
    } else {
      let createdElement = documentManager.create({ tag: 'column', parent: id, size: size })
      elements.push([createdElement, 'add'])
    }
  })
  /*
   api.request('data:afterAdd', createdElements)
   */
  if (columns.length > layout.length) {
    let removingColumns = columns.slice(layout.length)
    removingColumns.forEach((column) => {
      let childElements = documentManager.children(column.id)
      childElements.forEach((el) => {
        el.parent = lastColumnObject.id
        documentManager.update(el.id, el)
        // elements.push([el.id, 'create'])
      })
      // api.request('data:remove', column.id)
      documentManager.delete(column.id)
      elements.push([column, 'remove'])
    })
  }
  return elements
}
export const addRowBackground = (id, element, documentManager) => {
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

  let rowChildren = documentManager.children(id)

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
  documentManager.update(id, element)
}

export const isElementOneRelation = (parent, documentManager, cook) => {
  let element = documentManager.get(parent)
  let children = cook.getChildren(element.tag)
  if (children.length === 1) {
    return children[ 0 ].tag
  }
  return false
}
