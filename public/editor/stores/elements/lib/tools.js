
export const rebuildRawLayout = (id, data = {}, documentManager) => {
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
      elements.push([lastColumnObject, 'update'])
    } else {
      let createdElement = documentManager.create({ tag: 'column', parent: id, size: size, lastInRow: lastInRow, firstInRow: firstInRow })
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