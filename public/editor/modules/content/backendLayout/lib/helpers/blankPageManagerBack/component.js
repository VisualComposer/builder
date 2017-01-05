import React from 'react'
import BlankPage from '../../../../../../../resources/components/layoutHelpers/blankPage/component'

export default class BlankPageManagerBack extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    layoutData: React.PropTypes.object
  }

  static defaultProps = {
    layoutData: {
      getData () {
        this.blankPageContainer = document.querySelector('.vcv-blank-page-container')
        this.controlsContainer = this.blankPageContainer.querySelector('.vcv-blank-page-controls')
        this.rowContainer = this.blankPageContainer.querySelector('.vcv-blank-page-controls-container')
        this.controlRows = this.rowContainer.querySelectorAll('.vcv-blank-page-controls-row')
        this.controlRow = this.rowContainer.querySelector('.vcv-blank-page-controls-row')
        this.controls = this.controlRow.children
        this.controlStyle = window.getComputedStyle(this.controls[0])
        this.controlMargins = parseFloat(this.controlStyle['marginLeft']) + parseFloat(this.controlStyle['marginRight'])
        this.controlWidth = this.controls[0].offsetWidth + this.controlMargins
      }
    }
  }

  constructor (props) {
    super(props)
    this.setControlsLayout = this.setControlsLayout.bind(this)
    this.state = {
      minElementsCount: 4
    }
  }

  componentDidMount () {
    this.props.layoutData.getData()
    this.setControlsLayout()
  }

  componentWillMount () {
    window.addEventListener('resize', this.setControlsLayout)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.setControlsLayout)
  }

  getContainerWidth () {
    let { controlsContainer, controlMargins } = this.props.layoutData
    let computedStyles = window.getComputedStyle(controlsContainer)
    return parseFloat(computedStyles.width) + controlMargins
  }

  getMaxElementsData () {
    let containerWidth = this.getContainerWidth()
    let controlWidth = this.props.layoutData.controlWidth
    let elementsCount = Math.floor(containerWidth / controlWidth)
    let elementsWidth = elementsCount * controlWidth
    return {
      elementsCount: elementsCount,
      elementsWidth: elementsWidth
    }
  }

  setControlsLayout () {
    let {elementsCount, elementsWidth} = this.getMaxElementsData()
    let { controlMargins, rowContainer, controlRows } = this.props.layoutData
    controlRows = Array.from(controlRows)
    if (elementsCount < this.state.minElementsCount) {
      controlRows.forEach((controlRow) => {
        controlRow.classList.add('vcv-ui-element-controls--lock-width')
      })
      rowContainer.style.maxWidth = false
    } else {
      controlRows.forEach((controlRow) => {
        controlRow.classList.remove('vcv-ui-element-controls--lock-width')
      })
      rowContainer.style.maxWidth = elementsWidth - controlMargins + 'px'
    }
  }

  render () {
    return <BlankPage api={this.props.api} />
  }
}
