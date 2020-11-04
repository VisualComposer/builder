import React from 'react'
import classNames from 'classnames'

export default class Tooltip extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isVisible: false
    }

    this.tooltipRef = React.createRef()

    this.handleTooltipClick = this.handleTooltipClick.bind(this)
    this.closeIfNotInside = this.closeIfNotInside.bind(this)
  }

  componentDidMount () {
    this.overflowContainer = this.tooltipRef.current.closest('.vcv-ui-scroll') || document.body
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.closeIfNotInside)
  }

  closeIfNotInside (e) {
    e && e.preventDefault()
    const $el = e.target

    const $dropDown = '.vcv-tooltip-button'
    const $openingButton = '.vcv-tooltip-box'
    const container = $el.closest($dropDown) || $el.closest($openingButton)

    if (container) {
      return
    }

    this.handleTooltipClick()
  }

  handleTooltipClick () {
    if (this.state.isVisible) {
      document.body.removeEventListener('click', this.closeIfNotInside)
    } else {
      document.body.addEventListener('click', this.closeIfNotInside)
    }

    this.setState({ isVisible: !this.state.isVisible })
  }

  getTooltipPosition () {
    const tooltipWidth = 234
    const tooltipContainer = this.tooltipRef.current
    const overflowContainer = this.overflowContainer
    const tooltipContainerRect = tooltipContainer.getBoundingClientRect()
    const overflowContainerRect = overflowContainer.getBoundingClientRect()

    let left = -(tooltipWidth / 2)

    if (tooltipContainerRect.left - overflowContainerRect.left < tooltipWidth / 2) {
      left = overflowContainerRect.left - tooltipContainerRect.left + 3
    } else if (overflowContainerRect.right - tooltipContainerRect.right < tooltipWidth / 2) {
      left = -(tooltipWidth - overflowContainerRect.right + tooltipContainerRect.left + 3)
    }

    return {
      left: left
    }
  }

  render () {
    const { isVisible } = this.state
    let tooltipBox = null

    if (isVisible) {
      const boxStyles = this.getTooltipPosition()

      tooltipBox = (
        <div className='vcv-tooltip-box' style={boxStyles}>
          {this.props.children}
        </div>
      )
    }

    const iconClasses = classNames({
      'vcv-tooltip-button': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-question': true,
      'vcv-ui-icon--active': isVisible
    })

    return (
      <div className='vcv-tooltip-container' ref={this.tooltipRef}>
        <i
          className={iconClasses}
          onClick={this.handleTooltipClick}
        />
        {tooltipBox}
      </div>
    )
  }
}
