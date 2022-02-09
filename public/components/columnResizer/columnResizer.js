import React from 'react'
import vcCake from 'vc-cake'
import classNames from 'classnames'
import Layout from 'public/sources/attributes/rowLayout/Component'
import { debounce } from 'lodash'

const elementsStorage = vcCake.getStorage('elements')
const layoutStorage = vcCake.getStorage('layout')
const documentService = vcCake.getService('document')
let previousLayoutCustomMode = false

export default class ColumnResizer extends React.Component {
  static defaultGridPercentage = [20, 25, 33.33, 50, 66.66, 75]

  static deviceViewports = {
    xs: 0,
    sm: 544,
    md: 768,
    lg: 992,
    xl: 1200
  }

  resizerData = {
    rowId: null,
    rowData: null,
    rowWidth: null,
    helper: null,
    resizer: null,
    rightColumn: null,
    leftColumn: null,
    bothColumnsWidth: null,
    bothColumnsWidthPx: null,
    columnGap: null,
    mousePosition: null,
    resizerPositions: null,
    snapWidth: 7,
    leftColumnIndex: null
  }

  constructor (props) {
    super(props)
    this.state = {
      dragging: false,
      leftColPercentage: null,
      rightColPercentage: null,
      labelPosition: null,
      isVisible: true,
      isLabelsActive: false,
      isResizerActive: false,
      isResizerVisible: true,
      isFirst: props.isFirst || false,
      isLast: props.isLast || false
    }
    this.resizerRef = React.createRef()
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleLabelState = this.handleLabelState.bind(this)
    this.handleResizerState = this.handleResizerState.bind(this)
    this.handleLayoutCustomModeChange = this.handleLayoutCustomModeChange.bind(this)
    this.setVisibility = debounce(this.setVisibility.bind(this), 50)
  }

  componentDidMount () {
    vcCake.onDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
    const iframeDocument = document.getElementById('vcv-editor-iframe').contentWindow
    iframeDocument.addEventListener('resize', this.setVisibility)
    window.setTimeout(() => {
      this.setVisibility()
    }, 500)
  }

  componentWillUnmount () {
    vcCake.ignoreDataChange('vcv:layoutCustomMode', this.handleLayoutCustomModeChange)
    const iframeDocument = document.getElementById('vcv-editor-iframe').contentWindow
    iframeDocument.removeEventListener('resize', this.setVisibility)
  }

  componentDidUpdate (prevProps, prevState) {
    const iframeDocument = document.getElementById('vcv-editor-iframe').contentWindow
    let data = {}
    if (this.state.dragging && !prevState.dragging) {
      previousLayoutCustomMode = vcCake.getData('vcv:layoutCustomMode') && vcCake.getData('vcv:layoutCustomMode').mode
      data = {
        mode: 'columnResizer',
        options: {}
      }
      vcCake.setData('vcv:layoutCustomMode', data)
      iframeDocument.addEventListener('mousemove', this.handleMouseMove)
      iframeDocument.addEventListener('mouseup', this.handleMouseUp)
      vcCake.setData('vcv:layoutColumnResize', this.resizerData.rowId)
    } else if (!this.state.dragging && prevState.dragging) {
      const newLayoutMode = previousLayoutCustomMode === 'contentEditable' ? previousLayoutCustomMode : null
      data = {
        mode: newLayoutMode,
        options: {}
      }
      vcCake.setData('vcv:layoutCustomMode', newLayoutMode ? data : null)
      vcCake.setData('vcv:layoutColumnResize', null)
      iframeDocument.removeEventListener('mousemove', this.handleMouseMove)
      iframeDocument.removeEventListener('mouseup', this.handleMouseUp)
    }
    if (prevState.isResizerVisible !== this.state.isResizerVisible) {
      this.setVisibility()
    }
  }

  setVisibility () {
    /* console.log('--- setVisibility ---') */
    if (!this.resizerRef.current) {
      return
    }
    const { nextElementSibling, previousElementSibling, firstElementChild } = this.resizerRef.current
    if (!nextElementSibling || !previousElementSibling) {
      return
    }
    const resizerRect = firstElementChild.getBoundingClientRect()
    const previousElementRect = previousElementSibling.getBoundingClientRect()

    // when columns are stacked and resizer is not needed (happens only in PX case)
    if ((previousElementRect.left + previousElementRect.width > resizerRect.left) || (nextElementSibling.getBoundingClientRect().left < resizerRect.left + resizerRect.width)) {
      this.setState({ isResizerVisible: false })
    } else {
      this.setState({ isResizerVisible: true })
    }
  }

  handleLabelState (e) {
    console.log('--- handleLabelState ---')
    const newState = {
      isLabelsActive: !this.state.isLabelsActive
    }
    if (e.type === 'mouseenter') {
      const Event = new window.MouseEvent('mouseenter', {
        clientX: e.currentTarget.getBoundingClientRect().x
      })

      this.getRowData(Event)
      const colSizes = this.getResizedColumnsWidth(Event)

      const leftColData = this.resizerData.leftColumn
        ? documentService.get(this.resizerData.leftColumn.id.replace('el-', ''))
        : null

      const rightColData = this.resizerData.rightColumn
        ? documentService.get(this.resizerData.rightColumn.id.replace('el-', ''))
        : null

      if (leftColData && leftColData.size) {
        const currentSize = Object.prototype.hasOwnProperty.call(leftColData.size, 'all') ? leftColData.size.all : leftColData.size[this.resizerData.currentDevice]
        if (!currentSize.includes('%')) {
          newState.leftColValue = currentSize
        } else {
          newState.leftColValue = null
        }
      }

      if (rightColData && rightColData.size) {
        const currentSize = Object.prototype.hasOwnProperty.call(rightColData.size, 'all') ? rightColData.size.all : rightColData.size[this.resizerData.currentDevice]
        if (!currentSize.includes('%')) {
          newState.rightColValue = currentSize
        } else {
          newState.rightColValue = null
        }
      }

      newState.leftColPercentage = this.state.isFirst ? 0 : colSizes.leftCol
      newState.rightColPercentage = this.state.isLast ? 0 : colSizes.rightCol
    } else {
      window.setTimeout(() => {
        newState.leftColValue = null
        newState.rightColValue = null
      }, 300)
    }
    console.log(this.state)
    this.setState(newState)
  }

  handleLayoutCustomModeChange (data) {
    if (data === 'contentEditable') {
      this.hide()
    } else {
      this.show()
    }
  }

  handleResizerState () {
    /* console.log('--- handleResizerState ---') */
    if (!this.state.dragging) {
      this.setState({
        isResizerActive: !this.state.isResizerActive,
        labelPosition: null
      })
    }
  }

  getRowData (e) {
    /* console.log('--- getRowData ---') */
    let $isFirst = false
    let $isLast = false

    const $helper = this.resizerRef.current
    let $tempRightCol = $helper.nextElementSibling

    // Search for next visible column
    if ($tempRightCol) {
      while (!$tempRightCol.offsetParent) {
        $tempRightCol = $tempRightCol.nextElementSibling
      }
    } else {
      $isLast = true
    }

    let $tempLeftCol = $helper.previousElementSibling

    if ($tempLeftCol) {
      while (!$tempLeftCol.offsetParent) {
        $tempLeftCol = $tempLeftCol.nextElementSibling
      }
    } else {
      $isFirst = true
    }

    if (!($isFirst || $isLast)) {
      this.processMiddleColumns(e, $helper, $tempLeftCol, $tempRightCol)
    } else {
      this.processSideColumn(e, $helper, $isFirst, $tempRightCol || $tempLeftCol)
    }
  }

  processMiddleColumns (e, $helper, $tempLeftCol, $tempRightCol) {
    let $rightCol
    let $leftCol

    if ($tempLeftCol.getBoundingClientRect().left > $tempRightCol.getBoundingClientRect().left) {
      $rightCol = $tempLeftCol
      $leftCol = $tempRightCol
    } else {
      $rightCol = $tempRightCol
      $leftCol = $tempLeftCol
    }

    const rightColId = $rightCol ? $rightCol.id.replace('el-', '') : null
    const leftColId = $leftCol ? $leftCol.id.replace('el-', '') : null
    const rowId = documentService.get(rightColId || leftColId).parent
    const rowData = documentService.get(rowId)
    const columnGap = rowData.columnGap ? parseInt(rowData.columnGap) : 0
    const rowWidth = $helper.parentElement.getBoundingClientRect().width + columnGap - parseFloat(window.getComputedStyle($helper.parentElement).paddingLeft) - parseFloat(window.getComputedStyle($helper.parentElement).paddingRight)
    const bothColumnsWidth = ($leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width + columnGap * 2) / rowWidth
    const bothColumnsWidthPx = $leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width
    const allColIds = documentService.children(rowId)
    const allColumns = []
    allColIds.forEach((col) => {
      const colElement = $helper.parentElement.querySelector(`#el-${col.id}`)
      if (colElement) {
        allColumns.push(colElement)
      }
    })
    const leftColumnIndex = allColumns.indexOf($leftCol)
    const rightColumnIndex = allColumns.indexOf($rightCol)

    this.resizerData.rowId = rowId
    this.resizerData.rowData = rowData
    this.resizerData.rowWidth = rowWidth
    this.resizerData.helper = $helper
    this.resizerData.resizer = $helper.querySelector('.vce-column-resizer-label-container')
    this.resizerData.rightColumn = $rightCol
    this.resizerData.leftColumn = $leftCol
    this.resizerData.bothColumnsWidth = bothColumnsWidth
    this.resizerData.bothColumnsWidthPx = bothColumnsWidthPx
    this.resizerData.columnGap = columnGap
    this.resizerData.mousePosition = e.clientX
    this.resizerData.leftColumnIndex = leftColumnIndex
    this.resizerData.rightColumnIndex = rightColumnIndex
    this.resizerData.currentDevice = this.getCurrentDevice()
  }

  processSideColumn (e, $helper, $isFirst, $linkedElement) {
    const id = $linkedElement.id.replace('el-', '')

    const rowId = documentService.get(id).parent
    const rowData = documentService.get(rowId)
    const columnGap = rowData.columnGap ? parseInt(rowData.columnGap) : 0
    const rowWidth = $helper.parentElement.getBoundingClientRect().width + columnGap - parseFloat(window.getComputedStyle($helper.parentElement).paddingLeft) - parseFloat(window.getComputedStyle($helper.parentElement).paddingRight)
    const bothColumnsWidth = ($linkedElement.getBoundingClientRect().width + columnGap) / rowWidth
    const bothColumnsWidthPx = $linkedElement.getBoundingClientRect().width
    const allColIds = documentService.children(rowId)
    const allColumns = []
    allColIds.forEach((col) => {
      const colElement = $helper.parentElement.querySelector(`#el-${col.id}`)
      if (colElement) {
        allColumns.push(colElement)
      }
    })

    const index = allColumns.indexOf($linkedElement)

    this.resizerData.rowId = rowId
    this.resizerData.rowData = rowData
    this.resizerData.rowWidth = rowWidth
    this.resizerData.helper = $helper
    this.resizerData.resizer = $helper.querySelector('.vce-column-resizer-label-container')
    this.resizerData.rightColumn = $isFirst ? $linkedElement : null
    this.resizerData.leftColumn = $isFirst ? null : $linkedElement
    this.resizerData.bothColumnsWidth = bothColumnsWidth
    this.resizerData.bothColumnsWidthPx = bothColumnsWidthPx
    this.resizerData.columnGap = columnGap
    this.resizerData.mousePosition = e.clientX
    this.resizerData.leftColumnIndex = index
    this.resizerData.rightColumnIndex = index
    this.resizerData.currentDevice = this.getCurrentDevice()
  }

  handleMouseDown (e) {
    /* console.log('--- handleMouseDown ---') */
    if (e.nativeEvent.which === 1) {
      this.getRowData(e)
      this.getResizerPositions(e)
      this.createWrapBlockers()
      this.setResizeLabelsPosition(e)
      const colSizes = this.getResizedColumnsWidth(e)
      this.setState({
        dragging: true,
        leftColValue: null,
        rightColValue: null,
        leftColPercentage: colSizes.leftCol,
        rightColPercentage: colSizes.rightCol
      })
      layoutStorage.state('resizeColumns').set(true)
    }
  }

  getResizerPositions (e) {
    /* console.log('--- getResizerPositions ---') */

    const positions = []
    const currentResizer = e.currentTarget
    const currentResizerClientRect = currentResizer.getBoundingClientRect()

    let allResizers = document.querySelector('#vcv-editor-iframe').contentWindow.document.querySelectorAll('.vce-column-resizer-handler')
    allResizers = [].slice.call(allResizers)

    const resizerRow = currentResizer.parentElement.parentElement
    // row first and last column position
    let firstInRow, lastInRow
    for (let i = 0; i < resizerRow.children.length; i++) {
      const elementClasses = resizerRow.children[i].classList
      if (elementClasses && (elementClasses.contains('vce-col--all-first') || elementClasses.contains('vce-col--' + this.resizerData.currentDevice + '-first'))) {
        firstInRow = resizerRow.children[i].getBoundingClientRect()
      }
      if (elementClasses && (elementClasses.contains('vce-col--all-last') || elementClasses.contains('vce-col--' + this.resizerData.currentDevice + '-last'))) {
        lastInRow = resizerRow.children[i].getBoundingClientRect()
      }
      if (firstInRow && lastInRow) {
        i = resizerRow.children.length
      }
    }
    // get content part position and width relative to window,
    const rowContentWidth = lastInRow.left + lastInRow.width - firstInRow.left + currentResizerClientRect.width
    ColumnResizer.defaultGridPercentage.forEach((percentage) => {
      const position = firstInRow.left - currentResizerClientRect.width / 2 + rowContentWidth * (percentage / 100)
      positions.push((Math.round(position * 100) / 100))

      if (this.resizerData.leftColumn) {
        const leftPosition = this.resizerData.leftColumn.getBoundingClientRect().left - currentResizerClientRect.width / 2 + rowContentWidth * (percentage / 100)
        positions.push((Math.round(leftPosition * 100) / 100))
      }

      if (this.resizerData.rightColumn) {
        const rightColClientRect = this.resizerData.rightColumn.getBoundingClientRect()
        const rightPosition = rightColClientRect.left + rightColClientRect.width + currentResizerClientRect.width / 2 - rowContentWidth * (percentage / 100)
        positions.push((Math.round(rightPosition * 100) / 100))
      }
    })
    // get default grid snap points and add them to positions []
    allResizers.forEach((resizer) => {
      if (resizer !== currentResizer && window.getComputedStyle(resizer.parentElement).getPropertyValue('display') !== 'none') {
        const resizerClientRect = resizer.getBoundingClientRect()
        const position = resizerClientRect.left + resizerClientRect.width / 2
        if (positions.indexOf(position) < 0) {
          positions.push((Math.round(position * 100) / 100))
        }
      }
    })
    this.resizerData.resizerPositions = positions
  }

  handleMouseUp () {
    /* console.log('--- handleMouseUp ---') */

    this.setState({ dragging: false })
    this.removeWrapBlockers()
    this.rebuildRowLayout()
    setTimeout(() => {
      this.removeTemporaryColStyles()
    }, 100)
    layoutStorage.state('resizeColumns').set(false)
  }

  handleMouseMove (e) {
    /* console.log('--- handleMouseMove ---') */

    if (!this.state.dragging) {
      return
    }
    this.renderTemporaryColStyles(e)
    this.setResizeLabelsPosition(e)
  }

  setResizeLabelsPosition (e) {
    /* console.log('--- setResizeLabelsPosition ---') */

    const resizerHeight = this.resizerData.resizer.getBoundingClientRect().height
    const labelPosition = e.clientY - this.resizerData.helper.getBoundingClientRect().top - (resizerHeight / 2)
    this.setState({ labelPosition: labelPosition })
  }

  renderTemporaryColStyles (e) {
    console.log('--- renderTemporaryColStyles ---')

    const columnGap = this.resizerData.columnGap
    const colSizes = this.getResizedColumnsWidth(e)
    let resizerPercentages = colSizes.leftCol
    let rightResizerPercentages = colSizes.rightCol

    let equalSpace = columnGap * (resizerPercentages * 100 - 1)
    let rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
    const gapSpace = columnGap * (100 - 1)

    const rowWidth = this.resizerData.rowWidth - this.resizerData.columnGap

    const mouseLeftPosition = e.clientX

    this.resizerData.resizerPositions.forEach((position) => {
      const minPosition = Math.round(position) - this.resizerData.snapWidth
      const maxPosition = Math.round(position) + this.resizerData.snapWidth
      if (this.resizerData.leftColumn && (mouseLeftPosition > minPosition && mouseLeftPosition < maxPosition)) {
        const fullRowWidth = this.resizerData.rowWidth
        const resizerWidth = position - this.resizerData.leftColumn.getBoundingClientRect().left + this.resizerData.columnGap / 2
        const leftCol = resizerWidth / fullRowWidth

        resizerPercentages = leftCol
        rightResizerPercentages = this.resizerData.bothColumnsWidth - leftCol
        equalSpace = columnGap * (resizerPercentages * 100 - 1)
        rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
      }
    })

    const leftWidth = `calc((100% - ${gapSpace}px) * ${resizerPercentages} + ${equalSpace}px)`
    const rightWidth = `calc((100% - ${gapSpace}px) * ${rightResizerPercentages} + ${rightEqualSpace}px)`

    if (!!this.resizerData.rightColumn && !!this.resizerData.leftColumn) {
      if (this.resizerData.mousePosition > e.clientX) {
        const left = (rowWidth - gapSpace) * resizerPercentages + equalSpace
        const right = this.resizerData.rightColumn.getBoundingClientRect().width

        if ((left + right) < this.resizerData.bothColumnsWidthPx) {
          this.resizerData.leftColumn.style.flexBasis = leftWidth
          this.resizerData.leftColumn.style.maxWidth = leftWidth

          this.resizerData.rightColumn.style.flexBasis = this.resizerData.bothColumnsWidthPx - this.resizerData.leftColumn.getBoundingClientRect().width + 'px'
          this.resizerData.rightColumn.style.maxWidth = this.resizerData.bothColumnsWidthPx - this.resizerData.leftColumn.getBoundingClientRect().width + 'px'
        }
      } else if (this.resizerData.mousePosition < e.clientX) {
        const left = this.resizerData.leftColumn.getBoundingClientRect().width
        const right = (rowWidth - gapSpace) * rightResizerPercentages + rightEqualSpace
        if ((left + right) < this.resizerData.bothColumnsWidthPx) {
          this.resizerData.rightColumn.style.flexBasis = rightWidth
          this.resizerData.rightColumn.style.maxWidth = rightWidth

          this.resizerData.leftColumn.style.flexBasis = this.resizerData.bothColumnsWidthPx - this.resizerData.rightColumn.getBoundingClientRect().width + 'px'
          this.resizerData.leftColumn.style.maxWidth = this.resizerData.bothColumnsWidthPx - this.resizerData.rightColumn.getBoundingClientRect().width + 'px'
        }
      }
    } else {
      this.resizeSideColumn(e)
    }

    const columnCalc = (100 * columnGap) + (rowWidth - gapSpace)

    const leftCol = this.resizerData.leftColumn
      ? columnGap + this.resizerData.leftColumn.getBoundingClientRect().width
      : columnGap
    const rightCol = this.resizerData.rightColumn
      ? columnGap + this.resizerData.rightColumn.getBoundingClientRect().width
      : columnGap
    const leftPercentage = leftCol / columnCalc
    const rightPercentage = rightCol / columnCalc

    this.setLabelPercentages(leftPercentage, rightPercentage)

    this.resizerData.mousePosition = e.clientX
  }

  resizeSideColumn (e) {
    const row = documentService.get(this.resizerData.rowId)
    console.log(row.designOptionsAdvanced.attributeMixins['boxModelMixin:all'].variables)

    const element = this.resizerData[this.state.isFirst ? 'rightColumn' : 'leftColumn']
    const bounding = element.getBoundingClientRect()
    if (this.state.isFirst) {
      element.style.marginLeft = e.clientX - bounding.x + 'px'
    } else {
      const width = e.clientX - (bounding.x + bounding.width)
      if (width < 0) {
        element.style.marginRight = Math.abs(width) + 'px'
      }
    }
  }

  removeTemporaryColStyles () {
    /* console.log('--- removeTemporaryColStyles ---') */
    if (this.resizerData.leftColumn) {
      this.resizerData.leftColumn.removeAttribute('style')
    }
    if (this.resizerData.rightColumn) {
      this.resizerData.rightColumn.removeAttribute('style')
    }
  }

  createWrapBlockers () {
    /* console.log('--- createWrapBlockers ---') */

    const $resizer = this.resizerData.helper
    const firstRowElement = this.getSibling($resizer, 'prev', 'vce-col--all-first') || this.getSibling($resizer, 'prev', 'vce-col--' + this.resizerData.currentDevice + '-first')
    const blockElement = document.createElement('div')
    blockElement.className = 'vce-column-wrap-blocker'

    if (firstRowElement) {
      firstRowElement.parentNode.insertBefore(blockElement, firstRowElement)
    }
  }

  removeWrapBlockers () {
    /* console.log('--- removeWrapBlockers ---') */

    const blocker = this.resizerData.helper.parentNode.querySelector('.vce-column-wrap-blocker')
    if (blocker) {
      blocker.parentNode.removeChild(blocker)
    }
  }

  getSibling (element, direction, className) {
    /* console.log('--- getSibling ---') */

    let sibling = null
    if (direction === 'prev') {
      direction = 'previousElementSibling'
    } else if (direction === 'next') {
      direction = 'nextElementSibling'
    } else {
      return null
    }

    const getElementSibling = (element, dir) => {
      const siblingElement = element[dir]
      if (!siblingElement) {
        return null
      }
      const siblingClasses = element[dir].className.split(' ')
      if (siblingClasses.indexOf(className) > -1) {
        sibling = element[dir]
      } else {
        getElementSibling(element[dir], dir)
      }
    }
    getElementSibling(element, direction)
    return sibling
  }

  setLabelPercentages (left, right) {
    /* console.log('--- setLabelPercentages ---') */

    this.setState({
      leftColPercentage: left,
      rightColPercentage: right
    })
  }

  getResizedColumnsWidth (e, leftColumn) {
    const rowWidth = this.resizerData.rowWidth
    const resizerWidth = leftColumn || this.resizerData.leftColumn
      ? e.clientX - (leftColumn || this.resizerData.leftColumn.getBoundingClientRect().left) + this.resizerData.columnGap / 2
      : e.clientX + this.resizerData.columnGap / 2
    const leftCol = resizerWidth / rowWidth
    return { leftCol: leftCol, rightCol: this.resizerData.bothColumnsWidth - leftCol }
  }

  rebuildRowLayout () {
    /* console.log('--- rebuildRowLayout ---') */

    const parentRow = documentService.get(this.resizerData.rowId)
    const layoutData = this.getLayoutData(this.resizerData.rowId)

    let leftSize = Math.round(this.state.leftColPercentage * 100)
    leftSize = leftSize.toString().slice(0, leftSize.toString().indexOf('.') + 3)
    let rightSize = Math.round(this.state.rightColPercentage * 100)
    rightSize = rightSize.toString().slice(0, rightSize.toString().indexOf('.') + 3)

    const device = Object.prototype.hasOwnProperty.call(layoutData, 'all') ? 'all' : this.resizerData.currentDevice

    layoutData[device][this.resizerData.leftColumnIndex] = `${leftSize}%`
    layoutData[device][this.resizerData.rightColumnIndex] = `${rightSize}%`
    parentRow.layout.layoutData = layoutData
    if (!this.state.isLast) {
      elementsStorage.trigger('update', parentRow.id, parentRow, '', { changedAttributeType: 'rowLayout' })
    }
  }

  getCurrentDevice () {
    /* console.log('--- getCurrentDevice ---') */

    const iframeDocument = document.querySelector('#vcv-editor-iframe').contentWindow
    const windowWidth = Math.max(iframeDocument.document.documentElement.clientWidth, iframeDocument.innerWidth || 0)
    let currentDevice = null

    Object.keys(ColumnResizer.deviceViewports).forEach((device) => {
      const viewport = ColumnResizer.deviceViewports[device]

      if (windowWidth >= viewport) {
        currentDevice = device
      }
    })

    return currentDevice
  }

  getLayoutData (rowId) {
    /* console.log('--- getLayoutData ---') */

    const deviceLayoutData = {}
    const rowChildren = documentService.children(rowId)

    // Get layout for 'all'
    rowChildren.forEach((element) => {
      if (element.size.all) {
        if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, 'all')) {
          deviceLayoutData.all = []
        }
        deviceLayoutData.all.push(element.size.all)
      }
    })

    if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, 'all')) { // Get layout for devices, if 'all' is not defined
      Layout.devices.forEach((device) => {
        rowChildren.forEach((element) => {
          if (element.size[device]) {
            if (!Object.prototype.hasOwnProperty.call(deviceLayoutData, device)) {
              deviceLayoutData[device] = []
            }
            deviceLayoutData[device].push(element.size[device])
          }
        })
      })
    }

    return deviceLayoutData
  }

  hide () {
    /* console.log('--- hide ---') */
    this.setState({ isVisible: false })
  }

  show () {
    /* console.log('--- show ---') */
    this.setState({ isVisible: true })
  }

  render () {
    const { leftColPercentage, rightColPercentage, leftColValue, rightColValue, labelPosition, isFirst, isLast } = this.state
    if (!this.state.isVisible) {
      return null
    }

    const labelProps = labelPosition === null ? {} : {
      style: {
        top: `${labelPosition}px`,
        position: 'absolute'
      }
    }

    const labelContainerClasses = classNames({
      'vce-column-resizer-label-container': true,
      'vce-column-resizer-label-container--active': this.state.isLabelsActive
    })

    const columnResizerClasses = classNames({
      'vce-column-resizer': true,
      vcvhelper: true,
      'vce-column-resizer--active': this.state.isResizerActive,
      'vce-column-resizer--hidden': !this.state.isResizerVisible
    })

    const isOnSide = () => isFirst || isLast ? 'vce-column-resizer-' + (isFirst ? 'first' : 'last') : ''

    const newColumn = (isFirst = false) => {
      if (isFirst) {
        console.log('*** Pre-pend')
      } else {
        console.log('*** append')
      }
    }

    return (
      <div
        className={columnResizerClasses}
        onMouseOver={this.handleResizerState}
        onMouseOut={this.handleResizerState}
        ref={this.resizerRef}
      >
        <div className={`vce-column-resizer-handler ${isOnSide()}`} data-vcv-linked-element={this.props.linkedElement} onMouseDown={this.handleMouseDown}>
          <div className={labelContainerClasses} {...labelProps} onMouseEnter={this.handleLabelState} onMouseLeave={this.handleLabelState}>
            <div onClick={isFirst ? () => newColumn(isFirst) : undefined} className='vce-column-resizer-label vce-column-resizer-label-left'>
              <span className='vce-column-resizer-label-percentage'>{isFirst
                ? <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
                : leftColValue || Math.round(leftColPercentage * 100) + '%'}
              </span>
            </div>
            <div onClick={isLast ? () => newColumn() : undefined} className='vce-column-resizer-label vce-column-resizer-label-right'>
              <span className='vce-column-resizer-label-percentage'>{isLast
                ? <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
                : rightColValue || Math.round(rightColPercentage * 100) + '%'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
