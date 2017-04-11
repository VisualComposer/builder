import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import BlankControl from './lib/blankControl'
const templateManager = vcCake.getService('myTemplates')
export default class startBlank extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    unmountStartBlank: React.PropTypes.func.isRequired
  }
  static defaultProps = {
    startBlankTemplates: templateManager.getLiteVersionTemplates()
  }
  rowContainer = null
  elementsContainer = null
  initialSetControlsLayoutTimeout = null
  constructor (props) {
    super(props)
    this.state = {
      startBlankVisible: true
    }
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.setControlsLayout = this.setControlsLayout.bind(this)
    this.handleControlClick = this.handleControlClick.bind(this)
  }
  componentDidMount () {
    this.setControlData()
    // set timeout to get new state data from setControlData()
    this.initialSetControlsLayoutTimeout = setTimeout(() => {
      this.setControlsLayout()
    }, 1)
    this.addResizeListener(this.rowContainer, this.setControlsLayout)
    ReactDOM.findDOMNode(this).classList.add('vcv-ui-state--visible')
  }
  componentWillUnmount () {
    this.removeResizeListener(this.rowContainer, this.setControlsLayout)
    if (this.initialSetControlsLayoutTimeout) {
      window.clearTimeout(this.initialSetControlsLayoutTimeout)
      this.initialSetControlsLayoutTimeout = null
    }
  }
  handleControlClick (props) {
    const { blank, data } = props
    if (!blank) {
      this.props.api.request('data:merge', data)
    }
    this.handleCloseClick()
  }
  handleCloseClick () {
    this.props.unmountStartBlank()
  }
  getTemplateControlProps (template) {
    if (template !== 'blank') {
      return {
        api: this.props.api,
        key: 'vcv-element-control-' + template.id,
        addClick: this.handleControlClick,
        ...template
      }
    } else {
      return {
        api: this.props.api,
        key: 'vcv-element-control-blank',
        addClick: this.handleControlClick,
        name: 'Blank Page',
        blank: true
      }
    }
  }
  getBlankControls () {
    let controls = []
    controls.push(<BlankControl {...this.getTemplateControlProps('blank')} />)
    startBlank.defaultProps.startBlankTemplates.forEach((template) => {
      controls.push(<BlankControl {...this.getTemplateControlProps(template)} />)
    })
    return controls
  }
  /**
   * Add element resize listener
   * @param element
   * @param fn
   */
  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    let obj = element.__resizeTrigger__ = document.createElement('iframe')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
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
  /**
   * Remove element resize listener
   * @param element
   * @param fn
   */
  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
  }
  /**
   * Set state for the single control width, sum width of all controls
   */
  setControlData () {
    const controls = Array.prototype.slice.call(this.elementsContainer.children)
    const controlStyle = window.getComputedStyle(controls[ 0 ])
    const controlWidth = parseInt(controlStyle.width)
    const controlMargin = parseInt(controlStyle.marginLeft) + parseInt(controlStyle.marginRight)
    const controlFullWidth = controlWidth + controlMargin
    this.setState({
      controlWidth: controlFullWidth,
      controlsWidth: controlFullWidth * startBlank.defaultProps.startBlankTemplates.length + 1
    })
  }
  /**
   * Set state for the width of element controls container
   */
  setControlsLayout () {
    const { controlWidth, controlsWidth } = this.state
    const containerWidth = this.rowContainer.getBoundingClientRect().width
    const elementsCount = Math.floor(containerWidth / controlWidth)
    let elementsWidth = elementsCount * controlWidth
    elementsWidth = elementsWidth < controlsWidth ? elementsWidth : null
    if (this.state.containerWidth !== elementsWidth) {
      this.setState({ containerWidth: elementsWidth })
    }
  }
  render () {
    let containerWidth = {}
    if (this.state && this.state.containerWidth) {
      containerWidth.width = `${this.state.containerWidth}px`
    }
    return (
      <div className='vcv-start-blank-container'>
        <div className='vcv-start-blank-scroll-container'>
          <div className='vcv-start-blank-inner'>
            <a className='vcv-start-blank-close' href='#' title='Close' onClick={this.handleCloseClick}>
              <i className='vcv-start-blank-close-icon vcv-ui-icon vcv-ui-icon-close-thin' />
            </a>
            <div className='vcv-start-blank-heading-container'>
              <span className='vcv-start-blank-page-heading'>Select Blank Canvas<br /> or Start With a Template</span>
            </div>
            <div className='vcv-start-blank-controls'>
              <div
                className='vcv-start-blank-item-list-container'
                ref={(container) => { this.rowContainer = container }}
              >
                <ul
                  className='vcv-ui-item-list vcv-start-blank-item-list'
                  style={containerWidth}
                  ref={(container) => { this.elementsContainer = container }}
                >
                  {this.getBlankControls()}
                </ul>
              </div>
            </div>
            <button className='vcv-start-blank-button' disabled>Premium templates- coming soon</button>
            <p className='vcv-start-blank-helper'>
              Visual Composer Hub will offer you unlimited download of premium quality templates, elements, extensions
              and more.
            </p>
          </div>
        </div>
      </div>
    )
  }
}
