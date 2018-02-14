import React from 'react'
import ElementControl from './lib/elementControl'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

const cook = vcCake.getService('cook')
const workspaceStorage = vcCake.getStorage('workspace')
const elementsStorage = vcCake.getStorage('elements')

export default class BlankRowPlaceholder extends React.Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    controlsData: PropTypes.array
  }

  static localizations = window.VCV_I18N && window.VCV_I18N()

  static defaultProps = {
    controlsData: [
      {
        tag: 'row',
        options: {
          layout: [ 'auto' ],
          icon: 'oneColumn.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addOneColumn : 'Add one column'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '50%', '50%' ],
          icon: 'twoColumns.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addTwoColumns : 'Add two columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '33.33%', '33.33%', '33.33%' ],
          icon: 'threeColumns.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addThreeColumns : 'Add three columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '25%', '25%', '25%', '25%' ],
          icon: 'fourColumns.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addFourColumns : 'Add four columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '20%', '20%', '20%', '20%', '20%' ],
          icon: 'fiveColumns.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addFiveColumns : 'Add five columns'
        }
      },
      {
        tag: 'row',
        options: {
          layout: [ '66.66%', '33.34%' ],
          icon: 'custom.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addCustomRowLayout : 'Add custom row layout',
          type: 'custom'
        }
      },
      {
        tag: 'textBlock',
        options: {
          icon: 'textBlock.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addTextBlock : 'Add Text block'
        }
      },
      {
        tag: 'addElement',
        options: {
          icon: 'addElement.svg',
          title: BlankRowPlaceholder.localizations ? BlankRowPlaceholder.localizations.addElement : 'Add Element'
        }
      }
    ]
  }

  rowContainer = null
  elementsContainer = null
  initialSetControlsLayoutTimeout = null
  addedId = null
  iframeWindow = null

  constructor (props) {
    super(props)
    this.state = {}
    this.handleClick = this.handleClick.bind(this)
    this.setControlsLayout = this.setControlsLayout.bind(this)
    this.openEditForm = this.openEditForm.bind(this)
  }

  componentDidMount () {
    this.setControlData()
    // set timeout to get new state data from setControlData()
    this.initialSetControlsLayoutTimeout = setTimeout(() => {
      this.setControlsLayout()
    }, 1)
    this.addResizeListener(this.rowContainer, this.setControlsLayout)
  }

  componentWillUnmount () {
    this.removeResizeListener(this.rowContainer, this.setControlsLayout)
    if (this.initialSetControlsLayoutTimeout) {
      window.clearTimeout(this.initialSetControlsLayoutTimeout)
      this.initialSetControlsLayoutTimeout = null
    }
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
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: calc(100% - 30px); width: 100%; overflow: hidden; opacity: 0; pointer-events: none; z-index: -1;')
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
   * Handle click for element control, don't open edit form
   * @param element
   */
  handleElementControl (element) {
    elementsStorage.trigger('add', element)
  }

  /**
   * Handle click for element control
   * @param element
   * @param tab
   */
  handleElementControlWithForm (element, tab = '') {
    elementsStorage.trigger('add', element)
    this.addedId = element.id

    let iframe = document.getElementById('vcv-editor-iframe')
    this.iframeWindow = iframe && iframe.contentWindow && iframe.contentWindow.window
    this.iframeWindow.vcv.on('ready', this.openEditForm)
  }

  /**
   * Open edit form
   * @param action
   * @param id
   */
  openEditForm (action, id) {
    if (action === 'add' && id === this.addedId) {
      workspaceStorage.trigger('edit', this.addedId, '')
      this.iframeWindow.vcv.off('ready', this.openEditForm)
    }
  }

  /**
   * Handle click for add element control, open add element form
   */
  handleAddElementControl () {
    workspaceStorage.trigger('add', '')
  }

  /**
   * Handle click for control depending on clicked control tag
   * @param control
   */
  handleClick (control) {
    if (control.tag === 'addElement') {
      this.handleAddElementControl()
    }
    if (control.tag === 'textBlock') {
      const element = cook.get({tag: control.tag}).toJS()
      this.handleElementControlWithForm(element)
    }
    if (control.tag === 'row') {
      const layoutData = {
        layoutData: control.options.layout
      }
      const element = cook.get({tag: control.tag, layout: layoutData}).toJS()
      if (control.options.type && control.options.type === 'custom') {
        this.handleElementControlWithForm(element, 'layout')
      } else {
        this.handleElementControl(element)
      }
    }
  }

  /**
   * Set state for the single control width, sum width of all controls
   */
  setControlData () {
    const controls = Array.prototype.slice.call(this.elementsContainer.children)
    const controlStyle = window.getComputedStyle(controls[0])
    const controlWidth = parseInt(controlStyle.width)
    const controlMargin = parseInt(controlStyle.marginLeft) + parseInt(controlStyle.marginRight)
    const controlFullWidth = controlWidth + controlMargin
    this.setState({
      controlWidth: controlFullWidth,
      controlsWidth: controlFullWidth * this.props.controlsData.length
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

  /**
   * Get control props
   * @param control
   * @param index
   * @return {}
   */
  getControlProps (control, index) {
    return {
      key: 'vcvBlankRow' + control.tag + index,
      control: control,
      handleClick: this.handleClick
    }
  }

  /**
   * Get controls elements from controlsData
   * @return []
   */
  getElementControls () {
    return this.props.controlsData.map((control, i) => {
      return <ElementControl {...this.getControlProps(control, i)} />
    })
  }

  render () {
    const elementControls = this.getElementControls()
    let containerWidth = {}
    if (this.state.containerWidth) {
      containerWidth.width = `${this.state.containerWidth}px`
    }

    return (
      <div
        className='vcvhelper vcv-ui-blank-row-container vcv-is-disabled-outline'
        ref={(container) => { this.rowContainer = container }}
      >
        <div className='vcv-ui-blank-row'>
          <div
            className='vcv-ui-blank-row-controls-container'
            style={containerWidth}
            ref={(container) => { this.elementsContainer = container }}
          >
            {elementControls}
          </div>
        </div>
      </div>
    )
  }
}
