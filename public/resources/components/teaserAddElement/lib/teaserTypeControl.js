import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

const controls = [
  {
    type: 'all',
    name: 'All'
  },
  {
    type: 'element',
    name: 'Elements'
  },
  {
    type: 'template',
    name: 'Templates'
  },
  {
    type: 'header',
    name: 'Header'
  },
  {
    type: 'footer',
    name: 'Footer'
  },
  {
    type: 'sidebar',
    name: 'Sidebar'
  }
]

export default class TeaserTypeControl extends React.Component {
  buttonsGroup = null
  static propTypes = {
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

  handleClick (type, index) {
    this.props.setFilterType(type, index)
  }

  getControls () {
    return controls.map((control, i) => {
      const { type, name } = control
      let controlClasses = classNames({
        'vcv-ui-form-button': true,
        'vcv-ui-form-button--active': type === this.props.filterType
      })
      return <button
        key={`hub-control-${type}`}
        className={controlClasses}
        type='button'
        onClick={() => this.handleClick(type, i)}
      >
        {name}
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
