import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const vcvAPI = vcCake.getService('api')

const documentManager = vcCake.getService('document')
const assetsStorage = vcCake.getStorage('assets')
const devices = [ 'all', 'defaultSize', 'xs', 'sm', 'md', 'lg', 'xl' ]

export default class RowElement extends vcvAPI.elementComponent {
  static getRowData (layout) {
    let lastColumnIndex = []
    let rowValue = 0
    let autoCount = 0
    let columnValues = []
    let isColumnsEqual = true
    let layoutCopy = layout.slice()

    // Remove last hide values
    while (layoutCopy.lastIndexOf('hide') === layoutCopy.length - 1 && layoutCopy.length) {
      isColumnsEqual = false
      layoutCopy.splice(layoutCopy.lastIndexOf('hide'), 1)
    }

    layoutCopy.forEach((col, index) => {
      let colValue = 0
      if (col === 'hide') {
        isColumnsEqual = false
      } else if (col === 'auto' || col === '') {
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

      if (newRowValue > 1 || (newRowValue === 1 && col === 'hide')) {
        isColumnsEqual = false
        lastColumnIndex.push(index - 1)
        rowValue = 0
      }
      if (layoutCopy[ index + 1 ] === undefined) {
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

  static resetRowLayout (id) {
    let rowElement = documentManager.get(id)
    rowElement.layout.layoutData = null
    documentManager.update(id, rowElement)
  }

  static getDefaultLayout (id, layoutData) {
    let defaultLayout = []
    if (layoutData && layoutData.hasOwnProperty('all')) {
      defaultLayout = layoutData.all.slice()
    } else {
      const rowChildren = documentManager.children(id)

      rowChildren.forEach((element) => {
        if (element.size.hasOwnProperty('defaultSize')) {
          defaultLayout.push(element.size[ 'defaultSize' ])
        }
      })
    }

    return defaultLayout
  }

  static setColumns (id, layoutData, prevLayoutData, disableStacking = false) {
    let columns = documentManager.children(id)
    let newColumns = []
    let createdColumns = []
    let defaultColumnData = { tag: 'column', parent: id, designOptionsAdvanced: {}, customClass: '', customHeaderTitle: '', metaCustomId: '', dividers: {}, sticky: {}, lastInRow: {}, firstInRow: {}, size: {} }
    let lastColumnObject = null

    Object.keys(layoutData).forEach((device) => {
      let layout = layoutData[ device ]
      const prevLayout = prevLayoutData && prevLayoutData[ device ]

      if (prevLayout && prevLayout.length) {
        if (layout.length > prevLayout.length) { // Column add
          let rowData = RowElement.getRowData(prevLayout)
          if ((Math.round(rowData.rowValue * 100) / 100) < 1) {
            let leftValue = 1 - rowData.rowValue
            layout = prevLayout
            layout.push(`${leftValue * 100}%`)
          } else if (rowData.isColumnsEqual) {
            let colCount = layout.length
            let colSize = `${Math.floor(100 / colCount * 100) / 100}%`
            layout = []
            for (let i = 0; i < colCount; i++) {
              layout.push(colSize)
            }
          }
        } else if (layout.length < prevLayout.length) { // Column remove
          let rowData = RowElement.getRowData(prevLayout)

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

      const lastColumns = RowElement.getRowData(layout).lastColumnIndex
      let createdColCount = 0

      layout.forEach((size, i) => {
        const lastInRow = lastColumns.indexOf(i) > -1
        const firstInRow = i === 0 || lastColumns.indexOf(i - 1) > -1

        if (columns[ i ] !== undefined) {
          lastColumnObject = columns[ i ]
          lastColumnObject.size[ device ] = size

          if (device !== 'defaultSize') {
            lastColumnObject.lastInRow[ device ] = lastInRow
            lastColumnObject.firstInRow[ device ] = firstInRow
          }
          lastColumnObject.disableStacking = disableStacking

          let oldCol = false
          newColumns.forEach((newCol, index) => {
            if (lastColumnObject.id === newCol.id) {
              newColumns[ index ] = lastColumnObject
              oldCol = true
            }
          })
          if (!oldCol) {
            newColumns.push(lastColumnObject)
          }
        } else {
          if (!createdColumns[ createdColCount ]) {
            let createdColumnData = lodash.defaultsDeep({}, defaultColumnData)
            createdColumnData.size[ device ] = size
            if (device !== 'defaultSize') {
              createdColumnData.lastInRow[ device ] = lastInRow
              createdColumnData.firstInRow[ device ] = firstInRow
            }
            createdColumnData.disableStacking = disableStacking
            createdColumns.push(createdColumnData)
          } else {
            let createdColumnData = createdColumns[ createdColCount ]
            createdColumnData.size[ device ] = size
            if (device !== 'defaultSize') {
              createdColumnData.lastInRow[ device ] = lastInRow
              createdColumnData.firstInRow[ device ] = firstInRow
            }
            createdColumnData.disableStacking = disableStacking
          }
          createdColCount += 1
        }
      })
    })

    newColumns.forEach((col) => {
      if (!layoutData.hasOwnProperty('all')) {
        delete col.size['all']
      } else {
        delete col.size['xs']
        delete col.size['sm']
        delete col.size['md']
        delete col.size['lg']
        delete col.size['xl']
      }
      documentManager.update(col.id, col)
    })

    createdColumns.forEach((newCol) => {
      documentManager.create(newCol)
    })

    let defaultLayout = layoutData[ 'all' ] || layoutData[ 'xs' ]
    if (defaultLayout && (columns.length > defaultLayout.length)) {
      let removingColumns = columns.slice(defaultLayout.length)
      removingColumns.forEach((column) => {
        let childElements = documentManager.children(column.id)
        childElements.forEach((el) => {
          el.parent = lastColumnObject.id
          documentManager.update(el.id, el)
        })
        documentManager.delete(column.id)
      })
    }
  }

  static getLayout (id) {
    let layouts = {}

    const rowChildren = documentManager.children(id)
    let customDevices = false
    rowChildren.forEach((element) => {
      if (element.size.hasOwnProperty('xs')) {
        customDevices = true
      }
    })

    // Get layout for 'all'
    rowChildren.forEach((element) => {
      if (!customDevices && element.size['all']) {
        if (!layouts.hasOwnProperty('all')) {
          layouts.all = []
        }
        layouts['all'].push(element.size['all'])
      }

      if (element.size['defaultSize']) {
        if (!layouts.hasOwnProperty('defaultSize')) {
          layouts.defaultSize = []
        }
        layouts['defaultSize'].push(element.size['defaultSize'])
      }
    })

    if (!layouts.hasOwnProperty('all')) { // Get layout for devices, if 'all' is not defined
      devices.forEach((device) => {
        if (device !== 'defaultSize' && device !== 'all') {
          rowChildren.forEach((element) => {
            if (element.size[device]) {
              if (!layouts.hasOwnProperty(device)) {
                layouts[device] = []
              }
              layouts[device].push(element.size[device])
            }

            if (customDevices && element.size.hasOwnProperty('all')) {
              if (!layouts.hasOwnProperty(device)) {
                layouts[device] = []
              }
              if (device === 'xs' || device === 'sm') {
                layouts[device].push('100%')
              } else {
                layouts[device].push(element.size['all'])
              }
            }
          })
        }
      })
    }

    return layouts
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!vcCake.env('VCV_JS_FT_ROW_COLUMN_LOGIC_REFACTOR')) {
      return null
    }
    const { atts, id } = nextProps
    let layoutData = atts.layout && atts.layout.layoutData ? atts.layout.layoutData : RowElement.getLayout(id)
    let layoutDataFromProps = atts.layout && atts.layout.layoutData

    if (JSON.stringify(layoutData) !== JSON.stringify(prevState.layout)) {
      if (layoutDataFromProps) {
        // layoutDataFromProps.defaultSize = RowElement.getDefaultLayout(id, layoutDataFromProps)
        RowElement.setColumns(id, layoutDataFromProps, null, atts.layout.disableStacking)
        RowElement.resetRowLayout(id)

        // Build mixins
        setTimeout(() => {
          assetsStorage.trigger('updateElement', id)
        }, 10)

        return {
          layout: layoutDataFromProps
        }
      } else {
        const createdLayout = RowElement.getLayout(id)
        RowElement.setColumns(id, createdLayout, prevState.layout, atts.layout.disableStacking)

        // Build mixins
        setTimeout(() => {
          assetsStorage.trigger('updateElement', id)
        }, 10)

        return {
          layout: createdLayout
        }
      }
    } else {
      return null
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      layout: {}
    }
  }

  render () {
    const classNames = require('classnames')
    let { id, atts, editor, isBackend } = this.props
    let { customClass, rowWidth, removeSpaces, columnGap, fullHeight, metaCustomId, equalHeight, columnPosition, contentPosition, designOptionsAdvanced, layout, columnBackground, hidden, sticky, boxShadow } = atts
    let content = this.props.children
    const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'

    let containerClasses = classNames({
      'vce-row-container': true,
      'vce-wpbackend-element-hidden': hidden && isBackend
    })

    let classes = [ 'vce-row' ]

    if (columnBackground) {
      if (columnBackground.all) {
        classes.push(`vce-row--has-col-background`)
      } else {
        for (let currentDevice in columnBackground) {
          if (columnBackground[ currentDevice ]) {
            classes.push(`vce-row--${currentDevice}--has-col-background`)
          }
        }
      }
    }
    classes.push(this.getBackgroundClass(designOptionsAdvanced))
    classes.push(`vce-row--col-gap-${columnGap ? parseInt(columnGap) : 0}`)
    if (layout && layout.reverseColumn && !layout.disableStacking) {
      classes.push('vce-row-wrap--reverse')
    }
    let customProps = {
      style: {}
    }
    let customRowProps = {
      style: {}
    }
    let containerProps = {}
    if (typeof customClass === 'string' && customClass) {
      classes.push(customClass)
    }

    if (rowWidth === 'stretchedRow' || rowWidth === 'stretchedRowAndColumn') {
      customRowProps[ 'data-vce-full-width' ] = true
    } else {
      customRowProps.style.width = ''
      customRowProps.style.left = ''
      customRowProps.style.right = ''
      customProps.style.paddingLeft = ''
      customProps.style.paddingRight = ''
    }

    if (rowWidth === 'stretchedRowAndColumn' || editorType === 'sidebar') {
      customRowProps[ 'data-vce-stretch-content' ] = true
    }

    let stickyAttributes = {}
    if (sticky && sticky.device) {
      stickyAttributes = this.getStickyAttributes(sticky)
    }

    if ((editorType === 'sidebar' || rowWidth === 'stretchedRowAndColumn') && removeSpaces) {
      classes.push('vce-row-no-paddings')
    }

    if (fullHeight) {
      classes.push('vce-row-full-height')
    } else {
      customRowProps.style.minHeight = ''
    }

    if (equalHeight && columnPosition !== 'stretch') {
      classes.push('vce-row-equal-height')
    }

    if (columnPosition) {
      classes.push(`vce-row-columns--${columnPosition}`)
    }

    if (contentPosition) {
      classes.push(`vce-row-content--${contentPosition}`)
    }

    let boxShadowAttributes = {}
    if (boxShadow && boxShadow.device) {
      boxShadowAttributes = this.getBoxShadowAttributes(boxShadow, id)
    }

    let className = classNames(classes)

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    containerProps['data-vce-delete-attr'] = 'style'
    customRowProps['data-vce-delete-attr'] = 'style'

    customProps['data-vce-element-content'] = true

    let doAll = this.applyDO('all')

    return <div className={containerClasses} {...containerProps}>
      <div className={className} {...customRowProps} {...stickyAttributes} {...boxShadowAttributes} {...editor} id={'el-' + id} {...doAll}>
        {this.getBackgroundTypeContent()}
        {this.getContainerDivider()}
        <div className='vce-row-content' {...customProps}>
          {content}
        </div>
      </div>
    </div>
  }
}
