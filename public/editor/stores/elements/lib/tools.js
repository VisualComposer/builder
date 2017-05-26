export const rebuildRawLayout = (id, data = {}, documentManager, options) => {
  let elements = []
  let columns = documentManager.children(id)
  let layout = data.layout
  if (!layout) {
    layout = documentManager.children(id)
      .map((element) => {
        return element.size || '100%'
      })
    if (data.action === 'columnAdd' || data.action === 'columnClone') {
      let prevLayout = layout.slice()
      prevLayout.pop()
      let rowData = getRowData(prevLayout)

      if ((Math.round(rowData.rowValue * 100) / 100) < 1) {
        if (data.action === 'columnAdd') {
          let leftValue = 1 - rowData.rowValue
          layout = prevLayout
          layout.push(`${leftValue * 100}%`)
        }
      } else if (rowData.isColumnsEqual) {
        let colCount = layout.length
        let colSize = `${Math.floor(100 / colCount * 100) / 100}%`
        layout = []
        for (let i = 0; i < colCount; i++) {
          layout.push(colSize)
        }
      }
    }

    if (data.action === 'columnRemove' && data.size) {
      let prevLayout = layout.slice()
      prevLayout.push(data.size)
      let rowData = getRowData(prevLayout)

      if (((Math.round(rowData.rowValue * 100) / 100) === 1) && rowData.isColumnsEqual) {
        let colCount = layout.length
        let colSize = `${Math.floor(100 / colCount * 100) / 100}%`
        layout = []
        for (let i = 0; i < colCount; i++) {
          layout.push(colSize)
        }
      }
    }
  }
  let lastColumns = getRowData(layout).lastColumnIndex
  let lastColumnObject = null
  layout.forEach((size, i) => {
    let lastInRow = lastColumns.indexOf(i) > -1
    let firstInRow = i === 0 || lastColumns.indexOf(i - 1) > -1
    if (columns[ i ] !== undefined) {
      lastColumnObject = columns[ i ]
      lastColumnObject.size = size
      lastColumnObject.lastInRow = lastInRow
      lastColumnObject.firstInRow = firstInRow
      documentManager.update(lastColumnObject.id, lastColumnObject)
      // api.request('data:afterUpdate', lastColumnObject.id, lastColumnObject)
      elements.push([ lastColumnObject, 'update' ])
    } else {
      let createdElement = documentManager.create({ tag: 'column', parent: id, size: size, lastInRow: lastInRow, firstInRow: firstInRow })
      elements.push([ createdElement, 'add' ])
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
      elements.push([ column, 'remove' ])
    })
  }
  return elements
}
export const addRowColumnBackground = (id, element, documentManager, options) => {
  const rowSettings = documentManager.get(element.parent)
  const colSettings = element
  const rowChildren = documentManager.children(rowSettings.id)

  let columnBackgrounds = []

  const pushBackground = (element) => {
    const designOptions = element.designOptionsAdvanced
    let backgroundUsed = false
    let elementBackground = {}
    if (designOptions && designOptions.device) {
      let hasDeviceSettings = false

      for (let prop in designOptions.device) {
        if (designOptions.device.hasOwnProperty(prop)) {
          hasDeviceSettings = true
        }
      }

      if (!hasDeviceSettings) {
        return
      }

      if (designOptions.device.hasOwnProperty('all')) {
        const allSettings = designOptions.device.all
        if (allSettings.backgroundColor || (allSettings.images && allSettings.images.urls && allSettings.images.urls.length)) {
          elementBackground.all = true
          backgroundUsed = true
        }
      } else {
        for (let device in designOptions.device) {
          if (designOptions.device.hasOwnProperty(device)) {
            const deviceSettings = designOptions.device[ device ]
            if (deviceSettings.backgroundColor || (deviceSettings.images && deviceSettings.images.urls && deviceSettings.images.urls.length)) {
              elementBackground[ device ] = true
              backgroundUsed = true
            }
          }
        }
      }

      if (backgroundUsed) {
        columnBackgrounds.push(elementBackground)
      }
    }
  }

  rowChildren.forEach((column) => {
    if (colSettings && column.id === colSettings.id) {
      pushBackground(colSettings)
    } else {
      pushBackground(column)
    }
  })

  const reducedColBackgrounds = columnBackgrounds.reduce(function (result, currentObject) {
    for (let key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        result[ key ] = currentObject[ key ]
      }
    }
    return result
  }, {})

  rowSettings.columnBackground = reducedColBackgrounds
  documentManager.update(rowSettings.id, rowSettings)
}

export const isElementOneRelation = (parent, documentManager, cook) => {
  let element = documentManager.get(parent)
  let children = cook.getChildren(element.tag)
  if (children.length === 1) {
    return children[ 0 ].tag
  }
  return false
}

export const getRowData = (layout, documentManager) => {
  let lastColumnIndex = []
  let rowValue = 0
  let autoCount = 0
  let columnValues = []
  let isColumnsEqual = true

  layout.forEach((col, index) => {
    let colValue = 0
    if (col === 'auto') {
      colValue = 0.01
      columnValues.push('auto')
      autoCount++
    } else {
      if (col.indexOf('%') > -1) {
        colValue = parseFloat(col.replace('%', '').replace(',', '.')) / 100
      } else {
        let column = col.split('/')
        let numerator = column[ 0 ]
        let denominator = column[ 1 ]
        colValue = numerator / denominator
      }
      columnValues.push(colValue)
    }

    let newRowValue = Math.floor((rowValue + colValue) * 1000) / 1000

    if (newRowValue > 1) {
      isColumnsEqual = false
      lastColumnIndex.push(index - 1)
      rowValue = 0
    }
    if (!layout[ index + 1 ]) {
      lastColumnIndex.push(index)
    }
    rowValue += colValue
  })

  let rowFullValue = 0

  let newRowValue = rowValue - (autoCount * 0.01)
  let autoValue = (1 - newRowValue) / autoCount

  columnValues.forEach((size, index) => {
    if (size === 'auto') {
      columnValues[ index ] = autoValue
      rowFullValue += autoValue
    } else {
      rowFullValue += size
    }
  })

  columnValues.forEach((size) => {
    if (columnValues[ 0 ] !== size && size !== 1) {
      isColumnsEqual = false
    }
  })

  return {
    lastColumnIndex: lastColumnIndex,
    isColumnsEqual: isColumnsEqual,
    rowValue: rowFullValue
  }
}
