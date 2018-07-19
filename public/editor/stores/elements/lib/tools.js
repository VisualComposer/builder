import vcCake from 'vc-cake'
import lodash from 'lodash'
const elementsStorage = vcCake.getStorage('elements')

export const rebuildRawLayout = (id, data = {}, documentManager, options) => {
  let elements = []
  let columns = documentManager.children(id)
  let newColumns = []
  const devices = [ 'all', 'xs', 'sm', 'md', 'lg', 'xl' ]
  let layouts = data.layout
  let defaultColumnData = {tag: 'column', parent: id, designOptionsAdvanced: {}, customClass: '', customHeaderTitle: '', metaCustomId: '', dividers: {}, sticky: {}, lastInRow: {}, firstInRow: {}, size: {}}
  let createdColumns = []
  const disableStacking = data && data.hasOwnProperty('disableStacking') ? data.disableStacking : false
  let lastColumnObject = null

  if (!layouts) {
    layouts = {}

    const rowChildren = documentManager.children(id)

    // Get layout for 'all'
    rowChildren.forEach((element) => {
      if (element.size['all']) {
        if (!layouts.hasOwnProperty('all')) {
          layouts.all = []
        }
        layouts['all'].push(element.size['all'])
      }
    })

    if (!layouts.hasOwnProperty('all')) { // Get layout for devices, if 'all' is not defined
      devices.forEach((device) => {
        rowChildren.forEach((element) => {
          if (element.size[device]) {
            if (!layouts.hasOwnProperty(device)) {
              layouts[device] = []
            }
            layouts[device].push(element.size[device])
          }
        })
      })
    }
  }

  Object.keys(layouts).forEach((device) => {
    let layout = layouts[ device ]
    if (layout && layout.length) {
      if (data.action === 'columnAdd' || data.action === 'columnClone') {
        let prevLayout = layout.slice()
        prevLayout.pop()
        let rowData = getRowData(prevLayout)
        if (data.columnSize && data.columnSize[ device ] !== '100%' && data.columnSize[ device ] !== undefined) {
          layout = prevLayout
          layout.push(data.columnSize[ device ])
        } else if ((Math.round(rowData.rowValue * 100) / 100) < 1) {
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

      if (data.action === 'columnRemove' && data.size[ device ]) {
        let prevLayout = layout.slice()
        prevLayout.push(data.size[ device ])
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

    const lastColumns = getRowData(layout).lastColumnIndex
    let createdColCount = 0
    layout.forEach((size, i) => {
      const lastInRow = lastColumns.indexOf(i) > -1
      const firstInRow = i === 0 || lastColumns.indexOf(i - 1) > -1

      if (columns[ i ] !== undefined) {
        lastColumnObject = columns[ i ]
        lastColumnObject.size[ device ] = size
        lastColumnObject.lastInRow[ device ] = lastInRow
        lastColumnObject.firstInRow[ device ] = firstInRow
        lastColumnObject.disableStacking = disableStacking
        newColumns.push(lastColumnObject)
      } else {
        if (!createdColumns[createdColCount]) {
          let createdColumnData = lodash.defaultsDeep({}, defaultColumnData)
          createdColumnData.size[device] = size
          createdColumnData.lastInRow[ device ] = lastInRow
          createdColumnData.firstInRow[device] = firstInRow
          createdColumnData.disableStacking = disableStacking
          createdColumns.push(createdColumnData)
        } else {
          let createdColumnData = createdColumns[createdColCount]
          createdColumnData.size[device] = size
          createdColumnData.lastInRow[ device ] = lastInRow
          createdColumnData.firstInRow[device] = firstInRow
          createdColumnData.disableStacking = disableStacking
        }
        createdColCount += 1
      }
    })
  })

  newColumns.forEach((col) => {
    if (!layouts.hasOwnProperty('all')) {
      delete col.size['all']
    } else {
      delete col.size['xs']
      delete col.size['sm']
      delete col.size['md']
      delete col.size['lg']
      delete col.size['xl']
    }
    documentManager.update(col.id, col)
    elements.push([ col, 'update' ])
  })

  createdColumns.forEach((newCol) => {
    let createdCol = documentManager.create(newCol)
    elements.push([ createdCol, 'add' ])
  })

  let defaultLayout = layouts[ 'all' ] || layouts[ 'xs' ]

  if (columns.length > defaultLayout.length) {
    let removingColumns = columns.slice(defaultLayout.length)
    removingColumns.forEach((column) => {
      let childElements = documentManager.children(column.id)
      childElements.forEach((el) => {
        el.parent = lastColumnObject.id
        documentManager.update(el.id, el)
      })
      documentManager.delete(column.id)
      elements.push([ column, 'remove' ])
    })
  }
  elementsStorage.state('rebuildRow').set(true)
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
