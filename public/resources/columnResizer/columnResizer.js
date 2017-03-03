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

  handleMouseDown (e) {
    this.setState({ dragging: true })
  }

  handleMouseUp (e) {
    this.setState({ dragging: false })

    let $helper = ReactDOM.findDOMNode(this)
    let $rightCol = $helper.nextElementSibling
    let $leftCol = $helper.previousElementSibling
    let rowId = vcCake.getService('document').get($leftCol.id.replace('el-', '')).parent

    let leftColSize = '20'
    let rightColSize = '30'

    this.updateColumnMixin(rowId, [ leftColSize, rightColSize ])
    this.resizeColumns($leftCol.id.replace('el-', ''), $rightCol.id.replace('el-', ''), leftColSize, rightColSize, rowId)
  }

  handleMouseMove (e) {
    if (!this.state.dragging) {
      return
    }
    this.renderTemporaryColStyles(e)
  }

  renderTemporaryColStyles (e) {
    let $helper = ReactDOM.findDOMNode(this)
    // let $rightCol = $helper.nextElementSibling
    let $leftCol = $helper.previousElementSibling
    let $row = $helper.parentElement
    // let rowId = vcCake.getService('document').get($leftCol.id.replace('el-', '')).parent

    // let columnGap = vcCake.getService('document').get(rowId).columnGap
    let rowWidth = $row.getBoundingClientRect().width
    // let fullRowWidth = parseInt(rowWidth) + parseInt(columnGap)

    // let leftColWidth = $leftCol.getBoundingClientRect().width + columnGap
    // let rightColWidth = $rightCol.getBoundingClientRect().width + columnGap
    let resizerWidth = e.clientX - $row.getBoundingClientRect().left

    let resizerPercentages = resizerWidth / rowWidth * 100
    resizerPercentages = resizerPercentages.toString().split('.')[ 0 ] + '%'

    let leftStyle = window.getComputedStyle($leftCol)[ 'flex-basis' ].replace(/\d*%/g, resizerPercentages)

    $leftCol.style.flexBasis = leftStyle
    $leftCol.style.maxWidth = leftStyle
  }

  updateColumnMixin (rowId, sizes) {
    let rowData = vcCake.getService('document').get(rowId)

    let newMixins = {}
    for (let i = 0; i < sizes.length; i++) {
      let percentage = parseFloat(sizes[ i ]) / 100
      let mixinName = `customColumnMixinResize${i}`
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
        <div className='vce-column-resizer-handler' onMouseDown={this.handleMouseDown} />
      </vcvhelper>
    )
  }
}

export default ColumnResizer
