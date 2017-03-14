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
      dragging: false
    }
  }

  static data = {
    rowId: null,
    rowData: null,
    helper: null,
    rightColumn: null,
    leftColumn: null,
    bothColumnsWidth: null
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

  getRowData () {
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

    ColumnResizer.data.rowId = rowId
    ColumnResizer.data.rowData = rowData
    ColumnResizer.data.helper = $helper
    ColumnResizer.data.rightColumn = $rightCol
    ColumnResizer.data.leftColumn = $leftCol
    ColumnResizer.data.bothColumnsWidth = bothColumnsWidth
  }

  handleMouseDown (e) {
    if (e.nativeEvent.which === 1) {
      this.setState({ dragging: true })
      this.getRowData()
    }
  }

  handleMouseUp (e) {
    this.setState({ dragging: false })

    // let leftColSize = '20'
    // let rightColSize = '30'

    // todo @VZ this is for updating row data
    // this.updateColumnMixin(rowId, [ leftColSize, rightColSize ])
    // this.resizeColumns($leftCol.id.replace('el-', ''), $rightCol.id.replace('el-', ''), leftColSize, rightColSize, rowId)
  }

  handleMouseMove (e) {
    if (!this.state.dragging) {
      return
    }
    this.renderTemporaryColStyles(e)
  }

  renderTemporaryColStyles (e) {
    let $row = ColumnResizer.data.helper.parentElement
    let rowClientRect = $row.getBoundingClientRect()
    let columnGap = ColumnResizer.data.rowData.columnGap ? parseInt(ColumnResizer.data.rowData.columnGap) : 0
    let rowWidth = rowClientRect.width + columnGap
    let resizerWidth = e.clientX - ColumnResizer.data.leftColumn.getBoundingClientRect().left + columnGap / 2
    let resizerPercentages = resizerWidth / rowWidth

    let bothColumnsWidth = ColumnResizer.data.bothColumnsWidth

    let rightResizerPercentages = bothColumnsWidth - resizerPercentages
    let equalSpace = columnGap * (resizerPercentages * 100 - 1)
    let rightEqualSpace = columnGap * (rightResizerPercentages * 100 - 1)
    let gapSpace = columnGap * (100 - 1)

    let leftWidth = `calc((100% - ${gapSpace}px) * ${resizerPercentages} + ${equalSpace}px)`
    let rightWidth = `calc((100% - ${gapSpace}px) * ${rightResizerPercentages} + ${rightEqualSpace}px)`

    ColumnResizer.data.leftColumn.style.flexBasis = leftWidth
    ColumnResizer.data.leftColumn.style.maxWidth = leftWidth

    ColumnResizer.data.rightColumn.style.flexBasis = rightWidth
    ColumnResizer.data.rightColumn.style.maxWidth = rightWidth
  }

  updateColumnMixin (rowId, sizes) {
    let rowData = vcCake.getService('document').get(rowId)

    let newMixins = {}
    for (let i = 0; i < sizes.length; i++) {
      let percentage = parseFloat(sizes[ i ]) / 100
      let mixinName = `customColumnMixinResize${i}`
      // todo change 'columnStyleMixin:col0:md'
      newMixins[ mixinName ] = lodash.defaultsDeep({}, rowData.layout.attributeMixins[ 'columnStyleMixin:col0:md' ])
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
    return (
      <vcvhelper className='vce-column-resizer'>
        <div className='vce-column-resizer-handler' onMouseDown={this.handleMouseDown}>
          <div className='vce-column-resizer-helper-container'>
            <span className='vce-column-resizer-helper vce-column-resizer-helper-left'>33%</span>
            <span className='vce-column-resizer-helper vce-column-resizer-helper-right'>33%</span>
          </div>
        </div>
      </vcvhelper>
    )
  }
}

export default ColumnResizer
