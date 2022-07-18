import { getService, getStorage, env } from 'vc-cake'
import React, { useState, useEffect, useRef } from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import { ControlHelpers } from 'public/components/elementControls/controlHelpers'
import TreeViewElementWrapper from './treeViewElementWrapper'

const workspaceStorage = getStorage('workspace')
const elementsStorage = getStorage('elements')
const utils = getService('utils')
const cook = getService('cook')
const hubElementsService = getService('hubElements')
const documentManager = getService('document')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

const adminBar = document.getElementById('wpadminbar')
const layoutBar = document.querySelector('.vcv-layout-bar')
const iframe = document.getElementById('vcv-editor-iframe')?.contentWindow.document
let isMobile = false
const mobileDetect = new MobileDetect(window.navigator.userAgent)
if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
  isMobile = true
}

const scrollToElementInsideFrame = (e) => {
  const elId = e.currentTarget.parentNode.dataset.vcvElement
  const editorEl = iframe.querySelector(`#el-${elId}`)
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

const localizations = dataManager.get('localizations')
const addText = localizations ? localizations.add : 'Add'
const addElementText = localizations ? localizations.addElement : 'Add Element'
const cloneText = localizations ? localizations.clone : 'Clone'
const copyText = localizations ? localizations.copy : 'Copy'
const pasteText = localizations ? localizations.paste : 'Paste'
const pasteAfterText = localizations ? localizations.pasteAfter : 'Paste After'
const removeText = localizations ? localizations.remove : 'Remove'
const editText = localizations ? localizations.edit : 'Edit'

const TreeViewElement = (props) => {
  const [childExpand, setChildExpand] = useState(props.level > 1 || isMobile)
  const [hasBeenOpened, setHasBeenOpened] = useState(false)
  const [showOutline, setShowOutline] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [showDropdownState, setShowDropdownState] = useState(false)
  const element = props.elementData
  const [editable, setEditable] = useState(false)
  const [copyData, setCopyData] = useState(window.localStorage && (window.localStorage.getItem('vcv-copy-data') || workspaceStorage.state('copyData').get()))

  const spanRef = useRef(null)
  const controlsContentRef = useRef(null)
  const controlsTriggerRef = useRef(null)

  useEffect(() => {
    if (element.id) {
      props.onMountCallback(element.id)
    }
    workspaceStorage.state('copyData').onChange(checkPaste)
    window.addEventListener('storage', checkPaste)

    return () => {
      if (element?.id) {
        props.onUnmountCallback(element.id)
      }
      workspaceStorage.state('copyData').ignoreChange(checkPaste)
      workspaceStorage.state('userInteractWith').set(false)
      window.removeEventListener('storage', checkPaste)
    }
  }, [element.id])

  useEffect(() => {
    const newShowOutline = props.showOutlineCallback(element?.id)
    newShowOutline !== showOutline && setShowOutline(newShowOutline)
  }, [element?.id, showOutline])

  useEffect(() => {
    if (editable) {
      spanRef && spanRef.current.focus()
    }
  }, [editable])

  useEffect(() => {
    if (props.elementData?.customHeaderTitle || props.elementData?.name) {
      spanRef.current.innerText = props.elementData?.customHeaderTitle || props.elementData?.name
    }
  }, [props.elementData?.customHeaderTitle, props.elementData?.name])

  if (!props.elementData) {
    return null
  }

  const checkPaste = (data) => {
    if ((data && data.element) || data.key === 'vcv-copy-data') {
      const copyData = data.key === 'vcv-copy-data' ? JSON.parse(data.newValue) : data
      setCopyData(copyData)
    }
  }

  const handleClickChildExpand = () => {
    setChildExpand(!childExpand)
    setHasBeenOpened(true)
  }

  const clickAddChild = (tag) => {
    workspaceStorage.trigger('add', element.id, tag)
  }

  const handleClickClone = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('clone', element.id)
  }

  const handleClickCopy = (e) => {
    e && e.preventDefault()
    const options = {}
    const cookElement = cook.getById(element.id)
    const tag = cookElement.get('tag')
    const elementSetting = cookElement.getAll()
    const isEditorTypeRelated = dataManager.get('editorType') === 'vcv_layouts' && (tag === 'layoutContentArea' || (elementSetting.sourceItem && elementSetting.sourceItem.tag === 'postsGridDataSourceArchive'))

    if (isEditorTypeRelated) {
      options.editorTypeRelation = dataManager.get('editorType')
      options.elementTag = tag === 'layoutContentArea' ? 'layoutContentArea' : 'postsGridDataSourceArchive'
    }
    workspaceStorage.trigger('copy', element.id, tag, options)
  }

  const clickPaste = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('paste', element.id)
  }

  const clickPasteAfter = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('pasteAfter', element.id)
  }

  const handleClickEdit = (tab = '') => {
    const settings = workspaceStorage.state('settings').get()
    if (settings && settings.action === 'edit') {
      workspaceStorage.state('settings').set(false)
    }
    const options = {}
    if (props.isAttribute) {
      options.child = true
      options.parentElementId = element.parent
      options.parentElementOptions = {}
    }
    workspaceStorage.trigger('edit', element.id, tab, options)
  }

  const handleClickDelete = (e) => {
    e && e.preventDefault()
    workspaceStorage.trigger('remove', element.id)
  }

  const handleClickHide = () => {
    workspaceStorage.trigger('hide', element.id)
  }

  const handleClickLock = () => {
    const options = {}
    const cookElement = cook.getById(element.id)
    if (cookElement.containerFor().length > 0) {
      options.lockInnerElements = true
      options.action = !documentManager.get(element.id).metaIsElementLocked ? 'lock' : 'unlock'
    }
    workspaceStorage.trigger('lock', element.id, options)
  }

  const getContent = (children) => {
    if (!childExpand && !hasBeenOpened && !isMobile) {
      return null
    }
    const { showOutlineCallback, onMountCallback, onUnmountCallback, level } = props
    const newLevel = level + 1
    const elementsList = children.map((innerElement) => {
      return (
        <TreeViewElementWrapper
          showOutlineCallback={showOutlineCallback}
          onMountCallback={onMountCallback}
          onUnmountCallback={onUnmountCallback}
          id={innerElement.id}
          key={innerElement.id}
          level={newLevel}
          scrollValue={props.scrollValue}
        />
      )
    }, this)
    return elementsList.length ? <ul className='vcv-ui-tree-layout-node'>{elementsList}</ul> : ''
  }

  const scrollToElementInsideCurrentDocument = (e) => {
    const { scrollValue } = props
    const elId = e.currentTarget.parentNode.dataset.vcvElement
    const editorEl = document.getElementById(`el-${elId}-temp`)
    if (!editorEl) {
      return
    }
    const elRect = editorEl.getBoundingClientRect()
    const isFixed = window.getComputedStyle(layoutBar).position === 'fixed'
    const wh = window.innerHeight
    const below = elRect.bottom > wh && elRect.top > wh
    const above = isFixed ? elRect.bottom < layoutBar.getBoundingClientRect().bottom : elRect.bottom < 0 && elRect.top < 0

    if (above || below) {
      const barHeight = typeof scrollValue === 'function' ? scrollValue(layoutBar, adminBar) : scrollValue
      const curPos = window.pageYOffset
      const yPos = curPos + elRect.top - barHeight
      window.scrollTo(0, yPos)
    }
  }

  const handleClick = (e) => {
    if (!props.scrollValue) {
      scrollToElementInsideFrame(e)
    } else {
      scrollToElementInsideCurrentDocument(e)
    }
  }

  const handleMouseEnter = (e) => {
    if (e.currentTarget.parentNode.dataset && Object.prototype.hasOwnProperty.call(e.currentTarget.parentNode.dataset, 'vcvElement')) {
      workspaceStorage.state('userInteractWith').set(element.id)
    }
  }

  const handleMouseLeave = (e) => {
    if (e.currentTarget.parentNode.dataset && Object.prototype.hasOwnProperty.call(e.currentTarget.parentNode.dataset, 'vcvElement')) {
      workspaceStorage.state('userInteractWith').set(false)
    }
  }

  const handleClickEnableEditable = () => {
    setEditable(true)
  }

  const updateContent = (value) => {
    const cookElement = cook.get(props.elementData)
    cookElement.set('customHeaderTitle', value)
    const elementData = cookElement.toJS()
    elementsStorage.trigger('update', elementData.id, elementData, 'editForm')

    setEditable(false)
    // setContent(value || cookElement.getName())
  }

  const handleBlurValidateContent = () => {
    const value = spanRef ? spanRef.current.innerText.trim() : ''
    updateContent(value)
  }

  const handleKeyDownPreventNewLine = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      event.nativeEvent.stopImmediatePropagation()
      event.stopPropagation()
      spanRef && spanRef.current.blur()
      handleBlurValidateContent()
    }
  }

  const checkTarget = (e) => {
    if (e && e.target && controlsContentRef && !(controlsContentRef.current.contains(e.target) || controlsTriggerRef.current.contains(e.target))) {
      handleClickToggleControls()
    }
  }

  const handleClickToggleControls = () => {
    const fn = showControls ? 'removeEventListener' : 'addEventListener'
    window[fn] && window[fn]('touchstart', checkTarget)
    setShowControls(!showControls)
  }

  const handleSandwichMouseEnter = () => {
    setShowDropdownState(true)
  }

  const handleSandwichMouseLeave = () => {
    setShowDropdownState(false)
  }

  const hidden = element.hidden

  let visibilityText = ''
  if (hidden) {
    visibilityText = localizations ? localizations.hideOn : 'Hide Element'
  } else {
    visibilityText = localizations ? localizations.hideOff : 'Show Element'
  }

  const lockedElementText = localizations ? localizations.lockedElementText : 'The element has been locked by your site Administrator.'
  const elementIsHidden = localizations ? localizations.elementIsHidden : 'Element is Hidden'

  const cookElement = element && cook.get(element)
  if (!cookElement) {
    return null
  }
  const isElementLocked = env('VCV_ADDON_ROLE_MANAGER_ENABLED') && cookElement.get('metaIsElementLocked') && !roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())
  const isDraggable = cookElement.get('metaIsDraggable')
  const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
  const treeChildClasses = classNames({
    'vcv-ui-tree-layout-node-child': true,
    'vcv-ui-tree-layout-node-expand': childExpand,
    'vcv-ui-tree-layout-node-state-draft': false,
    'vcv-ui-tree-layout-node-hidden': hidden,
    'vcv-ui-tree-layout-node-non-draggable': (isDraggable !== undefined && !isDraggable) || isElementLocked
  })
  const treeChildProps = {}
  let dragControl = null

  const innerChildren = documentManager.children(element.id)
  const childHtml = getContent(innerChildren)

  let addChildControl = false
  const elementContainerFor = cookElement.containerFor()
  if (elementContainerFor.length) {
    let title = addElementText
    let addElementTag = ''
    const children = cook.getContainerChildren(cookElement.get('tag'))
    if (children.length === 1) {
      addElementTag = children[0].tag
      title = `${addText} ${children[0].name}`
    }
    if (isAbleToAdd) {
      addChildControl = (
        <span
          className='vcv-ui-tree-layout-control-action'
          title={title}
          onClick={() => clickAddChild(addElementTag)}
        >
          <i className='vcv-ui-icon vcv-ui-icon-add-thin' />
        </span>
      )
    }
  }

  let expandTrigger = ''
  if (innerChildren.length) {
    expandTrigger = (
      <i
        className='vcv-ui-tree-layout-node-expand-trigger vcv-ui-icon vcv-ui-icon-expand'
        onClick={handleClickChildExpand}
      />
    )
  }

  let visibilityControl = ''
  if (props.elementData.tag !== 'column') {
    const iconClasses = classNames({
      'vcv-ui-icon': true,
      'vcv-ui-icon-eye-on': !hidden,
      'vcv-ui-icon-eye-off': hidden
    })
    visibilityControl = (
      <span className='vcv-ui-tree-layout-control-action' title={visibilityText} onClick={handleClickHide}>
        <i className={iconClasses} />
      </span>
    )
  }

  let pasteControl = false

  let copyControl = (isElementLocked || !isAbleToAdd) ? null : (
    <span
      className='vcv-ui-tree-layout-control-action'
      title={copyText}
      onClick={handleClickCopy}
    >
      <i className='vcv-ui-icon vcv-ui-icon-copy-icon' />
    </span>
  )

  let cloneControl = (isElementLocked || !isAbleToAdd) ? null : (
    <span className='vcv-ui-tree-layout-control-action' title={cloneText} onClick={handleClickClone}>
      <i className='vcv-ui-icon vcv-ui-icon-copy' />
    </span>
  )

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
  const isPasteAvailable = pasteElContainerFor?.value?.length

  if (isPasteAvailable && !isElementLocked && isAbleToAdd) {
    const pasteOptions = ControlHelpers.getPasteOptions(copyData, element)

    const attrs = {}

    if (pasteOptions.disabled) {
      attrs.disabled = true
    }

    if (!attrs.disabled) {
      if (elementCustomControls && (elementCustomControls.pasteAfter === false && pasteOptions.pasteAfter)) {
        attrs.disabled = true
      } else {
        attrs.onClick = pasteOptions.pasteAfter ? clickPasteAfter : clickPaste
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
      <span className='vcv-ui-tree-layout-control-action' title={editText} onClick={() => handleClickEdit('')}>
        <i className='vcv-ui-icon vcv-ui-icon-edit' />
      </span>
      {cloneControl}
      {visibilityControl}
      {copyControl}
      {pasteControl}
      <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={handleClickDelete}>
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

  if (!props.isAttribute && env('VCV_ADDON_ROLE_MANAGER_ENABLED') && isAllowedToLockElement && isGeneral) {
    const lockElementClasses = classNames({
      'vcv-ui-icon': true,
      'vcv-ui-icon-lock-fill': isLocked,
      'vcv-ui-icon-unlock-fill': !isLocked
    })
    const lockElementText = localizations ? localizations.lockElementText : 'Lock Element'
    lockControl = (
      <span className='vcv-ui-tree-layout-control-action' title={lockElementText} onClick={handleClickLock}>
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
      <span className='vcv-ui-tree-layout-control-action vcv-ui-tree-layout-control-action--edit' title={editText} onClick={() => handleClickEdit('')}>
        <i className='vcv-ui-icon vcv-ui-icon-edit' />
      </span>
      <span className='vcv-ui-tree-layout-control-action' title={removeText} onClick={handleClickDelete}>
        <i className='vcv-ui-icon vcv-ui-icon-trash' />
      </span>
      {showDropdown
        ? (
          <span
            className='vcv-ui-tree-layout-control-action vcv-ui-tree-layout-controls-trigger'
            onMouseEnter={handleSandwichMouseEnter}
            onMouseLeave={handleSandwichMouseLeave}
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
    'vcv-ui-state--active': showDropdownState
  })
  let dropdown = null
  if (showDropdown) {
    dropdown = (
      <div
        className={dropdownClasses}
        onMouseEnter={handleSandwichMouseEnter}
        onMouseLeave={handleSandwichMouseLeave}
      >
        {sandwichControls}
      </div>
    )
  }

  const controlClasses = classNames({
    'vcv-ui-tree-layout-control': true,
    'vcv-ui-state--active': false,
    'vcv-ui-state--outline': showOutline,
    'vcv-ui-tree-layout-control-mobile': isMobile,
    'vcv-ui-tree-layout-control-is-locked': isElementLocked
  })

  const publicPath = hubElementsService.getElementIcon(cookElement.get('tag'))
  const space = 0.8
  const defaultSpace = 1

  const spanContent = props.elementData?.customHeaderTitle || props.elementData?.name || cookElement.getName()

  let controlLabelClasses = 'vcv-ui-tree-layout-control-label'
  if (editable) {
    controlLabelClasses += ' vcv-ui-tree-layout-control-label-editable'
  }

  let dragHelperClasses = 'vcv-ui-tree-layout-control-drag-handler vcv-ui-drag-handler'
  if (isMobile) {
    dragHelperClasses += ' vcv-ui-tree-layout-control-drag-handler-mobile'
  }

  const controlPadding = (space * props.level + defaultSpace) + 'rem'
  const controlStyle = utils.isRTL() ? { paddingRight: controlPadding } : { paddingLeft: controlPadding }

  if (env('VCV_ADDON_ROLE_MANAGER_ENABLED') && !isAllowedToLockElement && cookElement && cookElement.get('metaIsElementLocked')) {
    treeChildProps['data-vcv-element-locked'] = true
  }

  if (isMobile) {
    let controlsContent = null
    if (showControls) {
      controlsContent = (
        <div
          ref={controlsContentRef}
          className='vcv-ui-tree-layout-controls-content'
        >
          {childControls}
        </div>
      )
    }

    return (
      <li
        className={treeChildClasses}
        data-vcv-element={props.elementData.id}
        type={cookElement.get('type')}
        name={cookElement.get('name')}
        {...treeChildProps}
      >
        <div className={controlClasses}>
          <div className='vcv-ui-tree-layout-control-content'>
            <div className={dragHelperClasses} style={controlStyle}>
              <i className='vcv-ui-tree-layout-control-icon'>
                <img src={publicPath} className='vcv-ui-icon' alt='' />
              </i>
              <span className='vcv-ui-tree-layout-control-label'>
                <span>{spanContent}</span>
              </span>
            </div>
            <div
              className='vcv-ui-tree-layout-controls-trigger'
              onClick={handleClickToggleControls}
              ref={controlsTriggerRef}
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
    treeChildProps['data-vcv-dnd-element-expand-status'] = childExpand ? 'opened' : 'closed'
    dragControl = (
      <div className={dragHelperClasses} hidden={isElementLocked}>
        <i className='vcv-ui-drag-handler-icon vcv-ui-icon vcv-ui-icon-drag-dots' />
      </div>
    )
  }

  const label = isElementLocked ? spanContent : (
    <span
      ref={spanRef}
      contentEditable={editable}
      suppressContentEditableWarning
      onClick={handleClickEnableEditable}
      onKeyDown={handleKeyDownPreventNewLine}
      onBlur={handleBlurValidateContent}
    >
      {spanContent}
    </span>
  )

  return (
    <li
      className={treeChildClasses}
      data-vcv-element={props.elementData.id}
      type={cookElement.get('type')}
      name={cookElement.get('name')}
      {...treeChildProps}
    >
      <div
        className={controlClasses}
        style={controlStyle}
        onMouseOver={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
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

TreeViewElement.displayName = 'TreeViewElement'

export default TreeViewElement
