import { getService, getStorage, env } from 'vc-cake'
import React from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import { ControlHelpers } from 'public/components/elementControls/controlHelpers'
import { isEqual } from 'lodash'

const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')
const documentManger = getService('document')
const utils = getService('utils')
const cook = getService('cook')
const hubElementsService = getService('hubElements')
const documentManager = getService('document')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default class TreeViewElement extends React.Component {
  static propTypes = {
    showOutlineCallback: PropTypes.func,
    element: PropTypes.object.isRequired,
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    level: PropTypes.number,
    onMountCallback: PropTypes.func,
    onUnmountCallback: PropTypes.func,
    scrollValue: PropTypes.any,
    isAttribute: PropTypes.bool,
    updateElementsData: PropTypes.func
  }

  adminBar = document.getElementById('wpadminbar')
  layoutBar = document.querySelector('.vcv-layout-bar')
  iframe = document.getElementById('vcv-editor-iframe') && document.getElementById('vcv-editor-iframe').contentWindow.document

  constructor (props) {
    super(props)

    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
      this.isMobile = true
    }

    this.state = {
      childExpand: props.level > 1 || this.isMobile,
      hasBeenOpened: false,
      isActive: false,
      hasChild: false,
      showOutline: false,
      element: props.element,
      content: props.element.customHeaderTitle || props.element.name,
      editable: false,
      copyData: window.localStorage && (window.localStorage.getItem('vcv-copy-data') || workspaceStorage.state('copyData').get())
    }

    this.editorType = dataManager.get('editorType')

    this.handleClick = this.handleClick.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleOutline = this.handleOutline.bind(this)
    this.checkPaste = this.checkPaste.bind(this)
    this.dataUpdate = this.dataUpdate.bind(this)
    this.handleClickEnableEditable = this.handleClickEnableEditable.bind(this)
    this.handleBlurValidateContent = this.handleBlurValidateContent.bind(this)
    this.handleKeyDownPreventNewLine = this.handleKeyDownPreventNewLine.bind(this)
    this.handleClickHide = this.handleClickHide.bind(this)
    this.handleClickToggleControls = this.handleClickToggleControls.bind(this)
    this.checkTarget = this.checkTarget.bind(this)
    this.handleSandwichMouseEnter = this.handleSandwichMouseEnter.bind(this)
    this.handleSandwichMouseLeave = this.handleSandwichMouseLeave.bind(this)
    this.handleClickLock = this.handleClickLock.bind(this)
  }

  dataUpdate (data, newProps = false) {
    this.setState({ element: data || this.props.element })
    if (!newProps && this.props.updateElementsData) {
      this.props.updateElementsData(data || this.props.element, 'singleElement')
    }
    if (data && Object.prototype.hasOwnProperty.call(data, 'customHeaderTitle')) {
      const element = cook.get(data || this.props.element)
      const content = data.customHeaderTitle || element.getName()
      if (this.state.content !== content) {
        this.setState({
          content
        }, () => {
          if (this.span) {
            this.span.innerText = content
          }
        })
      }
    }
  }

  componentDidMount () {
    elementsStorage.on(`element:${this.state.element.id}`, this.dataUpdate)
    this.props.onMountCallback(this.state.element.id)
    workspaceStorage.state('copyData').onChange(this.checkPaste)
    window.addEventListener('storage', this.checkPaste)
  }

  componentWillUnmount () {
    elementsStorage.off(`element:${this.state.element.id}`, this.dataUpdate)
    this.props.onUnmountCallback(this.state.element.id)
    workspaceStorage.state('copyData').ignoreChange(this.checkPaste)
    workspaceStorage.state('userInteractWith').set(false)
    window.removeEventListener('storage', this.checkPaste)
  }

  componentDidUpdate (prevProps, prevState) {
    if (!isEqual(prevProps.element, this.props.element)) {
      const newShowOutline = this.props.showOutlineCallback(this.props.element.id)
      newShowOutline !== this.state.showOutline && this.setState({ showOutline: newShowOutline })
      this.setState({ element: this.props.element || prevProps.element })
    }
  }

  checkPaste (data) {
    if ((data && data.element) || data.key === 'vcv-copy-data') {
      const copyData = data.key === 'vcv-copy-data' ? JSON.parse(data.newValue) : data
      this.setState({
        copyData: copyData
      })
    }
  }

  handleOutline (outlineElementId) {
    const showOutline = outlineElementId === this.props.element.id
    if (this.state.showOutline !== showOutline) {
      this.setState({
        showOutline: showOutline
      })
    }
  }

  handleClickChildExpand = () => {
    this.setState({
      childExpand: !this.state.childExpand,
      hasBeenOpened: true
    })
  }

  clickAddChild (tag) {
    workspaceStorage.trigger('add', this.state.element.id, tag)
  }

  handleClickClone = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('clone', this.state.element.id)
  }

  handleClickCopy = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('copy', this.state.element.id)
  }

  clickPaste = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('paste', this.state.element.id)
  }

  clickPasteAfter = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('pasteAfter', this.state.element.id)
  }

  handleClickEdit = (tab = '') => {
    const settings = workspaceStorage.state('settings').get()
    if (settings && settings.action === 'edit') {
      workspaceStorage.state('settings').set(false)
    }
    const options = {}
    if (this.props.isAttribute) {
      const elementAccessPointService = getService('elementAccessPoint')
      const elementAccessPoint = elementAccessPointService.getInstance(this.state.element.parent)
      options.child = true
      options.parentElementAccessPoint = elementAccessPoint
      options.parentElementOptions = {}
    }
    workspaceStorage.trigger('edit', this.state.element.id, tab, options)
  }

  handleClickDelete = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('remove', this.state.element.id)
  }

  handleClickHide () {
    workspaceStorage.trigger('hide', this.state.element.id)
  }

  handleClickLock () {
    const options = {}
    const cookElement = cook.getById(this.state.element.id)
    if (cookElement.containerFor().length > 0) {
      options.lockInnerElements = true
      options.action = !documentManager.get(this.state.element.id).metaIsElementLocked ? 'lock' : 'unlock'
    }
    workspaceStorage.trigger('lock', this.state.element.id, options)
  }

  getContent (children) {
    const { hasBeenOpened, childExpand } = this.state
    if (!childExpand && !hasBeenOpened && !this.isMobile) {
      return null
    }
    const { showOutlineCallback, onMountCallback, onUnmountCallback } = this.props
    const level = this.props.level + 1
    const elementsList = children.map((element) => {
      return (
        <TreeViewElement
          showOutlineCallback={showOutlineCallback}
          onMountCallback={onMountCallback}
          onUnmountCallback={onUnmountCallback}
          element={element}
          key={element.id}
          level={level}
          scrollValue={this.props.scrollValue}
        />
      )
    }, this)
    return elementsList.length ? <ul className='vcv-ui-tree-layout-node'>{elementsList}</ul> : ''
  }

  /**
   * Perform scroll to element inside iframe
   * @param e
   */
  scrollToElementInsideFrame (e) {
    const elId = e.currentTarget.parentNode.dataset.vcvElement
    const editorEl = this.iframe.querySelector(`#el-${elId}`)
    if (!editorEl) {
      return
    }
    const elRect = editorEl.getBoundingClientRect()
    const wh = document.getElementById('vcv-editor-iframe').contentWindow.innerHeight
    const below = elRect.bottom > wh && elRect.top > wh
    const above = elRect.bottom < 0 && elRect.top < 0

    if (above || below) {
      let scrollTimeout = 0
      if (e.target.classList.contains('vcv-ui-tree-layout-control-action--edit') || e.target.classList.contains('vcv-ui-icon-edit')) { // Fixes scroll to element when click on edit action
        scrollTimeout = 500
      }
      window.setTimeout(() => {
        editorEl.scrollIntoView({ behavior: 'smooth' })
      }, scrollTimeout)
    }
  }

  /**
   * Perform scroll to element inside current document
   * @param e
   */
  scrollToElementInsideCurrentDocument (e) {
    const { scrollValue } = this.props
    const elId = e.currentTarget.parentNode.dataset.vcvElement
    const editorEl = document.getElementById(`el-${elId}-temp`)
    if (!editorEl) {
      return
    }
    const elRect = editorEl.getBoundingClientRect()
    const isFixed = window.getComputedStyle(this.layoutBar).position === 'fixed'
    const wh = window.innerHeight
    const below = elRect.bottom > wh && elRect.top > wh
    const above = isFixed ? elRect.bottom < this.layoutBar.getBoundingClientRect().bottom : elRect.bottom < 0 && elRect.top < 0

    if (above || below) {
      const barHeight = typeof scrollValue === 'function' ? scrollValue(this.layoutBar, this.adminBar) : scrollValue
      const curPos = window.pageYOffset
      const yPos = curPos + elRect.top - barHeight
      window.scrollTo(0, yPos)
    }
  }

  /**
   * Execute click handle on treeView element based on scrollValue prop
   * @param e
   */
  handleClick (e) {
    if (!this.props.scrollValue) {
      this.scrollToElementInsideFrame(e)
    } else {
      this.scrollToElementInsideCurrentDocument(e)
    }
  }

  handleMouseEnter (e) {
    if (e.currentTarget.parentNode.dataset && Object.prototype.hasOwnProperty.call(e.currentTarget.parentNode.dataset, 'vcvElement')) {
      workspaceStorage.state('userInteractWith').set(this.state.element.id)
    }
  }

  handleMouseLeave (e) {
    if (e.currentTarget.parentNode.dataset && Object.prototype.hasOwnProperty.call(e.currentTarget.parentNode.dataset, 'vcvElement')) {
      workspaceStorage.state('userInteractWith').set(false)
    }
  }

  handleClickEnableEditable () {
    this.setState({
      editable: true
    }, () => {
      this.span && this.span.focus()
    })
  }

  updateContent (value) {
    const cookElement = cook.get(this.props.element)
    cookElement.set('customHeaderTitle', value)
    const elementData = cookElement.toJS()
    elementsStorage.trigger('update', elementData.id, elementData, 'editForm')
    this.setState({
      content: value || cookElement.getName(),
      editable: false
    }, () => {
      if (!value && this.span) {
        this.span.innerText = cookElement.getName()
      }
    })
  }

  handleBlurValidateContent () {
    const value = this.span ? this.span.innerText.trim() : ''
    this.updateContent(value)
  }

  handleKeyDownPreventNewLine (event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      this.span && this.span.blur()
      this.handleBlurValidateContent()
    }
  }

  checkTarget (e) {
    if (e && e.target && this.controlsContent && !(this.controlsContent.contains(e.target) || this.controlsTrigger.contains(e.target))) {
      this.handleClickToggleControls()
    }
  }

  handleClickToggleControls () {
    const fn = this.state.showControls ? 'removeEventListener' : 'addEventListener'
    window[fn] && window[fn]('touchstart', this.checkTarget)
    this.setState({
      showControls: !this.state.showControls
    })
  }

  handleSandwichMouseEnter () {
    this.setState({
      showDropdown: true
    })
  }

  handleSandwichMouseLeave () {
    this.setState({
      showDropdown: false
    })
  }

  render () {
    const hidden = this.state.element.hidden
    const localizations = dataManager.get('localizations')
    const addText = localizations ? localizations.add : 'Add'
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const cloneText = localizations ? localizations.clone : 'Clone'
    const copyText = localizations ? localizations.copy : 'Copy'
    const pasteText = localizations ? localizations.paste : 'Paste'
    const pasteAfterText = localizations ? localizations.pasteAfter : 'Paste After'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    let visibilityText = ''
    if (hidden) {
      visibilityText = localizations ? localizations.hideOn : 'Hide Element'
    } else {
      visibilityText = localizations ? localizations.hideOff : 'Show Element'
    }
    const lockedElementText = localizations ? localizations.lockedElementText : 'The element has been locked by your site Administrator.'
    const elementIsHidden = localizations ? localizations.elementIsHidden : 'Element is Hidden'

    let { editable, content, copyData } = this.state

    const element = cook.get(this.props.element)
    if (!element) {
      return null
    }
    const isElementLocked = env('VCV_ADDON_ROLE_MANAGER_ENABLED') && element.get('metaIsElementLocked') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())
    const isDraggable = element.get('metaIsDraggable')
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    const treeChildClasses = classNames({
      'vcv-ui-tree-layout-node-child': true,
      'vcv-ui-tree-layout-node-expand': this.state.childExpand,
      'vcv-ui-tree-layout-node-state-draft': false,
      'vcv-ui-tree-layout-node-hidden': hidden,
      'vcv-ui-tree-layout-node-non-draggable': (isDraggable !== undefined && !isDraggable) || isElementLocked
    })
    const treeChildProps = {}
    let dragControl = null

    const innerChildren = documentManger.children(this.state.element.id)
    const childHtml = this.getContent(innerChildren)
    this.state.hasChild = !!innerChildren.length

    let addChildControl = false
    const elementContainerFor = element.containerFor()
    if (elementContainerFor.length) {
      let title = addElementText
      let addElementTag = ''
      const children = cook.getContainerChildren(element.get('tag'))
      if (children.length === 1) {
        addElementTag = children[0].tag
        title = `${addText} ${children[0].name}`
      }
      if (isAbleToAdd) {
        addChildControl = (
          <span
            className='vcv-ui-tree-layout-control-action'
            title={title}
            onClick={this.clickAddChild.bind(this, addElementTag)}
          >
            <i className='vcv-ui-icon vcv-ui-icon-add-thin' />
          </span>
        )
      }
    }

    let expandTrigger = ''
    if (this.state.hasChild) {
      expandTrigger = (
        <i
          className='vcv-ui-tree-layout-node-expand-trigger vcv-ui-icon vcv-ui-icon-expand'
          onClick={this.handleClickChildExpand}
        />
      )
    }

    let visibilityControl = ''
    if (this.props.element.tag !== 'column') {
      const iconClasses = classNames({
        'vcv-ui-icon': true,
        'vcv-ui-icon-eye-on': !hidden,
        'vcv-ui-icon-eye-off': hidden
      })
      visibilityControl = (
        <span className='vcv-ui-tree-layout-control-action' title={visibilityText} onClick={this.handleClickHide}>
          <i className={iconClasses} />
        </span>
      )
    }

    let pasteControl = false

    let copyControl = (isElementLocked || !isAbleToAdd) ? null : (
      <span
        className='vcv-ui-tree-layout-control-action'
        title={copyText}
        onClick={this.handleClickCopy.bind(this)}
      >
        <i className='vcv-ui-icon vcv-ui-icon-copy-icon' />
      </span>
    )

    let cloneControl = (isElementLocked || !isAbleToAdd) ? null : (
      <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={this.handleClickClone}>
        <i className='vcv-ui-icon vcv-ui-icon-copy' />
      </span>
    )

    const cookElement = this.state.element && cook.get(this.state.element)
    const elementCustomControls = cookElement.get('metaElementControls')

    if (elementCustomControls) {
      if (elementCustomControls.copy === false) {
        copyControl = null
      }
      if (elementCustomControls.clone === false) {
        cloneControl = null
      }
    }

    // paste action
    const pasteElContainerFor = cookElement && cookElement.get('containerFor')
    const isPasteAvailable = pasteElContainerFor && pasteElContainerFor.value && pasteElContainerFor.value.length

    if (isPasteAvailable && !isElementLocked && isAbleToAdd) {
      const pasteOptions = ControlHelpers.getPasteOptions(copyData, this.state.element)

      const attrs = {}

      if (pasteOptions.disabled) {
        attrs.disabled = true
      }

      if (!attrs.disabled) {
        if (elementCustomControls && (elementCustomControls.pasteAfter === false && pasteOptions.pasteAfter)) {
          attrs.disabled = true
        } else {
          attrs.onClick = pasteOptions.pasteAfter ? this.clickPasteAfter.bind(this) : this.clickPaste.bind(this)
        }
      }

      pasteControl = (
        <span
          className='vcv-ui-tree-layout-control-action'
          title={pasteOptions.pasteAfter ? pasteAfterText : pasteText}
          {...attrs}
        >
          <i className='vcv-ui-icon vcv-ui-icon-paste-icon' />
        </span>
      )
    }

    const childControls = isElementLocked ? null : (
      <span className='vcv-ui-tree-layout-control-actions'>
        {addChildControl}
        <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={this.handleClickEdit.bind(this, '')}>
          <i className='vcv-ui-icon vcv-ui-icon-edit' />
        </span>
        {cloneControl}
        {visibilityControl}
        {copyControl}
        {pasteControl}
        <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={this.handleClickDelete}>
          <i className='vcv-ui-icon vcv-ui-icon-trash' />
        </span>
      </span>
    )

    let lockControl = null
    const isAllowedToLockElement = roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())
    const isGeneral = cookElement.relatedTo('General') || cookElement.relatedTo('RootElements')
    const isLocked = cookElement.get('metaIsElementLocked') && env('VCV_ADDON_ROLE_MANAGER_ENABLED')

    const lockIcon = !isLocked ? null : (
      <span className='vcv-ui-tree-layout-control-state vcv-ui-tree-layout-control--lock' title={lockedElementText}>
        <i className='vcv-ui-icon vcv-ui-icon-lock-fill' />
      </span>
    )

    const isHidden = cookElement.get('hidden')

    const hideIcon = !isHidden ? null : (
      <span className='vcv-ui-tree-layout-control-state' title={elementIsHidden}>
        <i className='vcv-ui-icon vcv-ui-icon-eye-off' />
      </span>
    )

    if (!this.props.isAttribute && env('VCV_ADDON_ROLE_MANAGER_ENABLED') && isAllowedToLockElement && isGeneral) {
      const lockElementClasses = classNames({
        'vcv-ui-icon': true,
        'vcv-ui-icon-lock-fill': isLocked,
        'vcv-ui-icon-unlock-fill': !isLocked
      })
      const lockElementText = localizations ? localizations.lockElementText : 'Lock Element'
      lockControl = (
        <span className='vcv-ui-tree-layout-control-action' title={lockElementText} onClick={this.handleClickLock}>
          <i className={lockElementClasses} />
        </span>
      )
    }

    const showDropdown = addChildControl || cloneControl || visibilityControl || copyControl || pasteControl
    const sandwichControls = (
      <>
        {addChildControl}
        {cloneControl}
        {visibilityControl}
        {copyControl}
        {pasteControl}
      </>
    )

    const baseControlsItems = isElementLocked ? null : (
      <div className='vcv-ui-tree-layout-control-actions'>
        {lockControl}
        <span className='vcv-ui-tree-layout-control-action vcv-ui-tree-layout-control-action--edit' title={editText} onClick={this.handleClickEdit.bind(this, '')}>
          <i className='vcv-ui-icon vcv-ui-icon-edit' />
        </span>
        <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={this.handleClickDelete}>
          <i className='vcv-ui-icon vcv-ui-icon-trash' />
        </span>
        {showDropdown
          ? (
            <span
              className='vcv-ui-tree-layout-control-action vcv-ui-tree-layout-controls-trigger'
              onMouseEnter={this.handleSandwichMouseEnter}
              onMouseLeave={this.handleSandwichMouseLeave}
            >
              <i className='vcv-ui-icon vcv-ui-icon-mobile-menu' />
            </span>
          ) : null}
      </div>
    )

    const baseControls = (
      <>
        {baseControlsItems}
        <div className='vcv-ui-tree-layout-control-state-container'>
          {lockIcon}
          {hideIcon}
        </div>
      </>
    )

    const dropdownClasses = classNames({
      'vcv-ui-tree-layout-control-dropdown-content': true,
      'vcv-ui-state--active': this.state.showDropdown
    })
    let dropdown = null
    if (showDropdown) {
      dropdown = (
        <div
          className={dropdownClasses}
          onMouseEnter={this.handleSandwichMouseEnter}
          onMouseLeave={this.handleSandwichMouseLeave}
        >
          {sandwichControls}
        </div>
      )
    }

    const controlClasses = classNames({
      'vcv-ui-tree-layout-control': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-state--outline': this.state.showOutline,
      'vcv-ui-tree-layout-control-mobile': this.isMobile,
      'vcv-ui-tree-layout-control-is-locked': isElementLocked
    })

    const publicPath = hubElementsService.getElementIcon(element.get('tag'))
    const space = 0.8
    const defaultSpace = 1

    if (!content) {
      content = element.getName()
    }

    let controlLabelClasses = 'vcv-ui-tree-layout-control-label'
    if (editable) {
      controlLabelClasses += ' vcv-ui-tree-layout-control-label-editable'
    }

    let dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
    if (this.isMobile) {
      dragHelperClasses += ' vcv-ui-tree-layout-control-drag-handler-mobile'
    }

    const controlPadding = (space * this.props.level + defaultSpace) + 'rem'
    const controlStyle = utils.isRTL() ? { paddingRight: controlPadding } : { paddingLeft: controlPadding }

    if (env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !isAllowedToLockElement && cookElement && cookElement.get('metaIsElementLocked')) {
      treeChildProps['data-vcv-element-locked'] = true
    }

    if (this.isMobile) {
      let controlsContent = null
      if (this.state.showControls) {
        controlsContent = (
          <div
            ref={controlsContent => { this.controlsContent = controlsContent }}
            className='vcv-ui-tree-layout-controls-content'
          >
            {childControls}
          </div>
        )
      }

      return (
        <li
          className={treeChildClasses}
          data-vcv-element={this.props.element.id}
          type={element.get('type')}
          name={element.get('name')}
          {...treeChildProps}
        >
          <div className={controlClasses}>
            <div className='vcv-ui-tree-layout-control-content'>
              <div className={dragHelperClasses} style={controlStyle}>
                <i className='vcv-ui-tree-layout-control-icon'>
                  <img src={publicPath} className='vcv-ui-icon' alt='' />
                </i>
                <span className='vcv-ui-tree-layout-control-label'>
                  <span>{content}</span>
                </span>
              </div>
              <div
                className='vcv-ui-tree-layout-controls-trigger'
                onClick={this.handleClickToggleControls}
                ref={controlsTrigger => { this.controlsTrigger = controlsTrigger }}
              >
                <i className='vcv-ui-icon vcv-ui-icon-mobile-menu' />
              </div>
              {controlsContent}
            </div>
          </div>
          {childHtml}
        </li>
      )
    }

    if (isDraggable === undefined || isDraggable) {
      treeChildProps['data-vcv-dnd-element-expand-status'] = this.state.childExpand ? 'opened' : 'closed'
      dragControl = (
        <div className={dragHelperClasses} hidden={isElementLocked}>
          <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
        </div>
      )
    }

    const label = isElementLocked ? content : (
      <span
        ref={span => { this.span = span }}
        contentEditable={editable}
        suppressContentEditableWarning
        onClick={this.handleClickEnableEditable}
        onKeyDown={this.handleKeyDownPreventNewLine}
        onBlur={this.handleBlurValidateContent}
      >
        {content}
      </span>
    )

    return (
      <li
        className={treeChildClasses}
        data-vcv-element={this.props.element.id}
        type={element.get('type')}
        name={element.get('name')}
        {...treeChildProps}
      >
        <div
          className={controlClasses}
          style={controlStyle}
          onMouseOver={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleClick}
        >
          {dragControl}
          <div className='vcv-ui-tree-layout-control-content'>
            {expandTrigger}
            <i className='vcv-ui-tree-layout-control-icon'><img src={publicPath} className='vcv-ui-icon' alt='' /></i>
            <span className={controlLabelClasses}>
              {label}
            </span>
            {baseControls}
          </div>
          {dropdown}
        </div>
        {childHtml}
      </li>
    )
  }
}
