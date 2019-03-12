import { getService, getStorage } from 'vc-cake'
import { exceptionalElements } from './exceptionalElements'

const documentManager = getService('document')
const workspaceStorage = getStorage('workspace')
const cacheStorage = getStorage('cache')
const cook = getService('cook')
const hubCategoriesService = getService('hubCategories')

export default class ControlsHandler {
  constructor (props) {
    this.iframeContainer = props.iframeContainer
    this.iframeOverlay = props.iframeOverlay
    this.iframe = props.iframe
    this.iframeWindow = props.iframeWindow
    this.iframeDocument = props.iframeDocument

    this.controlsWrapper = null
    this.controlsContainer = null
    this.appendControlWrapper = null
    this.appendControlContainer = null

    this.state = {
      containerTimeout: null,
      appendContainerTimeout: null
    }
    this.updateDropdownsPosition = this.updateDropdownsPosition.bind(this)
    this.hide = this.hide.bind(this)

    this.setup()
  }

  setup () {
    this.controlsWrapper = document.createElement('div')
    this.controlsWrapper.classList.add('vcv-ui-outline-controls-wrapper')
    this.iframeOverlay.appendChild(this.controlsWrapper)

    this.controlsContainer = document.createElement('div')
    this.controlsContainer.classList.add('vcv-ui-outline-controls-container', 'wip')
    this.controlsWrapper.appendChild(this.controlsContainer)
    this.controlsContainer.addEventListener('mouseenter', this.updateDropdownsPosition)

    this.appendControlWrapper = document.createElement('div')
    this.appendControlWrapper.classList.add('vcv-ui-append-control-wrapper')
    this.iframeOverlay.appendChild(this.appendControlWrapper)

    this.appendControlContainer = document.createElement('div')
    this.appendControlContainer.classList.add('vcv-ui-append-control-container')
    this.appendControlWrapper.appendChild(this.appendControlContainer)
  }

  componentDidMount () {
    workspaceStorage.state('copyData').onChange(this.hide)
  }

  /**
   * Get controls container
   * @returns {null|*}
   */
  getControlsContainer () {
    return this.controlsContainer
  }

  /**
   * Get append control container
   * @returns {null|*}
   */
  getAppendControlContainer () {
    return this.appendControlContainer
  }

  /**
   * Show outline
   * @param data
   */
  show (data) {
    this.elementInlineEdit = data.elementInlineEdit
    this.element = data.element
    this.createControls(data)
    this.autoUpdateContainerPosition(data)
    this.createAppendControl(data)
    this.autoUpdateAppendContainerPosition(data)
  }

  /**
   * Hide outline
   */
  hide () {
    this.destroyControls()
    this.stopAutoUpdateContainerPosition()
    this.destroyAppendControl()
    this.stopAutoUpdateAppendContainerPosition()
  }

  /**
   * Create controls
   * @param data
   */
  createControls (data) {
    this.buildControls(data)
    // change controls direction
    this.updateControlsPosition(data.element)
  }

  /**
   * Build controls depending on layout width,
   * rebuild controls depending on position relative to the layout left side
   * @param data
   * @param rebuild
   */
  buildControls (data, rebuild = false) {
    if (this.controlsContainer.children.length) {
      return
    }
    let elementIds = data.vcElementsPath
    let iframeRect = this.iframe.getBoundingClientRect()

    // create controls container
    let controlsList = document.createElement('nav')
    controlsList.classList.add('vcv-ui-outline-controls')
    this.controlsContainer.appendChild(controlsList)

    // create element controls
    for (let i = 0; i < elementIds.length; i++) {
      let elementId = elementIds[ i ]
      let delimiter = document.createElement('i')
      delimiter.classList.add('vcv-ui-outline-control-separator', 'vcv-ui-icon', 'vcv-ui-icon-arrow-right')
      if (i === 0) {
        controlsList.appendChild(this.createControlForElement(elementId))
        if (i !== elementIds.length - 1) {
          controlsList.insertBefore(delimiter, controlsList.children[ 0 ])
        }
        // only for the first (most nested) element (last in the control navbar)
        this.appendEditAndRemove(controlsList, elementId)
      } else {
        const controlsRect = controlsList.getBoundingClientRect()
        const controlWidth = (controlsRect.width - 2) / (controlsList.children.length / 2)
        const isWider = iframeRect.width - controlsRect.width < controlWidth * 2
        const isToTheLeft = controlsRect.left - controlWidth * 2 < iframeRect.left
        if (isWider || (rebuild && isToTheLeft)) {
          controlsList.insertBefore(this.createControlForTrigger(elementId,
            {
              title: 'Tree View',
              event: 'treeView'
            }), controlsList.children[ 0 ])
          break
        }
        controlsList.insertBefore(this.createControlForElement(elementId), controlsList.children[ 0 ])
        if (i !== elementIds.length - 1) {
          controlsList.insertBefore(delimiter, controlsList.children[ 0 ])
        }
      }
    }
    this.elementInlineEdit && this.element.addEventListener('mouseup', this.hide)
  }

  addControlDropdownInteractionEvents (controlsList) {
    let controls = controlsList.querySelectorAll('.vcv-ui-outline-control-dropdown')
    controls = [].slice.call(controls)
    controls.forEach(control => {
      control.addEventListener('mouseenter', this.controlDropdownMouseEnter.bind(this, control))
      control.addEventListener('mouseleave', this.controlDropdownMouseLeave.bind(this, control))
    })
    this.elementInlineEdit && this.element.addEventListener('mouseup', this.hide)
  }

  controlDropdownMouseEnter (control) {
    if (this.controlDropdownInterval) {
      clearInterval(this.controlDropdownInterval)
      this.controlDropdownInterval = null
    }
    if (this.currentDropdownControl) {
      this.currentDropdownControl.classList.remove('vcv-ui-outline-control-dropdown-active')
    }
    this.currentDropdownControl = control
    this.currentDropdownControl.classList.add('vcv-ui-outline-control-dropdown-active')
  }

  controlDropdownMouseLeave (control) {
    this.controlDropdownInterval = setInterval(() => {
      control.classList.remove('vcv-ui-outline-control-dropdown-active')
      this.currentDropdownControl = null
      clearInterval(this.controlDropdownInterval)
      this.controlDropdownInterval = null
    }, 300)
  }

  appendEditAndRemove (appendContainer, elementId) {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    appendContainer.appendChild(this.createAdditionalControl(elementId, 'edit', editText))
    appendContainer.appendChild(this.createAdditionalControl(elementId, 'remove', removeText))
  }

  createAdditionalControl (elementId, action, titleText) {
    const vcElement = this.getVcElement(elementId)
    const colorIndex = this.getElementColorIndex(vcElement)
    const control = document.createElement('div')
    const elName = vcElement.get('customHeaderTitle') || vcElement.get('name')

    control.classList.add('vcv-ui-outline-control-simple', `vcv-ui-outline-control-type-index-${colorIndex}`)
    control.dataset.vcvElementControls = elementId

    let iconClass = `vcv-ui-icon-${action}`
    if (action === 'remove') {
      iconClass = `vcv-ui-icon-trash`
    }

    let iconAction = {
      label: false,
      title: `${titleText} ${elName}`,
      icon: iconClass,
      data: {
        vcControlEvent: action
      }
    }

    control.appendChild(this.createControlAction(elementId, iconAction))
    return control
  }

  getPasteOptions (copyData, pasteEl) {
    let pasteOptions = {
      disabled: !copyData,
      pasteAfter: false
    }

    if (!copyData || copyData.constructor !== String) {
      return pasteOptions
    }

    try {
      copyData = JSON.parse(copyData)
    } catch (err) {
      console.error(err)
      return pasteOptions
    }

    const copiedEl = copyData && copyData.element && copyData.element.element
    const copiedElCook = copiedEl && cook.get(copiedEl)
    const copiedElRelatedTo = copiedElCook.get('relatedTo')
    const copiedElRelatedToValue = copiedElRelatedTo && copiedElRelatedTo.value

    const pasteElCook = pasteEl && cook.get(pasteEl)
    const pasteElContainerFor = pasteElCook.get('containerFor')
    const pasteElContainerForValue = pasteElContainerFor && pasteElContainerFor.value

    if (
      copiedElRelatedToValue &&
      pasteElContainerForValue &&
      copiedElRelatedToValue.length &&
      pasteElContainerForValue.length
    ) {
      if (pasteElContainerForValue.indexOf('General') < 0 || copiedElRelatedToValue.indexOf('General') < 0) {
        pasteOptions.disabled = true

        pasteElContainerForValue.forEach((item) => {
          if (copiedElRelatedToValue.indexOf(item) >= 0) {
            pasteOptions.disabled = false
          }
        })
      }

      if (pasteOptions.disabled && pasteElContainerForValue.indexOf('General') < 0) {
        if (pasteElCook.get('tag') === copiedElCook.get('tag')) {
          pasteOptions.disabled = false
          pasteOptions.pasteAfter = true
        }
      }
    }

    return pasteOptions
  }

  /**
   * Create append element control
   * @param data
   */
  createAppendControl (data) {
    if (this.appendControlContainer.children.length) {
      return
    }
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    let elementIds = data.vcElementsPath
    const insertAfterElement = elementIds && elementIds.length ? elementIds[ 0 ] : false
    const container = elementIds && elementIds.length > 2 ? elementIds[ 1 ] : false
    if (!container || !insertAfterElement) {
      return false
    }
    const containerElement = cook.get(documentManager.get(container))
    if (!containerElement || !containerElement.relatedTo([ exceptionalElements ])) {
      return false
    }
    let appendControl = document.createElement('span')
    appendControl.classList.add('vcv-ui-append-control')
    appendControl.title = addElementText
    appendControl.dataset.vcvElementId = containerElement.get('id')
    appendControl.dataset.vcControlEvent = 'add'
    appendControl.dataset.vcControlEventOptions = ''
    appendControl.dataset.vcControlEventOptionInsertAfter = insertAfterElement
    let appendControlContent = document.createElement('i')
    appendControlContent.classList.add('vcv-ui-icon', 'vcv-ui-icon-add')
    appendControl.appendChild(appendControlContent)

    this.appendControlContainer.appendChild(appendControl)
  }

  /**
   * Create control for trigger
   * @param element
   * @param options
   * @returns {Element}
   */
  createControlForTrigger (element, options) {
    // create trigger
    let trigger = document.createElement('span')
    trigger.classList.add('vcv-ui-outline-control', 'vcv-ui-outline-control-more')
    trigger.dataset.vcvElementId = element
    trigger.dataset.vcControlEvent = options.event
    trigger.title = options.title

    // crate trigger content
    let triggerContent = document.createElement('span')
    triggerContent.classList.add('vcv-ui-outline-control-content')
    trigger.appendChild(triggerContent)

    // create trigger icon
    let triggerIcon = document.createElement('i')
    triggerIcon.classList.add('vcv-ui-outline-control-icon', 'vcv-ui-icon', 'vcv-ui-icon-layers')
    triggerContent.appendChild(triggerIcon)

    return trigger
  }

  /**
   * Create control for element
   * @param elementId
   * @returns {Element}
   */
  createControlForElement (elementId) {
    let vcElement = this.getVcElement(elementId)
    let colorIndex = this.getElementColorIndex(vcElement)
    let cachedControls = cacheStorage.state('controls').get()
    if (cachedControls[elementId]) {
      return cachedControls[elementId]
    }

    let control = document.createElement('div')
    control.classList.add('vcv-ui-outline-control-dropdown', `vcv-ui-outline-control-type-index-${colorIndex}`)
    control.dataset.vcvElementControls = elementId

    control.addEventListener('mouseenter', this.controlDropdownMouseEnter.bind(this, control))
    control.addEventListener('mouseleave', this.controlDropdownMouseLeave.bind(this, control))

    // create control trigger
    control.appendChild(this.createControlTrigger(
      elementId,
      {
        title: vcElement.get('customHeaderTitle') || vcElement.get('name'),
        icon: hubCategoriesService.getElementIcon(vcElement.get('tag'))
      }
    ))
    // create control dropdown
    let doType = vcElement.get('designOptions') ? 'designOptions' : 'designOptionsAdvanced'
    control.appendChild(this.createControlDropdown(
      elementId,
      {
        isContainer: colorIndex < 2,
        title: vcElement.get('customHeaderTitle') || vcElement.get('name'),
        name: vcElement.get('name'),
        tag: vcElement.get('tag'),
        relatedTo: vcElement.get('relatedTo'),
        designOptions: doType,
        containerFor: vcElement.get('containerFor')
      }
    ))

    cacheStorage.trigger('set', 'controls', elementId, control)
    return control
  }

  /**
   * Create control trigger
   * @param elementId
   * @param options
   * @returns {Element}
   */
  createControlTrigger (elementId, options) {
    let trigger = document.createElement('div')
    trigger.classList.add('vcv-ui-outline-control-dropdown-trigger', 'vcv-ui-outline-control')
    trigger.dataset.vcvElementId = elementId
    trigger.title = options.title

    // crate trigger content
    let triggerContent = document.createElement('span')
    triggerContent.classList.add('vcv-ui-outline-control-content')
    triggerContent.dataset.vcDragHelper = elementId
    trigger.appendChild(triggerContent)

    // create icon
    let icon = document.createElement('img')
    icon.classList.add('vcv-ui-outline-control-icon')
    icon.src = options.icon
    icon.alt = options.title
    triggerContent.appendChild(icon)

    return trigger
  }

  /**
   * Create control dropdown
   * @param elementId
   * @param options
   * @returns {Element}
   */
  createControlDropdown (elementId, options) {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addText = localizations ? localizations.add : 'Add'
    const addElementText = localizations ? localizations.addElement : 'Add Element'
    const moveText = localizations ? localizations.move : 'Move'
    const cloneText = localizations ? localizations.clone : 'Clone'
    const copyText = localizations ? localizations.copy : 'Copy'
    const pasteText = localizations ? localizations.paste : 'Paste'
    const pasteAfterText = localizations ? localizations.pasteAfter : 'Paste After'
    const removeText = localizations ? localizations.remove : 'Remove'
    const editText = localizations ? localizations.edit : 'Edit'
    const hideOffText = localizations ? localizations.hideOff : 'Hide: Off'
    const designOptionsText = localizations ? localizations.designOptions : 'Design Options'
    const rowLayoutText = localizations ? localizations.rowLayout : 'Row Layout'
    let designOptionEvent = options.designOptions

    let dropdown = document.createElement('div')
    dropdown.classList.add('vcv-ui-outline-control-dropdown-content')

    // prepare actions
    let actions = []

    // add move action
    actions.push({
      label: `${moveText} ${options.title}`,
      icon: 'vcv-ui-icon-move',
      data: {
        vcDragHelper: elementId
      }
    })

    // add element action
    if (options.isContainer) {
      // tabs don't have advanced design options
      let label = addElementText
      let addElementTag = ''
      let childrenTags = cook.getChildrenTags(options.tag)
      if (childrenTags.length === 1) {
        addElementTag = childrenTags[ 0 ]
        label = `${addText} ${addElementTag}`
      }
      if (options.tag === 'buttonGroup') {
        label = `${addText} Button`
        addElementTag = options.tag
      }
      if (options.tag === 'iconGroup') {
        let element = cook.get({ tag: 'icon' })
        label = `${addText} ${element.get('name')}`
        addElementTag = element.get('tag')
      }
      actions.push({
        label: label,
        icon: 'vcv-ui-icon-add-thin',
        data: {
          vcControlEvent: 'add',
          vcControlEventOptions: addElementTag
        }
      })
    }

    // edit general control
    actions.push({
      label: editText,
      title: `${editText} ${options.title}`,
      icon: 'vcv-ui-icon-edit',
      data: {
        vcControlEvent: 'edit'
      }
    })

    // add controls for row
    if (options.tag === 'row') {
      actions.push({
        label: rowLayoutText,
        icon: 'vcv-ui-icon-row-layout',
        data: {
          vcControlEvent: 'edit',
          vcControlEventOptions: 'layout'
        }
      })
    }

    // edit design options control
    actions.push({
      label: designOptionsText,
      title: `${options.title} ${designOptionsText}`,
      icon: 'vcv-ui-icon-brush-alt',
      data: {
        vcControlEvent: 'edit',
        vcControlEventOptions: designOptionEvent
      }
    })

    // clone control
    actions.push({
      label: cloneText,
      title: `${cloneText} ${options.title}`,
      icon: 'vcv-ui-icon-copy',
      data: {
        vcControlEvent: 'clone'
      }
    })

    // copy action
    actions.push({
      label: copyText,
      title: `${copyText} ${options.title}`,
      icon: 'vcv-ui-icon-copy-icon',
      data: {
        vcControlEvent: 'copy'
      }
    })

    // paste action
    const pasteElCook = options && cook.get(options)
    const pasteElContainerFor = pasteElCook && pasteElCook.get('containerFor')
    const isPasteAvailable = pasteElContainerFor && pasteElContainerFor.value && pasteElContainerFor.value.length

    if (isPasteAvailable) {
      let copyData = (window.localStorage && window.localStorage.getItem('vcv-copy-data')) || workspaceStorage.state('copyData').get()
      let pasteOptions = this.getPasteOptions(copyData, options)

      actions.push({
        label: pasteOptions.pasteAfter ? pasteAfterText : pasteText,
        disabled: pasteOptions.disabled,
        icon: 'vcv-ui-icon-paste-icon',
        data: {
          vcControlEvent: pasteOptions.pasteAfter ? 'pasteAfter' : 'paste'
        }
      })
    }

    if (options.tag !== 'column') {
      actions.push({
        label: hideOffText,
        title: hideOffText,
        icon: 'vcv-ui-icon-eye-on',
        data: {
          vcControlEvent: 'hide'
        }
      })
    }

    // remove control
    actions.push({
      label: removeText,
      title: `${removeText} ${options.title}`,
      icon: 'vcv-ui-icon-trash',
      data: {
        vcControlEvent: 'remove'
      }
    })

    actions.forEach((action) => {
      dropdown.appendChild(this.createControlAction(elementId, action))
    })

    return dropdown
  }

  /**
   * Create control action
   * @param elementId
   * @param options
   * @returns {Element}
   */
  createControlAction (elementId, options) {
    let action = document.createElement('span')
    action.classList.add('vcv-ui-outline-control')
    action.dataset.vcvElementId = elementId

    if (options.data) {
      for (let key in options.data) {
        action.dataset[ key ] = options.data[ key ]
      }
    }

    let actionContent = document.createElement('span')
    actionContent.classList.add('vcv-ui-outline-control-content')
    actionContent.title = options.title || options.label
    if (options.disabled) {
      actionContent.setAttribute('disabled', true)
      action.dataset[ 'vcControlEventDisabled' ] = true
    }
    action.appendChild(actionContent)

    let icon = document.createElement('i')
    icon.classList.add('vcv-ui-outline-control-icon', 'vcv-ui-icon', options.icon)
    actionContent.appendChild(icon)

    if (options.label) {
      let label = document.createElement('span')
      label.classList.add('vcv-ui-outline-control-label')
      label.appendChild(document.createTextNode(options.label))
      actionContent.appendChild(label)
    }

    return action
  }

  /**
   * Get vc element
   * @param elementId
   */
  getVcElement (elementId) {
    return cook.get(documentManager.get(elementId))
  }

  /**
   * Get vc element color index
   * @param vcElement
   * @returns {number}
   */
  getElementColorIndex (vcElement) {
    let colorIndex = 2
    if (vcElement && vcElement.containerFor().length > 0) {
      const isColoredElement = exceptionalElements.find(element => vcElement.containerFor().indexOf(element) > -1)
      colorIndex = isColoredElement ? 0 : 1
    }
    return colorIndex
  }

  /**
   * Destroy controls
   */
  destroyControls () {
    let controls = this.controlsContainer && this.controlsContainer.querySelectorAll('.vcv-ui-outline-control-dropdown')
    controls = [].slice.call(controls)
    controls.forEach(control => {
      control.removeEventListener('mouseenter', this.controlDropdownMouseEnter.bind(this, control))
      control.removeEventListener('mouseleave', this.controlDropdownMouseLeave.bind(this, control))
    })
    this.elementInlineEdit && this.element.removeEventListener('mouseup', this.hide)

    while (this.controlsContainer && this.controlsContainer.firstChild) {
      this.controlsContainer.removeChild(this.controlsContainer.firstChild)
    }
  }

  /**
   * Destroy append element control
   */
  destroyAppendControl () {
    while (this.appendControlContainer && this.appendControlContainer.firstChild) {
      this.appendControlContainer.removeChild(this.appendControlContainer.firstChild)
    }
  }

  /**
   * Update controls container position
   * @param data
   */
  updateContainerPosition (data) {
    let elementRect = data.element.getBoundingClientRect()
    let controls = this.controlsContainer.firstElementChild
    let controlsHeight = 0
    if (controls) {
      controlsHeight = controls.getBoundingClientRect().height
    }
    // set sticky controls
    let posTop = elementRect.top
    if (posTop - controlsHeight < 0) {
      this.controlsContainer.classList.add('vcv-ui-controls-o-inset')
      posTop = controlsHeight
    } else {
      this.controlsContainer.classList.remove('vcv-ui-controls-o-inset')
    }
    let posLeft = elementRect.left
    if (this.iframe.tagName.toLowerCase() !== 'iframe') {
      let iframeRect = this.iframe.getBoundingClientRect()
      posTop -= iframeRect.top
      posLeft -= iframeRect.left
    }
    if (posLeft < 0) {
      posLeft = 0
    }
    this.controlsContainer.style.top = posTop + 'px'
    this.controlsContainer.style.left = posLeft + 'px'
    this.controlsContainer.style.width = elementRect.width + 'px'
    const iframeRect = this.iframe.getBoundingClientRect()
    const controlsRect = controls.getBoundingClientRect()
    if (!this.state.containerTimeout && iframeRect.left > controlsRect.left) {
      this.destroyControls()
      this.buildControls(data, true)
    }
  }

  /**
   * Update append control container position
   * @param data
   */
  updateAppendContainerPosition (data) {
    let elementRect = data.element.getBoundingClientRect()
    let control = this.appendControlContainer.firstElementChild
    let controlPos = 0
    if (control) {
      controlPos = control.getBoundingClientRect()
    }

    let posTop = elementRect.bottom - controlPos.height / 2
    let posLeft = elementRect.left
    if (this.iframe.tagName.toLowerCase() !== 'iframe') {
      let iframeRect = this.iframe.getBoundingClientRect()
      posTop -= iframeRect.top
      posLeft -= iframeRect.left
    }
    this.appendControlContainer.style.top = posTop + 'px'
    this.appendControlContainer.style.left = posLeft + 'px'
    this.appendControlContainer.style.width = elementRect.width + 'px'
  }

  /**
   * Automatically update controls container position after timeout
   * @param data
   */
  autoUpdateContainerPosition (data) {
    this.stopAutoUpdateContainerPosition()
    if (!this.state.containerTimeout) {
      this.updateContainerPosition(data, this.outline)
      this.state.containerTimeout = this.iframeWindow.setInterval(this.updateContainerPosition.bind(this, data, this.outline), 16)
    }
  }

  /**
   * Automatically update append control container position after timeout
   * @param data
   */
  autoUpdateAppendContainerPosition (data) {
    this.stopAutoUpdateAppendContainerPosition()
    if (!this.state.appendContainerTimeout) {
      this.updateAppendContainerPosition(data, this.outline)
      this.state.appendContainerTimeout = this.iframeWindow.setInterval(this.updateAppendContainerPosition.bind(this, data, this.outline), 16)
    }
  }

  /**
   * Stop automatically update controls container position and clear timeout
   */
  stopAutoUpdateContainerPosition () {
    if (this.state.containerTimeout) {
      this.iframeWindow.clearInterval(this.state.containerTimeout)
      this.state.containerTimeout = null
    }
  }

  /**
   * Stop automatically update append control container position and clear timeout
   */
  stopAutoUpdateAppendContainerPosition () {
    if (this.state.appendContainerTimeout) {
      this.iframeWindow.clearInterval(this.state.appendContainerTimeout)
      this.state.appendContainerTimeout = null
    }
  }

  /**
   * Update controls position
   * @param element
   */
  updateControlsPosition (element) {
    let elementRect = element.getBoundingClientRect()
    let controlsList = this.controlsContainer.querySelector('.vcv-ui-outline-controls')
    let controlsListPos = controlsList.getBoundingClientRect()
    let iframeRect = this.iframe.getBoundingClientRect()
    if (elementRect.left + controlsListPos.width > iframeRect.width) {
      this.controlsContainer.classList.add('vcv-ui-controls-o-controls-right')
    } else {
      this.controlsContainer.classList.remove('vcv-ui-controls-o-controls-right')
    }
  }

  /**
   * Update dropdowns position
   * @param e
   */
  updateDropdownsPosition (e) {
    let dropdowns = this.controlsContainer.querySelectorAll('.vcv-ui-outline-control-dropdown')
    dropdowns = [].slice.call(dropdowns)
    let iframeRect = this.iframe.getBoundingClientRect()
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('vcv-ui-outline-control-dropdown-o-drop-up')
      dropdown.classList.remove('vcv-ui-outline-control-dropdown-o-drop-right')
      let dropdownPos = dropdown.querySelector('.vcv-ui-outline-control-dropdown-content').getBoundingClientRect()
      // drop up
      if (dropdownPos.top + dropdownPos.height > iframeRect.top + iframeRect.height) {
        dropdown.classList.add('vcv-ui-outline-control-dropdown-o-drop-up')
      }
      // drop right
      if (dropdownPos.left + dropdownPos.width > iframeRect.left + iframeRect.width) {
        dropdown.classList.add('vcv-ui-outline-control-dropdown-o-drop-right')
      }
    })
  }

  /**
   * Update iframe variables
   */
  updateIframeVariables (DOMNodes) {
    this.iframe = DOMNodes.iframe
    this.iframeWindow = DOMNodes.iframeWindow
    this.iframeDocument = DOMNodes.iframeDocument
  }
}
