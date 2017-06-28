import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import Helper from '../../../dnd/helper'
import DOMElement from '../../../dnd/domElement'

const elementsStorage = vcCake.getStorage('elements')
const workspaceStorage = vcCake.getStorage('workspace')
const hubCategories = vcCake.getService('hubCategories')
const cook = vcCake.getService('cook')

export default class ElementControl extends React.Component {
  static propTypes = {
    tag: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    element: React.PropTypes.object.isRequired,
    workspace: React.PropTypes.object
  }

  helper = null
  layoutBarOverlay = document.querySelector('.vcv-layout-bar-overlay')
  layoutBarOverlayRect = null

  constructor (props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewStyle: {},
      isDragging: false,
      iframe: document.getElementById('vcv-editor-iframe'),
      backendContentContainer: document.querySelector('.vcv-wpbackend-layout-content-container')
    }
    this.showPreview = this.showPreview.bind(this)
    this.hidePreview = this.hidePreview.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.initDrag = this.initDrag.bind(this)
    this.handleDragStateChange = this.handleDragStateChange.bind(this)
  }

  componentDidMount () {
    this.ellipsize('.vcv-ui-item-element-name')
    this.ellipsize('.vcv-ui-item-preview-text')
    workspaceStorage.state('drag').onChange(this.handleDragStateChange)
  }

  componentWillUnmount () {
    this.endDrag()
    workspaceStorage.state('drag').ignoreChange(this.handleDragStateChange)
  }

  handleDragStateChange (data) {
    if (data && data.hasOwnProperty('active') && !data.active && this.state.isDragging) {
      this.endDragGlobal()
    } else if (data && data.hasOwnProperty('terminate') && data.terminate && this.state.isDragging) {
      this.endDrag()
    }
  }

  addElement (e) {
    e && e.preventDefault()
    const { workspace } = this.props
    const parentElementId = workspace.element ? workspace.element.id : false
    const data = cook.get({ tag: this.props.tag, parent: parentElementId })
    elementsStorage.trigger('add', data.toJS(), true, {
      insertAfter: workspace.options && workspace.options.insertAfter ? workspace.options.insertAfter : false
    })
    workspaceStorage.trigger('edit', data.toJS().id, '')
    // this.props.api.request('app:edit', data.toJS().id, '')
  }

  showPreview () {
    const dragState = workspaceStorage.state('drag').get()
    const activeDragging = dragState && dragState.active
    if (this.updatePreviewPosition() && !activeDragging) {
      this.setState({
        previewVisible: true
      })
    }
  }

  hidePreview () {
    this.setState({
      previewVisible: false
    })
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      el = parent
    }
    return null
  }

  updatePreviewPosition () {
    let element = ReactDOM.findDOMNode(this)

    let container
    if (element.closest === undefined) {
      container = this.getClosest(element, '.vcv-ui-item-list')
    } else {
      container = element.closest('.vcv-ui-item-list')
    }
    let firstElement = container.querySelector('.vcv-ui-item-list-item')
    let trigger = element.querySelector('.vcv-ui-item-element-content')
    let preview = element.querySelector('.vcv-ui-item-preview-container')

    let triggerSizes = trigger.getBoundingClientRect()
    let firsElementSize = firstElement.getBoundingClientRect()
    let previewSizes = preview.getBoundingClientRect()
    let windowSize = {
      height: window.innerHeight,
      width: window.innerWidth
    }

    // default position
    let posX = triggerSizes.left + triggerSizes.width
    let posY = triggerSizes.top
    // position if no place to show on a right side
    if (posX + previewSizes.width > windowSize.width) {
      posX = triggerSizes.left - previewSizes.width
    }
    // position if no place to show on left side (move position down)
    if (posX < 0) {
      posX = triggerSizes.left
      posY = triggerSizes.top + triggerSizes.height
    }
    // position if no place to show on right side
    if (posX + previewSizes.width > windowSize.width) {
      posX = triggerSizes.left + triggerSizes.width - previewSizes.width
    }
    // position if no place from left and right
    if (posX < 0) {
      posX = firsElementSize.left
    }
    // don't show if window size is smaller than preview
    if (posX + previewSizes.width > windowSize.width) {
      return false
    }

    // position if no place to show on bottom
    if (posY + previewSizes.height > windowSize.height) {
      posY = triggerSizes.top + triggerSizes.height - previewSizes.height
      // position if preview is above element
      if (posX === triggerSizes.left || posX === firsElementSize.left) {
        posY = triggerSizes.top - previewSizes.height
      }
    }
    // don't show if window size is smaller than preview
    if (posY < 0) {
      return false
    }

    this.setState({
      previewStyle: {
        left: posX,
        top: posY
      }
    })
    return true
  }

  ellipsize (selector) {
    let element = ReactDOM.findDOMNode(this).querySelector(selector)
    let wordArray = element.innerHTML.split(' ')
    while (element.scrollHeight > element.offsetHeight && wordArray.length > 0) {
      wordArray.pop()
      element.innerHTML = wordArray.join(' ') + '...'
    }
    return this
  }

  /**
   * End drag event on body
   */
  endDrag () {
    const { iframe } = this.state
    this.setState({ isDragging: false })
    document.body.removeEventListener('mousemove', this.initDrag)
    if (this.helper) {
      this.helper.remove()
      this.helper = null
    }
    if (iframe) {
      iframe.style = ''
    }
  }

  /**
   * End drag event on mouseup event,
   * call endDrag method, setData to terminate dnd in iframe
   */
  endDragGlobal () {
    this.endDrag()
    vcCake.setData('dropNewElement', { endDnd: true })
  }

  /**
   * Handle drag when interaction with iframe occurs (frontend editor)
   * @param e
   * @param newElement
   */
  handleDragWithIframe (e, newElement) {
    const { element, tag } = this.props
    const { iframe, isDragging } = this.state
    if (!this.helper) {
      this.createHelper(tag, newElement)
    }
    iframe.style.pointerEvents = 'none'
    if (!e.target.closest('.vcv-layout-header')) {
      iframe.style = ''
      this.helper.hide()
      if (isDragging) {
        vcCake.setData('dropNewElement', {
          id: element.id,
          point: false,
          tag: tag,
          domNode: newElement
        })
      }
    } else {
      this.helper.show()
      if (isDragging && vcCake.getData('dropNewElement') && !vcCake.getData('dropNewElement').endDnd) {
        vcCake.setData('dropNewElement', { endDnd: true })
      }
    }
    this.helper.setPosition({ x: e.clientX, y: e.clientY })
  }

  /**
   * Handle drag when no interaction with iframe exists (backend editor)
   * @param e
   * @param newElement
   */
  handleDragWithoutIframe (e, newElement) {
    const { element, tag } = this.props
    if (!vcCake.getData('vcv:layoutCustomMode')) {
      vcCake.setData('dropNewElement', {
        id: element.id,
        point: { x: e.clientX, y: e.clientY },
        tag: tag,
        domNode: newElement
      })
    }
  }

  /**
   * Start dragging event, set dragging state to true, create element placeholder, update placeholder position,
   * watch for cursor position
   * @param e
   */
  initDrag (e) {
    const { element } = this.props
    const { iframe, isDragging, backendContentContainer } = this.state
    const newElement = document.createElement('div')
    newElement.setAttribute('data-vcv-element', element.id)
    const dragState = workspaceStorage.state('drag')
    this.hidePreview()
    if (!dragState.get() || !dragState.get().active) {
      dragState.set({ active: true })
    }
    if (!isDragging) {
      this.setState({ isDragging: true })
    }
    if (iframe && !backendContentContainer) {
      this.handleDragWithIframe(e, newElement)
    } else {
      this.handleDragWithoutIframe(e, newElement)
    }
  }

  /**
   * Create new helper inside addElement panel
   * @param tag
   * @param newElement
   */
  createHelper (tag, newElement) {
    const container = document.body
    const draggingElement = new DOMElement('dropElement', newElement, {
      containerFor: null,
      relatedTo: null,
      parent: null,
      handler: null,
      tag: tag,
      iconLink: hubCategories.getElementIcon(tag)
    })
    this.helper = new Helper(draggingElement, {
      container: container
    })
    this.helper.show()
  }

  handleMouseDown (e) {
    e && e.preventDefault()
    if (vcCake.env('DRAG_AND_DROP_FROM_ADD_ELEMENT_PANEL')) {
      if (!this.state.isDragging) {
        this.layoutBarOverlayRect = this.layoutBarOverlay.getBoundingClientRect()
        document.body.addEventListener('mousemove', this.initDrag)
      }
    }
  }

  handleMouseUp (e) {
    e && e.preventDefault()
    const dragState = workspaceStorage.state('drag').get()
    const activeDragging = dragState && dragState.active
    if (!activeDragging) {
      this.addElement()
      this.endDrag()
    } else {
      this.endDragGlobal()
    }
  }

  render () {
    let { name, element } = this.props
    let { previewVisible, previewStyle } = this.state
    const dragState = workspaceStorage.state('drag').get()

    let cookElement = cook.get(element)
    let listItemClasses = classNames({
      'vcv-ui-item-list-item': true,
      'vcv-ui-item-list-item--inactive': dragState && dragState.active
    })
    let nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    let previewClasses = classNames({
      'vcv-ui-item-preview-container': true,
      'vcv-ui-state--visible': previewVisible
    })
    // Possible overlays:

    // <span className="vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add"></span>

    // <span className='vcv-ui-item-edit'>
    //   <span className='vcv-ui-item-move vcv-ui-icon vcv-ui-icon-drag-dots'></span>
    //   <span className='vcv-ui-item-remove vcv-ui-icon vcv-ui-icon-close'></span>
    // </span>
    let publicPathThumbnail = cookElement.get('metaThumbnailUrl')
    let publicPathPreview = cookElement.get('metaPreviewUrl')

    return (
      <li className={listItemClasses}>
        <span className='vcv-ui-item-element'
          onMouseEnter={this.showPreview}
          onMouseLeave={this.hidePreview}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          title={name}>
          <span className='vcv-ui-item-element-content'>
            <img className='vcv-ui-item-element-image' src={publicPathThumbnail}
              alt='' />
            <span className='vcv-ui-item-overlay'>
              <span className='vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add' />
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          <figure className={previewClasses} style={previewStyle}>
            <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt='' />
            <figcaption className='vcv-ui-item-preview-caption'>
              <div className='vcv-ui-item-preview-text'>
                {cookElement.get('metaDescription')}
              </div>
            </figcaption>
          </figure>
        </span>
      </li>
    )
  }
}
