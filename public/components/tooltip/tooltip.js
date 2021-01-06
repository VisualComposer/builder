import React from 'react'
import classNames from 'classnames'
import TooltipBox from './tooltipBox'

export default class Tooltip extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isVisible: false,
      showAtTop: false
    }

    this.tooltipRef = React.createRef()
    this.tooltipButtonRef = React.createRef()

    this.handleTooltipClick = this.handleTooltipClick.bind(this)
    this.closeIfNotInside = this.closeIfNotInside.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.setTopState = this.setTopState.bind(this)
  }

  componentDidMount () {
    const relativeElementSelector = this.props.relativeElementSelector || '.vcv-ui-scroll'
    this.overflowContainer = (this.tooltipRef.current && this.tooltipRef.current.closest(relativeElementSelector)) || document.body
  }

  componentWillUnmount () {
    document.body.removeEventListener('click', this.closeIfNotInside)
  }

  closeIfNotInside (e) {
    const $el = e.target
    const tooltipBox = $el.closest('.vcv-tooltip-box')

    if (tooltipBox || $el === this.tooltipButtonRef.current) {
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

  handleMouseEnter () {
    this.setState({ isHovered: true })
  }

  handleMouseLeave () {
    this.setState({ isHovered: false })
  }

  setTopState () {
    this.setState({ showAtTop: true })
  }

  render () {
    const { isVisible, isHovered } = this.state
    let tooltipBox = null

    if (isVisible || isHovered) {
      const boxStyles = this.getTooltipPosition()

      tooltipBox = (
        <TooltipBox
          boxStyles={boxStyles}
          setTopState={this.setTopState}
        >
          {this.props.children}
        </TooltipBox>
      )
    }

    const iconClasses = classNames({
      'vcv-tooltip-button': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-question': true,
      'vcv-ui-icon--active': isVisible || isHovered,
      'vcv-ui-icon--light-hover': this.props.isLightHover
    })

    const tooltipClasses = classNames({
      'vcv-tooltip-container': true,
      'vcv-tooltip-container--box-position--top': this.state.showAtTop
    })

    return (
      <div className={tooltipClasses} ref={this.tooltipRef}>
        <i
          ref={this.tooltipButtonRef}
          className={iconClasses}
          onClick={this.handleTooltipClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        {tooltipBox}
      </div>
    )
  }
}
