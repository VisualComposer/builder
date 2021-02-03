import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { smoothScroll } from 'public/tools/domManipulation'

export default class NavigationSlider extends React.Component {
  static propTypes = {
    controls: PropTypes.object.isRequired,
    activeSection: PropTypes.string.isRequired,
    setActiveSection: PropTypes.func.isRequired,
    activeSubControl: PropTypes.string
  }

  constructor (props) {
    super(props)
    this.state = {
      showControls: false,
      scrolledToLeft: true,
      scrolledToRight: false
    }
    this.controlsWidth = 70

    this.navigationContainerRef = React.createRef()
    this.navigationSliderRef = React.createRef()
    this.navigationControlsRef = React.createRef()

    this.handleResize = this.handleResize.bind(this)
    this.getDropdownItems = this.getDropdownItems.bind(this)
    this.listenForScroll = this.listenForScroll.bind(this)
    this.handleItemMouseEnter = this.handleItemMouseEnter.bind(this)

    this.resizeObserver = new window.ResizeObserver(this.handleResize)
  }

  componentDidMount () {
    this.resizeObserver.observe(this.navigationContainerRef.current)
    this.navigationSliderRef.current.addEventListener('scroll', this.listenForScroll)
    this.handleResize()
  }

  componentWillUnmount () {
    this.resizeObserver.unobserve(this.navigationContainerRef.current)
    this.navigationSliderRef.current.remove('scroll', this.listenForScroll)
  }

  listenForScroll () {
    const sliderRect = this.navigationSliderRef.current.getBoundingClientRect()
    const firstItem = this.navigationSliderRef.current.firstChild
    const firstItemRect = firstItem.getBoundingClientRect()

    const lastItem = this.navigationSliderRef.current.lastChild
    const lastItemRect = lastItem.getBoundingClientRect()

    this.setState({
      scrolledToLeft: firstItemRect.left >= sliderRect.left,
      scrolledToRight: lastItemRect.left + lastItemRect.width <= sliderRect.left + sliderRect.width
    })
  }

  handleResize () {
    const containerWidth = this.navigationContainerRef.current.getBoundingClientRect().width
    const sliderWidth = this.navigationSliderRef.current.getBoundingClientRect().width
    const isControlsVisible = containerWidth <= sliderWidth + this.controlsWidth

    this.setState({ showControls: isControlsVisible })

    this.listenForScroll()
  }

  handleClick (data, event) {
    const { type, index, activeSubControl } = data
    this.props.setActiveSection(type, index, activeSubControl)

    const clickedItem = event && event.target && event.target.closest('.vcv-ui-navigation-slider-item')
    if (clickedItem) {
      const clickedItemRect = clickedItem.getBoundingClientRect()
      const slider = this.navigationSliderRef.current
      const sliderRect = slider.getBoundingClientRect()

      if (clickedItemRect.left < sliderRect.left) {
        smoothScroll(slider, slider.scrollLeft + (clickedItemRect.left - sliderRect.left))
      } else if (clickedItemRect.width + clickedItemRect.left > sliderRect.width + sliderRect.left) {
        smoothScroll(slider, slider.scrollLeft + (clickedItemRect.width + clickedItemRect.left) - (sliderRect.width + sliderRect.left))
      }
    }
  }

  handleItemMouseEnter (event) {
    const item = event.currentTarget
    const itemRect = item.getBoundingClientRect()
    const dropdown = item.querySelector('.vcv-ui-navigation-slider-dropdown')
    const dropdownRect = dropdown.getBoundingClientRect()
    const container = this.navigationContainerRef.current
    const containerRect = container.getBoundingClientRect()

    let leftOffset = itemRect.left - containerRect.left

    if (leftOffset < 0) {
      leftOffset = 0
    } else if (leftOffset + dropdownRect.width > containerRect.width) {
      leftOffset = containerRect.width - dropdownRect.width
    }

    dropdown.style.left = `${leftOffset}px`
  }

  getNavigationItems () {
    const controls = Object.values(this.props.controls)
    return controls.map((control, i) => {
      const { type, title, subControls } = control
      const isActive = type === this.props.activeSection
      const itemClasses = classNames({
        'vcv-ui-navigation-slider-item': true,
        'vcv-ui-navigation-slider-item--active': isActive
      })
      let index = control.index
      if (control.subIndex !== undefined) {
        index = `${control.index}-${control.subIndex}`
      }

      const navItemProps = {
        className: itemClasses
      }

      let subControlsContent = null
      if (subControls && subControls.length) {
        subControlsContent = (
          <div className='vcv-ui-navigation-slider-dropdown'>
            {this.getDropdownItems(subControls, type, index, isActive)}
          </div>
        )
        navItemProps.onMouseEnter = this.handleItemMouseEnter
      }

      return (
        <div {...navItemProps} key={`navigation-slider-${type}-${i}`}>
          <button type='button' onClick={this.handleClick.bind(this, { type: type, index: index })} className='vcv-ui-navigation-slider-button'>
            {title}
          </button>
          {subControlsContent}
        </div>
      )
    })
  }

  getDropdownItems (subControls, type, categoryIndex, isActive) {
    return subControls.map((activeSubControl) => {
      const subControlType = activeSubControl.type
      const subControlTitle = activeSubControl.title
      const dropdownItemClasses = classNames({
        'vcv-ui-navigation-slider-dropdown-item': true,
        'vcv-ui-navigation-slider-dropdown-item--active': isActive && subControlType === this.props.activeSubControl
      })

      return (
        <button
          key={`navigation-slider-dropdown-item-${subControlType}`}
          type='button'
          onClick={this.handleClick.bind(this, { type: type, index: categoryIndex, activeSubControl: subControlType })}
          className={dropdownItemClasses}
        >
          {subControlTitle}
        </button>
      )
    })
  }

  handleSlideMove (direction) {
    const slider = this.navigationSliderRef.current
    const sliderWidth = slider.getBoundingClientRect().width

    smoothScroll(slider, slider.scrollLeft + (direction === 'left' ? -sliderWidth : sliderWidth))
  }

  getControls () {
    const { showControls, scrolledToLeft, scrolledToRight } = this.state
    if (showControls) {
      const leftButtonProps = {}
      const rightButtonProps = {}

      if (scrolledToLeft) {
        leftButtonProps.disabled = true
      }

      if (scrolledToRight) {
        rightButtonProps.disabled = true
      }

      return (
        <div className='vcv-ui-navigation-slider-controls' ref={this.navigationControlsRef}>
          <button
            className='vcv-ui-navigation-slider-control-button'
            onClick={this.handleSlideMove.bind(this, 'left')}
            {...leftButtonProps}
          >
            <i className='vcv-ui-icon vcv-ui-icon-expand' />
          </button>
          <button
            className='vcv-ui-navigation-slider-control-button'
            onClick={this.handleSlideMove.bind(this, 'right')}
            {...rightButtonProps}
          >
            <i className='vcv-ui-icon vcv-ui-icon-expand' />
          </button>
        </div>
      )
    }
    return null
  }

  render () {
    const { scrolledToLeft, scrolledToRight } = this.state

    const sliderClasses = classNames({
      'vcv-ui-navigation-slider-container': true,
      'vcv-ui-navigation-slider-container--shadow-left': !scrolledToLeft,
      'vcv-ui-navigation-slider-container--shadow-right': !scrolledToRight
    })

    return (
      <div className={sliderClasses} ref={this.navigationContainerRef}>
        <div className='vcv-ui-navigation-slider' ref={this.navigationSliderRef}>
          {this.getNavigationItems()}
        </div>
        {this.getControls()}
      </div>
    )
  }
}
