import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

export default class HubMenu extends React.Component {
  buttonsGroup = null
  static propTypes = {
    categories: PropTypes.object.isRequired,
    filterType: PropTypes.string.isRequired,
    setFilterType: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      totalControlWidth: 0,
      isControlsHidden: true
    }
    this.handleResize = this.handleResize.bind(this)
    this.getDropdownItems = this.getDropdownItems.bind(this)
  }

  componentDidMount () {
    this.setState({ totalControlWidth: this.getControlsTotalWidth() })
    this.handleResize()
    this.addResizeListener(ReactDOM.findDOMNode(this), this.handleResize)
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this), this.handleResize)
  }

  addResizeListener (element, fn) {
    const isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    const obj = element.__resizeTrigger__ = document.createElement('iframe')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function () {
      this.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }

  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }

  getControlsTotalWidth () {
    return this.buttonsGroup.getBoundingClientRect().width
  }

  handleResize () {
    const wrapperWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width
    const { isControlsHidden, totalControlWidth } = this.state
    const controlsWidth = totalControlWidth || this.getControlsTotalWidth()
    if (wrapperWidth >= controlsWidth && isControlsHidden) {
      this.setState({ isControlsHidden: false })
    } else if (wrapperWidth < controlsWidth && !isControlsHidden) {
      this.setState({ isControlsHidden: true })
    }
  }

  handleClick (type, index, bundleType) {
    this.props.setFilterType(type, index, bundleType)
  }

  getControls () {
    const controls = Object.values(this.props.categories)
    return controls.map((control, i) => {
      const { type, title, bundleTypes } = control
      const isActive = type === this.props.filterType
      const controlClasses = classNames({
        'vcv-ui-form-button': true,
        'vcv-ui-form-button--active': isActive
      })
      let index = control.index
      if (control.subIndex !== undefined) {
        index = `${control.index}-${control.subIndex}`
      }

      let dropdownItems = null
      if (bundleTypes && bundleTypes.length) {
        dropdownItems = (
          <div className='vcv-ui-form-button-group-dropdown'>
            {this.getDropdownItems(bundleTypes, type, index, isActive)}
          </div>
        )
      }

      return (
        <div key={`hub-control-${type}-${i}`} className='vcv-ui-form-button-group-item'>
          <button type='button' onClick={() => this.handleClick(type, index)} className={controlClasses}>
            {title}
          </button>
          {dropdownItems}
        </div>
      )
    })
  }

  getDropdownItems (bundleTypes, type, categoryIndex, isActive) {
    const localizations = dataManager.get('localizations')
    return bundleTypes.map((bundleType) => {
      const dropdownItemClasses = classNames({
        'vcv-ui-form-button-group-dropdown-item': true,
        'vcv-ui-form-button-group-dropdown-item--active': isActive && bundleType === this.props.bundleType
      })
      let buttonText = localizations[bundleType]

      if (!buttonText && bundleType === 'free') {
        buttonText = 'Free'
      }

      if (!buttonText && bundleType === 'premium') {
        buttonText = 'Premium'
      }

      return (
        <button
          key={`hub-control-dropdown-item-${bundleType}`}
          type='button'
          onClick={() => this.handleClick(type, categoryIndex, bundleType)}
          className={dropdownItemClasses}
        >
          {buttonText}
        </button>
      )
    })
  }

  render () {
    const controlContainerClasses = classNames({
      'vcv-ui-hub-control-container': true,
      'vcv-is-hidden': this.state.isControlsHidden
    })
    return (
      <div className={controlContainerClasses}>
        <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large' ref={buttonsGroup => { this.buttonsGroup = buttonsGroup }}>
          {this.getControls()}
        </div>
      </div>
    )
  }
}
