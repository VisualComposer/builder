import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import vcCake from 'vc-cake'

export default class TeaserTypeControl extends React.Component {
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
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('iframe')
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
    let wrapperWidth = ReactDOM.findDOMNode(this).getBoundingClientRect().width
    const { isControlsHidden, totalControlWidth } = this.state
    let controlsWidth = totalControlWidth || this.getControlsTotalWidth()
    if (wrapperWidth >= controlsWidth && isControlsHidden) {
      this.setState({ isControlsHidden: false })
    } else if (wrapperWidth < controlsWidth && !isControlsHidden) {
      this.setState({ isControlsHidden: true })
    }
  }

  handleClick (type, index, licenceType) {
    this.props.setFilterType(type, index, licenceType)
  }

  getControls () {
    let controls = Object.values(this.props.categories)
    return controls.map((control, i) => {
      const { type, name, licenceTypes } = control
      const isActive = type === this.props.filterType
      let controlClasses = classNames({
        'vcv-ui-form-button': true,
        'vcv-ui-form-button--active': isActive
      })
      let index = control.index
      if (control.subIndex !== undefined) {
        index = `${control.index}-${control.subIndex}`
      }

      if (vcCake.env('FT_HUB_CATEGORIES_DROPDOWN')) {
        return <div key={`hub-control-${type}`} className='vcv-ui-form-button-group-item'>
          <button type='button' onClick={() => this.handleClick(type, index)} className={controlClasses}>
            {name}
          </button>
          {licenceTypes && licenceTypes.length
            ? <div className='vcv-ui-form-button-group-dropdown'>
              {this.getDropdownItems(licenceTypes, type, index, isActive)}
            </div> : null}
        </div>
      } else {
        return <button
          key={`hub-control-${type}`}
          className={controlClasses}
          type='button'
          onClick={() => this.handleClick(type, index)}
        >
          {name}
        </button>
      }
    })
  }

  getDropdownItems (licenceTypes, type, categoryIndex, isActive) {
    return licenceTypes.map((licence) => {
      let dropdownItemClasses = classNames({
        'vcv-ui-form-button-group-dropdown-item': true,
        'vcv-ui-form-button-group-dropdown-item--active': isActive && licence === this.props.licenceType
      })

      return <button
        key={`hub-control-dropdown-item-${licence}`}
        type='button'
        onClick={() => this.handleClick(type, categoryIndex, licence)}
        className={dropdownItemClasses}
      >
        {licence}
      </button>
    })
  }

  render () {
    let controlContainerClasses = classNames({
      'vcv-ui-hub-control-container': true,
      'vcv-is-hidden': this.state.isControlsHidden
    })
    return <div className={controlContainerClasses}>
      <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large' ref={buttonsGroup => { this.buttonsGroup = buttonsGroup }}>
        {this.getControls()}
      </div>
    </div>
  }
}
