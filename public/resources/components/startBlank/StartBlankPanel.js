import React from 'react'
import ReactDOM from 'react-dom'
import vcCake from 'vc-cake'
import BlankControl from './lib/blankControl'
const templateManager = vcCake.getService('myTemplates')
const elementsStorage = vcCake.getStorage('elements')
const workspaceStorage = vcCake.getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')

export default class startBlank extends React.Component {
  static propTypes = {
    unmountStartBlank: React.PropTypes.func.isRequired
  }

  rowContainer = null
  elementsContainer = null
  initialSetControlsLayoutTimeout = null

  constructor (props) {
    super(props)
    this.state = {
      startBlankVisible: true,
      templates: templateManager.predefined()
    }
    this.handleCloseClick = this.handleCloseClick.bind(this)
    this.setControlsLayout = this.setControlsLayout.bind(this)
    this.handleControlClick = this.handleControlClick.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
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

  handleMouseUp () {
    const dragState = workspaceStorage.state('drag')
    if (dragState.get() && dragState.get().active) {
      dragState.set({ active: false })
    }
  }

  handleControlClick (props) {
    const { blank, data } = props
    if (!blank) {
      elementsStorage.trigger('merge', data)
    }
    this.handleCloseClick(blank)
  }

  handleCloseClick (blank) {
    if (blank) {
      const settings = {
        action: 'add',
        element: {},
        tag: '',
        options: {}
      }
      workspaceSettings.set(settings)
    }
    this.props.unmountStartBlank()
  }

  getTemplateControlProps (template) {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const blankText = localizations ? localizations.blankPage : 'Blank Page'

    if (template !== 'blank') {
      return {
        key: 'vcv-element-control-' + template.id,
        addClick: this.handleControlClick,
        ...template
      }
    } else {
      return {
        key: 'vcv-element-control-blank',
        addClick: this.handleControlClick,
        name: blankText,
        blank: true
      }
    }
  }

  getBlankControls () {
    let controls = []
    controls.push(<BlankControl {...this.getTemplateControlProps('blank')} />)
    this.state.templates.forEach((template) => {
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
      controlsWidth: controlFullWidth * this.state.templates.length + 1
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
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const buttonText = localizations ? localizations.premiumTemplatesButton : 'Go Premium'
    const headingPart1 = localizations ? localizations.blankPageHeadingPart1 : 'Select Blank Page'
    const headingPart2 = localizations ? localizations.blankPageHeadingPart2 : 'or Start With a template'
    const helperText = localizations ? localizations.blankPageHelperText : 'Get a Premium license to access Visual Composer Hub. Download professionally designed templates, more content elements, extensions, and more.'

    let containerWidth = {}
    if (this.state && this.state.containerWidth) {
      containerWidth.width = `${this.state.containerWidth}px`
    }

    let buttonUrl = window.VCV_UTM().feBlankPagePremiumTemplates
    if (vcCake.env('editor') === 'backend') {
      buttonUrl = window.VCV_UTM().beBlankPagePremiumTemplates
    }
    let premium = null
    if (typeof window.vcvIsPremium !== 'undefined' && !window.vcvIsPremium) {
      premium = (
        <div>
          <a href={buttonUrl} target='_blank' className='vcv-start-blank-button' disabled>{buttonText}</a>
          <p className='vcv-start-blank-helper'>{helperText}</p>
        </div>
      )
    }
    return (
      <div className='vcv-start-blank-container' onMouseUp={this.handleMouseUp}>
        <div className='vcv-start-blank-scroll-container'>
          <div className='vcv-start-blank-inner'>
            <div className='vcv-start-blank-heading-container'>
              <div className='vcv-start-blank-page-heading'>{headingPart1}</div>
              <div className='vcv-start-blank-page-heading'>{headingPart2}</div>
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
            {premium}
          </div>
        </div>
      </div>
    )
  }
}
