import vcCake from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import Helper from '../../../dnd/helper'
import DOMElement from '../../../dnd/domElement'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import { getResponse } from 'public/tools/response'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const dataManager = vcCake.getService('dataManager')
const workspaceStorage = vcCake.getStorage('workspace')
const hubElementsService = vcCake.getService('hubElements')
const settingsStorage = vcCake.getStorage('settings')
const dataProcessor = vcCake.getService('dataProcessor')
const documentService = vcCake.getService('document')
const hubElementsStorage = vcCake.getStorage('hubElements')
const roleManager = vcCake.getService('roleManager')

export default class ElementControl extends React.Component {
  static propTypes = {
    tag: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    element: PropTypes.object.isRequired,
    thirdParty: PropTypes.bool,
    addElement: PropTypes.func,
    setFocusedElement: PropTypes.func,
    applyFirstElement: PropTypes.func,
    isRemoveStateActive: PropTypes.bool
  }

  helper = null
  layoutBarOverlay = document.querySelector('.vcv-layout-bar-overlay')
  layoutBarOverlayRect = null
  dragTimeout = 0
  addedId = null
  iframeWindow = null

  constructor (props) {
    super(props)
    this.itemRef = React.createRef()
    this.state = {
      previewVisible: false,
      previewStyle: {},
      isDragging: false,
      iframe: document.getElementById('vcv-editor-iframe'),
      backendContentContainer: document.querySelector('.vcv-wpbackend-layout-content-container'),
      mouseX: null,
      mouseY: null,
      showSpinner: false
    }
    this.handleMouseEnterShowPreview = this.handleMouseEnterShowPreview.bind(this)
    this.handleMouseLeaveHidePreview = this.handleMouseLeaveHidePreview.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.initDrag = this.initDrag.bind(this)
    this.handleDragStateChange = this.handleDragStateChange.bind(this)
    this.handleFocus = this.handleFocus.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleRemovePreset = this.handleRemovePreset.bind(this)
    this.handleRemoveElement = this.handleRemoveElement.bind(this)
    this.displayError = this.displayError.bind(this)
    this.displaySuccess = this.displaySuccess.bind(this)
    this.handleUpdatePreviewPosition = this.handleUpdatePreviewPosition.bind(this)
  }

  componentDidMount () {
    workspaceStorage.state('drag').onChange(this.handleDragStateChange)
  }

  componentWillUnmount () {
    this.endDrag()
    workspaceStorage.state('drag').ignoreChange(this.handleDragStateChange)
  }

  handleDragStateChange (data) {
    if (data && Object.prototype.hasOwnProperty.call(data, 'active') && !data.active && this.state.isDragging) {
      this.endDragGlobal()
    } else if (data && Object.prototype.hasOwnProperty.call(data, 'terminate') && data.terminate && this.state.isDragging) {
      this.endDrag()
    }
  }

  handleMouseEnterShowPreview () {
    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      return
    }
    const dragState = workspaceStorage.state('drag').get()
    const activeDragging = dragState && dragState.active
    if (!activeDragging) {
      this.setState({
        previewVisible: true
      }, this.handleUpdatePreviewPosition)
    }
  }

  handleMouseLeaveHidePreview () {
    this.setState({
      previewVisible: false
    })
  }

  getClosest (el, selector) {
    let matchesFn;
    // find vendor prefix
    ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector'].some(function (fn) {
      if (typeof document.body[fn] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    let parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[matchesFn](selector)) {
        return parent
      }
      el = parent
    }
    return null
  }

  handleUpdatePreviewPosition (currentRef) {
    const element = currentRef || this.itemRef.current

    let container
    if (element.closest === undefined) {
      container = this.getClosest(element, '.vcv-ui-item-list')
    } else {
      container = element.closest('.vcv-ui-item-list')
    }
    const firstElement = container.querySelector('.vcv-ui-item-list-item')
    const trigger = element.querySelector('.vcv-ui-item-element-content')
    const preview = element.querySelector('.vcv-ui-item-preview-container')
    if (!preview) {
      return false
    }

    const triggerSizes = trigger.getBoundingClientRect()
    const firsElementSize = firstElement.getBoundingClientRect()
    const previewSizes = preview.getBoundingClientRect()
    const windowSize = {
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

  /**
   * End drag event on body
   */
  endDrag () {
    const { iframe } = this.state
    this.setState({ isDragging: false, mouseX: null, mouseY: null })
    document.body.removeEventListener('mousemove', this.initDrag)
    if (this.helper) {
      this.helper.remove()
      this.helper = null
    }
    if (iframe) {
      iframe.removeAttribute('style')
    }
    window.clearTimeout(this.dragTimeout)
    this.dragTimeout = 0
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
          id: 'dropNewElement',
          point: false,
          tag: tag,
          domNode: newElement,
          element: element
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
   * Two conditions to check if mouse has been moved - fix for Chrome on Windows
   * @param e
   */
  initDrag (e) {
    if (!this.state.mouseX && !this.state.mouseY) {
      this.setState({ mouseX: e.pageX, mouseY: e.pageY })
      return
    }
    if (e.pageX !== this.state.mouseX && e.pageY !== this.state.mouseY) {
      const { element } = this.props
      const { iframe, isDragging, backendContentContainer } = this.state
      const newElement = document.createElement('div')
      newElement.setAttribute('data-vcv-element', element.id)
      const dragState = workspaceStorage.state('drag')
      this.handleMouseLeaveHidePreview()
      if (!dragState.get() || !dragState.get().active) {
        dragState.set({ active: true, addPanel: true })
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
      iconLink: hubElementsService.getElementIcon(tag)
    })
    this.helper = new Helper(draggingElement, {
      container: container
    })
    this.helper.show()
  }

  handleMouseDown (e) {
    e && e.preventDefault()
    if (!this.state.isDragging) {
      this.dragTimeout = setTimeout(() => {
        this.layoutBarOverlayRect = this.layoutBarOverlay.getBoundingClientRect()
        document.body.addEventListener('mousemove', this.initDrag)
      }, 1)
    }
  }

  handleMouseUp (e) {
    e && e.preventDefault()
    if (e.target.dataset && e.target.dataset.action && e.target.dataset.action === 'deleteElementPreset') {
      this.endDragGlobal()
      return
    }
    if (e.target.dataset && e.target.dataset.action && e.target.dataset.action === 'deleteElement') {
      this.endDragGlobal()
      return
    }
    const dragState = workspaceStorage.state('drag').get()
    const activeDragging = dragState && dragState.active
    if (!activeDragging) {
      this.props.addElement(this.props.element, this.props.elementPresetId)
      this.endDrag()
    } else {
      this.endDragGlobal()
    }
  }

  handleFocus (e) {
    e && e.preventDefault()
    this.props.setFocusedElement(this.props.element)
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.props.applyFirstElement()
    }
  }

  handleRemovePreset () {
    const localizations = dataManager.get('localizations')
    const removePresetWarning = localizations ? localizations.removeElementPresetWarning : 'Do you want to remove this element preset?'

    if (window.confirm(removePresetWarning)) {
      const couldNotParseData = localizations ? localizations.couldNotParseData : 'Could not parse data from the server.'
      const noAccessCheckLicence = localizations ? localizations.noAccessCheckLicence : 'No access, check your license.'
      const presetRemovedText = localizations ? localizations.presetRemovedText : 'Element preset has been removed.'
      const presetId = this.props.elementPresetId

      this.setState({ showSpinner: true })
      dataProcessor.appAdminServerRequest({
        'vcv-action': 'addon:presets:delete:adminNonce',
        'vcv-preset-id': presetId,
        'vcv-nonce': dataManager.get('nonce')
      }).then((data) => {
        const jsonData = getResponse(data)
        if (!jsonData) {
          this.displayError(couldNotParseData)
          return
        }
        if (jsonData && jsonData.status) {
          hubElementsStorage.trigger('removePreset', presetId)
          this.displaySuccess(presetRemovedText)
        } else {
          let errorMessage
          if (jsonData && jsonData.response && jsonData.response.message) {
            errorMessage = jsonData.response.message
          } else {
            errorMessage = jsonData && jsonData.message ? jsonData.message : noAccessCheckLicence
          }
          this.displayError(errorMessage)

          if (vcCake.env('VCV_DEBUG')) {
            console.warn(errorMessage, jsonData)
          }
        }
      })
    }
  }

  handleRemoveElement () {
    const localizations = dataManager.get('localizations')
    const removeElementWarning = localizations ? localizations.removeElementWarning : 'Do you want to remove this element?'
    if (window.confirm(removeElementWarning)) {
      const tag = this.props.element.tag
      const removeElementInUseCurrentPageWarning = localizations ? localizations.removeElementInUseCurrentPageWarning : 'Could not parse data from the server.'

      const elementUsages = Object.keys(documentService.getByTag(tag))
      if (elementUsages.length > 0) {
        this.displayError(removeElementInUseCurrentPageWarning)
        return
      }

      const couldNotParseData = localizations ? localizations.couldNotParseData : 'Could not parse data from the server.'
      const noAccessCheckLicence = localizations ? localizations.noAccessCheckLicence : 'No access, check your license.'
      const elementRemovedText = localizations ? localizations.elementRemovedText : 'Element has been removed.'

      this.setState({ showSpinner: true })
      dataProcessor.appAdminServerRequest({
        'vcv-action': 'editors:elements:delete:adminNonce',
        'vcv-element-tag': tag
      }).then((data) => {
        const jsonData = getResponse(data)
        if (!jsonData) {
          this.displayError(couldNotParseData)
          return
        }
        if (jsonData && jsonData.status) {
          hubElementsStorage.trigger('removeElement', tag)
          this.displaySuccess(elementRemovedText)
        } else {
          let errorMessage
          if (jsonData && jsonData.response && jsonData.response.message) {
            errorMessage = jsonData.response.message
          } else {
            errorMessage = jsonData && jsonData.message ? jsonData.message : noAccessCheckLicence
          }
          this.displayError(errorMessage)

          if (vcCake.env('VCV_DEBUG')) {
            console.warn(errorMessage, jsonData)
          }
        }
      })
    }
  }

  displaySuccess (successText) {
    store.dispatch(notificationAdded({
      text: successText,
      time: 5000
    }))
  }

  displayError (errorText) {
    this.setState({ showSpinner: false })
    store.dispatch(notificationAdded({
      type: 'error',
      text: errorText,
      time: 5000
    }))
  }

  isElementRemovable (element) {
    // Allowed only for 'manager_options' capability users
    // - Not allowed to remove default included elements
    // - Not allowed to remove third party elements
    // - Not allowed to remove addon-dependent elements
    // TODO: Make this variable dynamic in case if addon elements will be more and more
    const addonElements = [
      'globalTemplate',
      'layoutFooterArea',
      'layoutHeaderArea',
      'layoutSidebarArea',
      'layoutWpCommentsArea',
      'layoutContentArea'
    ]
    const vcvIsUserAdmin = roleManager.can('hub_elements_templates_blocks', roleManager.defaultAdmin())

    return vcvIsUserAdmin && !element.metaIsDefaultElement && !element.thirdParty && addonElements.indexOf(element.tag) === -1
  }

  render () {
    const { name, element, elementPresetId, thirdParty } = this.props
    const { previewVisible, previewStyle } = this.state
    const dragState = workspaceStorage.state('drag').get()
    const localizations = dataManager.get('localizations')

    const listItemClasses = classNames({
      'vcv-ui-item-list-item': true,
      'vcv-ui-item-list-item--inactive': dragState && dragState.active,
      'vcv-ui-item-list-item--preset': !!elementPresetId
    })
    const nameClasses = classNames({
      'vcv-ui-item-badge vcv-ui-badge--success': false,
      'vcv-ui-item-badge vcv-ui-badge--warning': false
    })

    const publicPathThumbnail = element.metaThumbnailUrl
    const publicPathPreview = element.metaPreviewUrl

    const disablePreview = settingsStorage.state('itemPreviewDisabled').get()
    let previewBox = ''
    if (!disablePreview && previewVisible && !this.state.showSpinner) {
      const addOnTitle = localizations ? localizations.addOn : 'Addon'
      previewBox = (
        <figure className='vcv-ui-item-preview-container' style={previewStyle}>
          {thirdParty ? <span className='vcv-ui-item-preview-addon-tag'>{addOnTitle}</span> : null}
          <img className='vcv-ui-item-preview-image' src={publicPathPreview} alt={name} onLoad={() => {
            this.handleUpdatePreviewPosition()
          }} />
          <figcaption className='vcv-ui-item-preview-caption'>
            <div className='vcv-ui-item-preview-text'>
              {element.metaDescription}
            </div>
          </figcaption>
        </figure>
      )
    }

    const removeClasses = classNames({
      'vcv-ui-icon vcv-ui-icon-close-thin vcv-ui-form-attach-image-item-control-state--danger': true,
      'vcv-ui-state--hidden': this.state.showSpinner
    })
    const overlayProps = {}
    const isAbleToRemove = roleManager.can('editor_content_presets_management', roleManager.defaultTrue())
    let removeControl = null
    if (elementPresetId) {
      if (isAbleToRemove) {
        removeControl = (
          <span
            className={removeClasses}
            title={localizations.removePlaceholder.replace('%', name)}
            onClick={this.handleRemovePreset}
            data-action='deleteElementPreset'
          />
        )
      }
    } else if (this.isElementRemovable(element)) {
      removeControl = (
        <span
          className={removeClasses}
          onClick={this.handleRemoveElement}
          title={localizations.removePlaceholder.replace('%', name)}
          data-action='deleteElement'
        />
      )
    }

    const spinnerClasses = classNames({
      'vcv-ui-item-control vcv-ui-icon vcv-ui-wp-spinner-light': true,
      'vcv-ui-state--hidden': !this.state.showSpinner
    })

    const applyClasses = classNames({
      'vcv-ui-item-add vcv-ui-icon vcv-ui-icon-add': true,
      'vcv-ui-state--hidden': this.state.showSpinner
    })

    const overlayClasses = classNames({
      'vcv-ui-item-overlay': true,
      'vcv-ui-item-overlay--visible': this.state.showSpinner,
      'vcv-ui-item-control--visible': this.props.isRemoveStateActive
    })

    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    const itemProps = {}
    if (!this.props.isRemoveStateActive && isAbleToAdd) {
      itemProps.onMouseDown = this.handleMouseDown
      itemProps.onMouseUp = this.handleMouseUp
      itemProps.onKeyPress = this.handleKeyPress
    }

    let itemButton = null
    let titleText = null
    if (!this.state.showSpinner) {
      if (this.props.isRemoveStateActive) {
        itemButton = removeControl
        if (!removeControl) {
          titleText = localizations ? localizations.thisElementCantBeDeleted : 'This element can’t be deleted'
          itemProps.style = {
            cursor: 'not-allowed'
          }
          overlayProps.style = {
            cursor: 'not-allowed'
          }
        }
      } else if (isAbleToAdd) {
        itemButton = <span title={localizations.addPlaceholder.replace('%', name)} className={applyClasses} />
      } else if (!isAbleToAdd) {
        overlayProps.style = {
          cursor: 'not-allowed'
        }
      }
    }

    return (
      <div className={listItemClasses} ref={this.itemRef}>
        <span
          className='vcv-ui-item-element'
          onMouseEnter={!disablePreview ? this.handleMouseEnterShowPreview : null}
          onMouseLeave={!disablePreview ? this.handleMouseLeaveHidePreview : null}
          onFocus={this.handleFocus}
          tabIndex={0}
          title={titleText}
          {...itemProps}
        >
          <span className='vcv-ui-item-element-content'>
            <img
              className='vcv-ui-item-element-image' src={publicPathThumbnail}
              alt={name}
            />
            <span className={overlayClasses} {...overlayProps}>
              {itemButton}
              {removeControl ? <span className={spinnerClasses} /> : null}
            </span>
          </span>
          <span className='vcv-ui-item-element-name'>
            <span className={nameClasses}>
              {name}
            </span>
          </span>
          {previewBox}
        </span>
      </div>
    )
  }
}
