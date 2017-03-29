import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'

class ColumnResizer extends React.Component {
  constructor (props) {
    super(props)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.state = {
      dragging: false,
      leftColPercentage: null,
      rightColPercentage: null,
      labelPosition: null
    }
  }

  static data = {
    rowId: null,
    rowData: null,
    helper: null,
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

  componentDidUpdate (props, state) {
    let ifameDocument = document.querySelector('#vcv-editor-iframe').contentWindow
    if (this.state.dragging && !state.dragging) {
      vcCake.setData('vcv:layoutCustomMode', 'columnResizer')
      ifameDocument.addEventListener('mousemove', this.handleMouseMove)
      ifameDocument.addEventListener('mouseup', this.handleMouseUp)
      vcCake.setData('vcv:layoutColumnResize', ColumnResizer.data.rowId)
    } else if (!this.state.dragging && state.dragging) {
      vcCake.setData('vcv:layoutCustomMode', null)
      vcCake.setData('vcv:layoutColumnResize', null)
      ifameDocument.removeEventListener('mousemove', this.handleMouseMove)
      ifameDocument.removeEventListener('mouseup', this.handleMouseUp)
    }
  }

  getRowData (e) {
    let $helper = ReactDOM.findDOMNode(this)
    let $rightCol = $helper.nextElementSibling
    let $leftCol = $helper.previousElementSibling
    let rtl = false
    if ($leftCol.getBoundingClientRect().left > $rightCol.getBoundingClientRect().left) {
      $rightCol = $helper.previousElementSibling
      $leftCol = $helper.nextElementSibling
      rtl = true
    }
    let rightColId = $rightCol ? $rightCol.id.replace('el-', '') : null
    let leftColId = $leftCol ? $leftCol.id.replace('el-', '') : null
    let rowId = vcCake.getService('document').get(rightColId || leftColId).parent
    let rowData = vcCake.getService('document').get(rowId)
    let columnGap = rowData.columnGap ? parseInt(rowData.columnGap) : 0
    let rowWidth = $helper.parentElement.getBoundingClientRect().width + columnGap
    let bothColumnsWidth = ($leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width + columnGap * 2) / rowWidth
    let bothColumnsWidthPx = $leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width
    let allColumns = [].slice.call($helper.parentElement.querySelectorAll('.vce-col'))
    let leftColumnIndex = ''
    allColumns.forEach((column, index) => {
      if (column === $leftCol) {
        leftColumnIndex = index
      }
    })

    ColumnResizer.data.rowId = rowId
    ColumnResizer.data.rowData = rowData
    ColumnResizer.data.helper = $helper
    ColumnResizer.data.rightColumn = $rightCol
    ColumnResizer.data.leftColumn = $leftCol
    ColumnResizer.data.bothColumnsWidth = bothColumnsWidth
    ColumnResizer.data.bothColumnsWidthPx = bothColumnsWidthPx
    ColumnResizer.data.columnGap = columnGap
    ColumnResizer.data.mousePosition = e.clientX
    ColumnResizer.data.leftColumnIndex = leftColumnIndex
    ColumnResizer.data.rightColumnIndex = rtl ? leftColumnIndex - 1 : leftColumnIndex + 1
  }

  handleMouseDown (e) {
    if (e.nativeEvent.which === 1) {
      this.getRowData(e)
      this.getResizerPositions(e)
      this.createWrapBlockers()
      this.setResizeLabelsPosition(e)
      let colSizes = this.getResizedColumnsWidth(e)

      this.setState({
        dragging: true,
        leftColPercentage: colSizes.leftCol,
        rightColPercentage: colSizes.rightCol
      })
    }
  }

  getResizerPositions (e) {
    let positions = []
    let currentResizer = e.currentTarget

    let allResizers = document.querySelector('#vcv-editor-iframe').contentWindow.document.querySelectorAll('.vce-column-resizer-handler')
    allResizers = [].slice.call(allResizers)

    allResizers.forEach((resizer) => {
      if (resizer !== currentResizer && window.getComputedStyle(resizer.parentElement).getPropertyValue('display') !== 'none') {
        let resizerClientRect = resizer.getBoundingClientRect()
        let position = resizerClientRect.left + resizerClientRect.width / 2
        if (positions.indexOf(position) < 0) {
          positions.push(position)
        }
      }
    })

    ColumnResizer.data.resizerPositions = positions
  }

  handleMouseUp (e) {
    this.setState({ dragging: false })
    this.removeWrapBlockers()
    this.rebuildRowLayout()
    this.removeTemporaryColStyles()
  }

  handleMouseMove (e) {
    if (!this.state.dragging) {
      return
    }
    this.renderTemporaryColStyles(e)
    this.setResizeLabelsPosition(e)
  }

  setResizeLabelsPosition (e) {
    let labelPosition = e.clientY - ColumnResizer.data.helper.getBoundingClientRect().top
    this.setState({ labelPosition: labelPosition })
  }

  renderTemporaryColStyles (e) {
    let columnGap = ColumnResizer.data.columnGap
    let colSizes = this.getResizedColumnsWidth(e)
    let resizerPercentages = colSizes.leftCol
    let rightResizerPercentages = colSizes.rightCol

    let equalSpace = columnGap * (resizerPercentages * 100 - 1)
    let rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
    let gapSpace = columnGap * (100 - 1)

    let $row = ColumnResizer.data.helper.parentElement
    let rowWidth = $row.getBoundingClientRect().width

    let mouseLeftPosition = e.clientX
    ColumnResizer.data.resizerPositions.forEach((position) => {
      let minPosition = Math.round(position) - ColumnResizer.data.snapWidth
      let maxPosition = Math.round(position) + ColumnResizer.data.snapWidth
      if (mouseLeftPosition > minPosition && mouseLeftPosition < maxPosition) {
        let fullRowWidth = rowWidth + ColumnResizer.data.columnGap
        let resizerWidth = position - ColumnResizer.data.leftColumn.getBoundingClientRect().left + ColumnResizer.data.columnGap / 2
        let leftCol = resizerWidth / fullRowWidth

        resizerPercentages = leftCol
        rightResizerPercentages = ColumnResizer.data.bothColumnsWidth - leftCol
        equalSpace = columnGap * (resizerPercentages * 100 - 1)
        rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
      }
    })

    let leftWidth = `calc((100% - ${gapSpace}px) * ${resizerPercentages} + ${equalSpace}px)`
    let rightWidth = `calc((100% - ${gapSpace}px) * ${rightResizerPercentages} + ${rightEqualSpace}px)`

    if (ColumnResizer.data.mousePosition > e.clientX) {
      let left = (rowWidth - gapSpace) * resizerPercentages + equalSpace
      let right = ColumnResizer.data.rightColumn.getBoundingClientRect().width

      if ((left + right) < ColumnResizer.data.bothColumnsWidthPx) {
        ColumnResizer.data.leftColumn.style.flexBasis = leftWidth
        ColumnResizer.data.leftColumn.style.maxWidth = leftWidth

        ColumnResizer.data.rightColumn.style.flexBasis = ColumnResizer.data.bothColumnsWidthPx - ColumnResizer.data.leftColumn.getBoundingClientRect().width + 'px'
        ColumnResizer.data.rightColumn.style.maxWidth = ColumnResizer.data.bothColumnsWidthPx - ColumnResizer.data.leftColumn.getBoundingClientRect().width + 'px'
      }
    } else if (ColumnResizer.data.mousePosition < e.clientX) {
      let left = ColumnResizer.data.leftColumn.getBoundingClientRect().width
      let right = (rowWidth - gapSpace) * rightResizerPercentages + rightEqualSpace
      if ((left + right) < ColumnResizer.data.bothColumnsWidthPx) {
        ColumnResizer.data.rightColumn.style.flexBasis = rightWidth
        ColumnResizer.data.rightColumn.style.maxWidth = rightWidth

        ColumnResizer.data.leftColumn.style.flexBasis = ColumnResizer.data.bothColumnsWidthPx - ColumnResizer.data.rightColumn.getBoundingClientRect().width + 'px'
        ColumnResizer.data.leftColumn.style.maxWidth = ColumnResizer.data.bothColumnsWidthPx - ColumnResizer.data.rightColumn.getBoundingClientRect().width + 'px'
      }
    }

    let columnCalc = (100 * columnGap) + (rowWidth - gapSpace)
    let leftCol = columnGap + ColumnResizer.data.leftColumn.getBoundingClientRect().width
    let rightCol = columnGap + ColumnResizer.data.rightColumn.getBoundingClientRect().width
    let leftPercentage = leftCol / columnCalc
    let rightPercentage = rightCol / columnCalc

    this.setLabelPercentages(leftPercentage, rightPercentage)

    ColumnResizer.data.mousePosition = e.clientX
  }

  removeTemporaryColStyles () {
    ColumnResizer.data.leftColumn.style = {}
    ColumnResizer.data.rightColumn.style = {}
  }

  createWrapBlockers () {
    let $resizer = ColumnResizer.data.helper
    let firstRowElement = this.getSibling($resizer, 'prev', 'vce-col--first')
    let blockElement = document.createElement('div')
    blockElement.className = 'vce-column-wrap-blocker'

    if (firstRowElement) {
      firstRowElement.parentNode.insertBefore(blockElement, firstRowElement)
    }
  }

  removeWrapBlockers () {
    let blocker = ColumnResizer.data.helper.parentNode.querySelector('.vce-column-wrap-blocker')
    blocker.parentNode.removeChild(blocker)
  }

  getSibling (element, direction, className) {
    let sibling = null
    if (direction === 'prev') {
      direction = 'previousElementSibling'
    } else if (direction === 'next') {
      direction = 'nextElementSibling'
    } else {
      return null
    }

    let getElementSibling = (element, dir) => {
      let siblingElement = element[ dir ]
      if (!siblingElement) {
        return null
      }
      let siblingClasses = element[ dir ].className.split(' ')
      if (siblingClasses.indexOf(className) > -1) {
        sibling = element[ dir ]
      } else {
        getElementSibling(element[ dir ], dir)
      }
    }
    getElementSibling(element, direction)
    return sibling
  }

  setLabelPercentages (left, right) {
    this.setState({
      leftColPercentage: left,
      rightColPercentage: right
    })
  }

  getResizedColumnsWidth (e, leftColumn) {
    let $row = ColumnResizer.data.helper.parentElement
    let rowWidth = $row.getBoundingClientRect().width + ColumnResizer.data.columnGap
    let resizerWidth = e.clientX - (leftColumn || ColumnResizer.data.leftColumn.getBoundingClientRect().left) + ColumnResizer.data.columnGap / 2
    let leftCol = resizerWidth / rowWidth
    return { leftCol: leftCol, rightCol: ColumnResizer.data.bothColumnsWidth - leftCol }
  }

  rebuildRowLayout () {
    const parentRow = vcCake.getService('document').get(ColumnResizer.data.rowId)
    let layoutData = vcCake.getService('document').children(ColumnResizer.data.rowId)
      .map((element) => {
        return element.size || '100%'
      })
    let leftSize = (Math.round(this.state.leftColPercentage * 10000) / 10000) * 100
    leftSize = leftSize.toString().slice(0, leftSize.toString().indexOf('.') + 3)
    let rightSize = (Math.round(this.state.rightColPercentage * 10000) / 10000) * 100
    rightSize = rightSize.toString().slice(0, rightSize.toString().indexOf('.') + 3)
    layoutData[ ColumnResizer.data.leftColumnIndex ] = `${leftSize}%`
    layoutData[ ColumnResizer.data.rightColumnIndex ] = `${rightSize}%`
    parentRow.layout.layoutData = layoutData
    this.props.api.request('data:update', parentRow.id, parentRow)
  }

  render () {
    let resizerLabels = ''
    if (this.state.dragging) {
      let labelProps = {
        style: {
          top: `${this.state.labelPosition}px`
        }
      }
      resizerLabels = (
        <div className='vce-column-resizer-label-container' {...labelProps}>
          <div className='vce-column-resizer-label vce-column-resizer-label-left'>
            <svg width='5px' height='23px' viewBox='0 0 5 23'
              version='1.1'
              xmlns='http://www.w3.org/2000/svg'>
              <g id='Page-1' stroke='none' strokeWidth='1' fill='#282828' fillRule='evenodd' opacity='0.5'>
                <path
                  d='M9.67660985,2.33058017e-12 L35.1786526,0 C37.9367983,0 40.1727172,2.24721412 40.1727172,4.99065745 L40.1727172,18.0093426 C40.1727172,20.7656066 37.9304373,23 35.1786526,23 L9.67660985,23 C9.12217523,23 8.35313873,22.6804216 7.97065195,22.2979348 L0.582842894,12.9101257 C-0.195948043,12.1313348 -0.192612096,10.8653293 0.582842894,10.0898743 L7.97065195,0.702065207 C8.35839186,0.3143253 9.12167598,2.33058017e-12 9.67660985,2.33058017e-12 Z'
                  transform='translate(20.086359, 11.500000) scale(-1, 1) translate(-20.086359, -11.500000)' />
              </g>
            </svg>
            <div className='vce-column-resizer-label-background'>
              <span
                className='vce-column-resizer-label-percentage'>{Math.round(this.state.leftColPercentage * 100) + '%'}</span>
            </div>
            <svg width='11px' height='23px' viewBox='0 0 11 23'
              version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <g id='Page-1' stroke='none' strokeWidth='1' fillRule='evenodd' opacity='0.5'
                transform='translate(-30.000000, 0.000000)' fill='#282828'>
                <path
                  d='M9.67660985,2.33058017e-12 L35.1786526,0 C37.9367983,0 40.1727172,2.24721412 40.1727172,4.99065745 L40.1727172,18.0093426 C40.1727172,20.7656066 37.9304373,23 35.1786526,23 L9.67660985,23 C9.12217523,23 8.35313873,22.6804216 7.97065195,22.2979348 L0.582842894,12.9101257 C-0.195948043,12.1313348 -0.192612096,10.8653293 0.582842894,10.0898743 L7.97065195,0.702065207 C8.35839186,0.3143253 9.12167598,2.33058017e-12 9.67660985,2.33058017e-12 Z'
                  transform='translate(20.086359, 11.500000) scale(-1, 1) translate(-20.086359, -11.500000)' />
              </g>
            </svg>
          </div>
          <div className='vce-column-resizer-label vce-column-resizer-label-right'>
            <svg width='10px' height='23px' viewBox='0 0 10 23' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <g id='Page-1' stroke='none' strokeWidth='1' fillRule='evenodd' fill='#282828' opacity='0.5'>
                <path
                  d='M9.67660985,2.33058017e-12 L35.1786526,0 C37.9367983,0 40.1727172,2.24721412 40.1727172,4.99065745 L40.1727172,18.0093426 C40.1727172,20.7656066 37.9304373,23 35.1786526,23 L9.67660985,23 C9.12217523,23 8.35313873,22.6804216 7.97065195,22.2979348 L0.582842894,12.9101257 C-0.195948043,12.1313348 -0.192612096,10.8653293 0.582842894,10.0898743 L7.97065195,0.702065207 C8.35839186,0.3143253 9.12167598,2.33058017e-12 9.67660985,2.33058017e-12 Z' />
              </g>
            </svg>
            <div className='vce-column-resizer-label-background'>
              <span
                className='vce-column-resizer-label-percentage'>{Math.round(this.state.rightColPercentage * 100) + '%'}</span>
            </div>
            <svg width='6px' height='23px' viewBox='0 0 6 23' version='1.1' xmlns='http://www.w3.org/2000/svg'>
              <g id='Page-1' stroke='none' strokeWidth='1' fillRule='evenodd' fill='#282828' opacity='0.5'>
                <path
                  d='M-25.3233902,2.33058017e-12 L0.178652594,0 C2.93679829,0 5.17271716,2.24721412 5.17271716,4.99065745 L5.17271716,18.0093426 C5.17271716,20.7656066 2.93043732,23 0.178652594,23 L-25.3233902,23 C-25.8778248,23 -26.6468613,22.6804216 -27.029348,22.2979348 L-34.4171571,12.9101257 C-35.195948,12.1313348 -35.1926121,10.8653293 -34.4171571,10.0898743 L-27.029348,0.702065207 C-26.6416081,0.3143253 -25.878324,2.33058017e-12 -25.3233902,2.33058017e-12 Z' />
              </g>
            </svg>
          </div>
        </div>
      )
    }

    return (
      <vcvhelper className='vce-column-resizer'>
        <div className='vce-column-resizer-handler' onMouseDown={this.handleMouseDown} ref='resizerHandler'>
          {resizerLabels}
        </div>
      </vcvhelper>
    )
  }
}

export default ColumnResizer
