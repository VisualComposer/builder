import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import lodash from 'lodash'

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
    mousePosition: null
  }

  componentDidUpdate (props, state) {
    let ifameDocument = document.querySelector('#vcv-editor-iframe').contentWindow
    if (this.state.dragging && !state.dragging) {
      ifameDocument.addEventListener('mousemove', this.handleMouseMove)
      ifameDocument.addEventListener('mouseup', this.handleMouseUp)
    } else if (!this.state.dragging && state.dragging) {
      ifameDocument.removeEventListener('mousemove', this.handleMouseMove)
      ifameDocument.removeEventListener('mouseup', this.handleMouseUp)
    }
  }

  getRowData (e) {
    let $helper = ReactDOM.findDOMNode(this)
    let $rightCol = $helper.nextElementSibling
    let $leftCol = $helper.previousElementSibling
    let rightColId = $rightCol ? $rightCol.id.replace('el-', '') : null
    let leftColId = $leftCol ? $leftCol.id.replace('el-', '') : null
    let rowId = vcCake.getService('document').get(rightColId || leftColId).parent
    let rowData = vcCake.getService('document').get(rowId)
    let columnGap = rowData.columnGap ? parseInt(rowData.columnGap) : 0
    let rowWidth = $helper.parentElement.getBoundingClientRect().width + columnGap
    let bothColumnsWidth = ($leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width + columnGap * 2) / rowWidth
    let bothColumnsWidthPx = $leftCol.getBoundingClientRect().width + $rightCol.getBoundingClientRect().width

    ColumnResizer.data.rowId = rowId
    ColumnResizer.data.rowData = rowData
    ColumnResizer.data.helper = $helper
    ColumnResizer.data.rightColumn = $rightCol
    ColumnResizer.data.leftColumn = $leftCol
    ColumnResizer.data.bothColumnsWidth = bothColumnsWidth
    ColumnResizer.data.bothColumnsWidthPx = bothColumnsWidthPx
    ColumnResizer.data.columnGap = columnGap
    ColumnResizer.data.mousePosition = e.clientX
  }

  handleMouseDown (e) {
    if (e.nativeEvent.which === 1) {
      this.getRowData(e)
      let colSizes = this.getResizedColumnsWidth(e)
      let labelPosition = e.clientY - ColumnResizer.data.helper.getBoundingClientRect().top

      this.setState({
        dragging: true,
        leftColPercentage: Math.round(colSizes.leftCol * 100),
        rightColPercentage: Math.round(colSizes.rightCol * 100),
        labelPosition: labelPosition
      })
    }
  }

  handleMouseUp (e) {
    this.setState({ dragging: false })
    //
    // let leftColSize = Math.round(this.state.leftColPercentage).toString()
    // let rightColSize = Math.round(this.state.rightColPercentage).toString()
    //
    // this.updateColumnMixin(ColumnResizer.data.rowId, [ leftColSize, rightColSize ])
    // this.resizeColumns(ColumnResizer.data.leftColumn.id.replace('el-', ''), ColumnResizer.data.rightColumn.id.replace('el-', ''), leftColSize, rightColSize, ColumnResizer.data.rowId)
  }

  handleMouseMove (e) {
    if (!this.state.dragging) {
      return
    }
    this.renderTemporaryColStyles(e)
  }

  renderTemporaryColStyles (e) {
    let columnGap = ColumnResizer.data.columnGap
    let colSizes = this.getResizedColumnsWidth(e)
    let resizerPercentages = colSizes.leftCol
    let rightResizerPercentages = colSizes.rightCol

    let equalSpace = columnGap * (resizerPercentages * 100 - 1)
    let rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
    let gapSpace = columnGap * (100 - 1)

    let leftWidth = `calc((100% - ${gapSpace}px) * ${resizerPercentages} + ${equalSpace}px)`
    let rightWidth = `calc((100% - ${gapSpace}px) * ${rightResizerPercentages} + ${rightEqualSpace}px)`

    let $row = ColumnResizer.data.helper.parentElement
    let rowWidth = $row.getBoundingClientRect().width

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

    this.setLabelPercentages(Math.floor(leftPercentage * 100), Math.floor(rightPercentage * 100))

    ColumnResizer.data.mousePosition = e.clientX
  }

  setLabelPercentages (left, right) {
    this.setState({
      leftColPercentage: left,
      rightColPercentage: right
    })
  }

  getResizedColumnsWidth (e) {
    let $row = ColumnResizer.data.helper.parentElement
    let rowWidth = $row.getBoundingClientRect().width + ColumnResizer.data.columnGap
    let resizerWidth = e.clientX - ColumnResizer.data.leftColumn.getBoundingClientRect().left + ColumnResizer.data.columnGap / 2
    let leftCol = resizerWidth / rowWidth
    return { leftCol: leftCol, rightCol: ColumnResizer.data.bothColumnsWidth - leftCol }
  }

  updateColumnMixin (rowId, sizes) {
    let rowData = vcCake.getService('document').get(rowId)
    // let rowElement = vcCake.getService('cook').get(rowData)
    // console.log(rowElement.settings('layout').type.component && rowElement.settings('layout').type.component.buildMixins(rowData))

    let newMixins = {}
    for (let i = 0; i < sizes.length; i++) {
      let percentage = parseFloat(sizes[ i ]) / 100
      let mixinName = `customColumnMixinResize${i}`
      newMixins[ mixinName ] = lodash.defaultsDeep({}, rowData.layout.attributeMixins[ Object.keys(rowData.layout.attributeMixins)[ 0 ] ])
      newMixins[ mixinName ].variables.percentageSelector.value = sizes[ i ]
      newMixins[ mixinName ].variables.percentage.value = percentage.toString()
      rowData.layout.attributeMixins[ mixinName ] = newMixins[ mixinName ]
    }
    // vcCake.setData(`element:instantMutation:${rowId}`, elementData)
    this.props.api.request('data:instantMutation', rowData, 'update')
  }

  resizeColumns (leftColId, rightColId, leftColSize, rightColSize) {
    let leftCol = vcCake.getService('document').get(leftColId)
    let rightCol = vcCake.getService('document').get(rightColId)
    leftCol.size = leftColSize + '%'
    rightCol.size = rightColSize + '%'
    this.props.api.request('data:update', leftCol.id, leftCol)
    this.props.api.request('data:update', rightCol.id, rightCol)
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
              <span className='vce-column-resizer-label-percentage'>{this.state.leftColPercentage + '%'}</span>
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
              <span className='vce-column-resizer-label-percentage'>{this.state.rightColPercentage + '%'}</span>
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
        <div className='vce-column-resizer-handler' onMouseDown={this.handleMouseDown}>
          {resizerLabels}
        </div>
      </vcvhelper>
    )
  }
}

export default ColumnResizer
