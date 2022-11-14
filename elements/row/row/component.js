import React from 'react'
import { getService, getStorage, env } from 'vc-cake'
import lodash from 'lodash'
import classNames from 'classnames'

const vcvAPI = getService('api')

const documentManager = getService('document')
const assetsStorage = getStorage('assets')
const elementsSettingsStorage = getStorage('elementsSettings')
const fieldOptionsStorage = getStorage('fieldOptions')
const extendedOptionsState = elementsSettingsStorage.state('extendedOptions')

const devices = ['all', 'defaultSize', 'xs', 'sm', 'md', 'lg', 'xl']

export default class RowElement extends vcvAPI.elementComponent {
  static getRowData (layout) {
    const lastColumnIndex = []
    let rowValue = 0
    let autoCount = 0
    const columnValues = []
    let isColumnsEqual = true
    const layoutCopy = layout.slice()

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
          const column = col.split('/')
          const numerator = column[0]
          const denominator = column[1]
          colValue = numerator / denominator
        }
        columnValues.push(colValue)
      }

      const newRowValue = Math.floor((rowValue + colValue) * 1000) / 1000

      if (newRowValue > 1 || (newRowValue === 1 && col === 'hide')) {
        isColumnsEqual = false
        lastColumnIndex.push(index - 1)
        rowValue = 0
      }
      if (layoutCopy[index + 1] === undefined) {
        lastColumnIndex.push(index)
      }
      rowValue += colValue
    })

    let rowFullValue = 0

    const newRowValue = rowValue - (autoCount * 0.01)
    const autoValue = (1 - newRowValue) / autoCount

    columnValues.forEach((size, index) => {
      if (size === 'auto') {
        columnValues[index] = autoValue
        rowFullValue += autoValue
      } else {
        rowFullValue += size
      }
    })

    columnValues.forEach((size) => {
      if (columnValues[0] !== size && size !== 1) {
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
    const rowElement = documentManager.get(id)
    rowElement.layout.layoutData = null
    documentManager.update(id, rowElement)
  }

  static getDefaultLayout (id, layoutData) {
    let defaultLayout = []
    if (layoutData && Object.prototype.hasOwnProperty.call(layoutData, 'all')) {
      defaultLayout = layoutData.all.slice()
    } else {
      const rowChildren = documentManager.children(id)

      rowChildren.forEach((element) => {
        if (Object.prototype.hasOwnProperty.call(element.size, 'defaultSize')) {
          defaultLayout.push(element.size.defaultSize)
        }
      })
    }

    return defaultLayout
  }

  static setColumns (id, layoutData, prevLayoutData, disableStacking = false) {
    const columns = documentManager.children(id)
    const newColumns = []
    const createdColumns = []
    const defaultColumnData = { tag: 'column', parent: id, designOptionsAdvanced: {}, customClass: '', customHeaderTitle: '', metaCustomId: '', dividers: {}, sticky: {}, lastInRow: {}, firstInRow: {}, size: {} }
    let lastColumnObject = null

    Object.keys(layoutData).forEach((device) => {
      let layout = layoutData[device]
      const prevLayout = prevLayoutData && prevLayoutData[device]

      if (prevLayout && prevLayout.length) {
        if (layout.length > prevLayout.length) { // Column add
          const rowData = RowElement.getRowData(prevLayout)
          if ((Math.round(rowData.rowValue * 100) / 100) < 1) {
            const leftValue = 1 - rowData.rowValue
            layout = prevLayout
            layout.push(`${leftValue * 100}%`)
          } else if (rowData.isColumnsEqual) {
            const colCount = layout.length
            const colSize = `${Math.floor(100 / colCount * 100) / 100}%`
            layout = []
            for (let i = 0; i < colCount; i++) {
              layout.push(colSize)
            }
          }
        } else if (layout.length < prevLayout.length) { // Column remove
          const rowData = RowElement.getRowData(prevLayout)

          if (((Math.round(rowData.rowValue * 100) / 100) === 1) && rowData.isColumnsEqual) {
            const colCount = layout.length
            const colSize = `${Math.floor(100 / colCount * 100) / 100}%`
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

        if (columns[i] !== undefined) {
          lastColumnObject = columns[i]
          lastColumnObject.size[device] = size

          if (device !== 'defaultSize') {
            lastColumnObject.lastInRow[device] = lastInRow
            lastColumnObject.firstInRow[device] = firstInRow
          }
          lastColumnObject.disableStacking = disableStacking

          let oldCol = false
          newColumns.forEach((newCol, index) => {
            if (lastColumnObject.id === newCol.id) {
              newColumns[index] = lastColumnObject
              oldCol = true
            }
          })
          if (!oldCol) {
            newColumns.push(lastColumnObject)
          }
        } else {
          if (!createdColumns[createdColCount]) {
            const createdColumnData = lodash.defaultsDeep({}, defaultColumnData)
            createdColumnData.size[device] = size
            if (device !== 'defaultSize') {
              createdColumnData.lastInRow[device] = lastInRow
              createdColumnData.firstInRow[device] = firstInRow
            }
            createdColumnData.disableStacking = disableStacking
            createdColumns.push(createdColumnData)
          } else {
            const createdColumnData = createdColumns[createdColCount]
            createdColumnData.size[device] = size
            if (device !== 'defaultSize') {
              createdColumnData.lastInRow[device] = lastInRow
              createdColumnData.firstInRow[device] = firstInRow
            }
            createdColumnData.disableStacking = disableStacking
          }
          createdColCount += 1
        }
      })
    })

    newColumns.forEach((col) => {
      if (!Object.prototype.hasOwnProperty.call(layoutData, 'all')) {
        delete col.size.all
      } else {
        delete col.size.xs
        delete col.size.sm
        delete col.size.md
        delete col.size.lg
        delete col.size.xl
      }
      documentManager.update(col.id, col)
    })

    createdColumns.forEach((newCol) => {
      documentManager.create(newCol)
    })

    const defaultLayout = layoutData.all || layoutData.xs
    if (defaultLayout && (columns.length > defaultLayout.length)) {
      const removingColumns = columns.slice(defaultLayout.length)
      removingColumns.forEach((column) => {
        const childElements = documentManager.children(column.id)
        childElements.forEach((el) => {
          el.parent = lastColumnObject.id
          documentManager.update(el.id, el)
        })
        documentManager.delete(column.id)
      })
    }
  }

  static getLayout (id) {
    const layouts = {}

    const rowChildren = documentManager.children(id)
    let customDevices = false
    rowChildren.forEach((element) => {
      if (Object.prototype.hasOwnProperty.call(element.size, 'xs')) {
        customDevices = true
      }
    })

    // Get layout for 'all'
    rowChildren.forEach((element) => {
      if (!customDevices && element.size.all) {
        if (!Object.prototype.hasOwnProperty.call(layouts, 'all')) {
          layouts.all = []
        }
        layouts.all.push(element.size.all)
      }

      if (element.size.defaultSize) {
        if (!Object.prototype.hasOwnProperty.call(layouts, 'defaultSize')) {
          layouts.defaultSize = []
        }
        layouts.defaultSize.push(element.size.defaultSize)
      }
    })

    if (!Object.prototype.hasOwnProperty.call(layouts, 'all')) { // Get layout for devices, if 'all' is not defined
      devices.forEach((device) => {
        if (device !== 'defaultSize' && device !== 'all') {
          rowChildren.forEach((element) => {
            if (element.size[device]) {
              if (!Object.prototype.hasOwnProperty.call(layouts, device)) {
                layouts[device] = []
              }
              layouts[device].push(element.size[device])
            }

            if (customDevices && Object.prototype.hasOwnProperty.call(element.size, 'all')) {
              if (!Object.prototype.hasOwnProperty.call(layouts, device)) {
                layouts[device] = []
              }
              if (device === 'xs' || device === 'sm') {
                layouts[device].push('100%')
              } else {
                layouts[device].push(element.size.all)
              }
            }
          })
        }
      })
    }

    return layouts
  }

  static getDerivedStateFromProps (nextProps, prevState) {
    if (!env('VCV_JS_FT_ROW_COLUMN_LOGIC_REFACTOR')) {
      return null
    }
    const { atts, id } = nextProps
    const layoutData = atts.layout && atts.layout.layoutData ? atts.layout.layoutData : RowElement.getLayout(id)
    const layoutDataFromProps = atts.layout && atts.layout.layoutData

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

    this.handleStorageChange = this.handleStorageChange.bind(this)
  }

  componentDidMount () {
    const currentState = extendedOptionsState.get()
    if (!currentState || (currentState && !currentState.elements.includes(this.props.id))) {
      extendedOptionsState.onChange(this.handleStorageChange)
      const options = {
        fieldKey: false,
        fieldType: false,
        id: this.props.id
      }
      fieldOptionsStorage.trigger('fieldOptionsChange', options)
    }
  }

  componentDidUpdate () {
    this.handleStorageChange(false)
  }

  handleStorageChange (data) {
    let dataFromState = extendedOptionsState.get()
    if (data) {
      dataFromState = data
      extendedOptionsState.ignoreChange(this.handleStorageChange)
    }
    if (!dataFromState) {
      return
    }
    const elementData = dataFromState.elements.find(el => el.id === this.props.id)
    if (elementData) {
      elementsSettingsStorage.state('elementOptions').set({ ...elementData })
    }
  }

  render () {
    const { id, atts, editor, isBackend } = this.props
    const { customClass, rowWidth, removeSpaces, columnGap, fullHeight, metaCustomId, equalHeight, columnPosition, contentPosition, designOptionsAdvanced, layout, columnBackground, hidden, sticky, boxShadow, extraDataAttributes } = atts
    const content = this.props.children
    const editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'

    const containerClasses = classNames({
      'vce-row-container': true,
      'vce-wpbackend-element-hidden': hidden && isBackend
    })

    const classes = ['vce-row']

    if (columnBackground) {
      if (columnBackground.all) {
        classes.push('vce-row--has-col-background')
      } else {
        for (const currentDevice in columnBackground) {
          if (columnBackground[currentDevice]) {
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
    const customProps = {
      style: {}
    }
    const customRowProps = {
      style: {}
    }
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)
    if (typeof customClass === 'string' && customClass) {
      classes.push(customClass)
    }

    if (rowWidth === 'stretchedRow' || rowWidth === 'stretchedRowAndColumn') {
      customRowProps['data-vce-full-width'] = true
    } else {
      customRowProps.style.width = ''
      customRowProps.style.left = ''
      customRowProps.style.right = ''
      customProps.style.paddingLeft = ''
      customProps.style.paddingRight = ''
    }

    if (rowWidth === 'stretchedRowAndColumn' || editorType === 'sidebar') {
      customRowProps['data-vce-stretch-content'] = true
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

    // Don't add equal height class if columns are already stretched
    if (equalHeight && (!fullHeight || columnPosition !== 'stretch')) {
      classes.push('vce-row-equal-height')
    }

    // Add column position class only if full height enabled
    if (columnPosition && fullHeight) {
      classes.push(`vce-row-columns--${columnPosition}`)
    }

    if (contentPosition) {
      classes.push(`vce-row-content--${contentPosition}`)
    }

    let boxShadowAttributes = {}
    if (boxShadow && boxShadow.device) {
      boxShadowAttributes = this.getBoxShadowAttributes(boxShadow, id)
    }

    const className = classNames(classes)

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    containerProps['data-vce-delete-attr'] = 'style'
    customRowProps['data-vce-delete-attr'] = 'style'
    customProps['data-vce-delete-attr'] = 'style'

    if (rowWidth === 'boxed') {
      containerProps['data-vce-boxed-width'] = true
    }

    customProps['data-vce-element-content'] = true

    const doAll = this.applyDO('all')

    return (
      <div className={containerClasses} {...containerProps}>
        <div className={className} {...customRowProps} {...stickyAttributes} {...boxShadowAttributes} {...editor} id={'el-' + id} {...doAll}>
          {this.getBackgroundTypeContent()}
          {this.getContainerDivider()}
          <div className='vce-row-content' {...customProps}>
            {content}
          </div>
        </div>
      </div>
    )
  }
}
