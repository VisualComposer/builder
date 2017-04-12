import { getService } from 'vc-cake'
const documentManager = getService('document')
const cook = getService('cook')
// const categoriesService = getService('categories')
const hubCategoriesService = getService('hubCategories')

export default class ControlsHandler {
  constructor (props) {
    this.iframeContainer = props.iframeContainer
    this.iframeOverlay = props.iframeOverlay
    this.iframe = props.iframe
    this.iframeWindow = props.iframeWindow
    this.iframeDocument = props.iframeDocument

    this.controlsContainer = null
    this.appendControlContainer = null

    this.state = {
      containerTimeout: null,
      appendContainerTimeout: null
    }
    this.updateDropdownsPosition = this.updateDropdownsPosition.bind(this)

    this.setup()
  }

  setup () {
    this.controlsContainer = document.createElement('div')
    this.controlsContainer.classList.add('vcv-ui-outline-controls-container', 'wip')
    this.iframeOverlay.appendChild(this.controlsContainer)
    this.controlsContainer.addEventListener('mouseenter', this.updateDropdownsPosition)
    this.appendControlContainer = document.createElement('div')
    this.appendControlContainer.classList.add('vcv-ui-append-control-container')
    this.iframeOverlay.appendChild(this.appendControlContainer)
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
    this.createControls(data)
    this.autoUpdateContainerPosition(data)
    this.createAppendControl(data)
    this.autoUpdateAppendContainerPosition(data.element)
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
    let elements = data.vcElementsPath
    let layoutPos = this.iframe.getBoundingClientRect()

    // create controls container
    let controlsList = document.createElement('nav')
    controlsList.classList.add('vcv-ui-outline-controls')
    this.controlsContainer.appendChild(controlsList)

    // create element controls
    for (let i = 0; i < elements.length; i++) {
      let element = elements[i]
      let delimiter = document.createElement('i')
      delimiter.classList.add('vcv-ui-outline-control-separator', 'vcv-ui-icon', 'vcv-ui-icon-arrow-right')
      if (i === 0) {
        controlsList.appendChild(this.createControlForElement(element))
        if (i !== elements.length - 1) {
          controlsList.insertBefore(delimiter, controlsList.children[0])
        }
      } else {
        const controlsPos = controlsList.getBoundingClientRect()
        const controlWidth = (controlsPos.width - 2) / (controlsList.children.length / 2)
        const isWider = layoutPos.width - controlsPos.width < controlWidth * 2
        const isToTheLeft = layoutPos.left > controlsPos.left - controlWidth * 2
        if (isWider || (rebuild && isToTheLeft)) {
          controlsList.insertBefore(this.createControlForTrigger(element,
            {
              title: 'Tree View',
              event: 'bar-content-start:show'
            }), controlsList.children[0])
          break
        }
        controlsList.insertBefore(this.createControlForElement(element), controlsList.children[0])
        if (i !== elements.length - 1) {
          controlsList.insertBefore(delimiter, controlsList.children[0])
        }
      }
    }
  }

  /**
   * Create append element control
   * @param data
   */
  createAppendControl (data) {
    let elements = data.vcElementsPath
    const insertAfterElement = elements && elements.length ? elements[ 0 ] : false
    const container = elements && elements.length > 2 ? elements[ 1 ] : false
    if (!container || !insertAfterElement) {
      return false
    }
    const containerElement = cook.get(documentManager.get(container))
    if (!containerElement || !containerElement.relatedTo([ 'Column' ])) {
      return false
    }
    let appendControl = document.createElement('span')
    appendControl.classList.add('vcv-ui-append-control')
    appendControl.title = 'Add Element'
    appendControl.dataset.vcvElementId = containerElement.get('id')
    appendControl.dataset.vcControlEvent = 'app:add'
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
    let trigger = document.createElement('a')
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

    let control = document.createElement('div')
    control.classList.add('vcv-ui-outline-control-dropdown', `vcv-ui-outline-control-type-index-${colorIndex}`)
    control.dataset.vcvElementControls = elementId
    // create control trigger
    control.appendChild(this.createControlTrigger(
      elementId,
      {
        title: vcElement.get('name'),
        icon: hubCategoriesService.getElementIcon(vcElement.get('tag'))
      }
    ))
    // create control dropdown
    control.appendChild(this.createControlDropdown(
      elementId,
      {
        isContainer: colorIndex < 2,
        title: vcElement.get('name'),
        tag: vcElement.get('tag')
      }
    ))

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
    let dropdown = document.createElement('div')
    dropdown.classList.add('vcv-ui-outline-control-dropdown-content')

    // prepare actions
    let actions = []

    // add move action
    actions.push({
      label: `Move ${options.title}`,
      icon: 'vcv-ui-icon-move',
      data: {
        vcDragHelper: elementId
      }
    })

    // add element action
    if (options.isContainer) {
      let label = 'Add Element'
      let addElementTag = ''
      let children = cook.getChildren(options.tag)
      if (children.length === 1) {
        label = `Add ${children[ 0 ].name}`
        addElementTag = children[ 0 ].tag
      }
      actions.push({
        label: label,
        icon: 'vcv-ui-icon-add-thin',
        data: {
          vcControlEvent: 'app:add',
          vcControlEventOptions: addElementTag
        }
      })
    }

    // add controls for row
    if (options.tag === 'row') {
      actions.push({
        label: 'Row Layout',
        icon: 'vcv-ui-icon-row-layout',
        data: {
          vcControlEvent: 'app:edit',
          vcControlEventOptions: 'layout'
        }
      })
    }

    // edit control
    actions.push({
      label: 'Edit',
      icon: 'vcv-ui-icon-edit',
      data: {
        vcControlEvent: 'app:edit'
      }
    })

    // clone control
    actions.push({
      label: 'Clone',
      icon: 'vcv-ui-icon-copy',
      data: {
        vcControlEvent: 'data:clone'
      }
    })

    // remove control
    actions.push({
      label: 'Remove',
      icon: 'vcv-ui-icon-trash',
      data: {
        vcControlEvent: 'data:remove'
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
    let action = document.createElement('a')
    action.classList.add('vcv-ui-outline-control')
    action.dataset.vcvElementId = elementId

    if (options.data) {
      for (let key in options.data) {
        action.dataset[ key ] = options.data[ key ]
      }
    }

    let actionContent = document.createElement('span')
    actionContent.classList.add('vcv-ui-outline-control-content')
    action.appendChild(actionContent)

    let icon = document.createElement('i')
    icon.classList.add('vcv-ui-outline-control-icon', 'vcv-ui-icon', options.icon)
    actionContent.appendChild(icon)

    let label = document.createElement('span')
    label.classList.add('vcv-ui-outline-control-label')
    label.appendChild(document.createTextNode(options.label))
    actionContent.appendChild(label)

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
    var colorIndex = 2
    if (vcElement && vcElement.containerFor().length > 0) {
      colorIndex = vcElement.containerFor().indexOf('Column') > -1 ? 0 : 1
    }
    return colorIndex
  }

  /**
   * Destroy controls
   */
  destroyControls () {
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
    let elementPos = data.element.getBoundingClientRect()
    let controls = this.controlsContainer.firstElementChild
    let controlsHeight = 0
    if (controls) {
      controlsHeight = controls.getBoundingClientRect().height
    }
    // set sticky controls
    let posTop = elementPos.top
    if (posTop - controlsHeight < 0) {
      this.controlsContainer.classList.add('vcv-ui-controls-o-inset')
      posTop = controlsHeight
    } else {
      this.controlsContainer.classList.remove('vcv-ui-controls-o-inset')
    }
    let posLeft = elementPos.left
    if (this.iframe.tagName.toLowerCase() !== 'iframe') {
      let iframePos = this.iframe.getBoundingClientRect()
      posTop -= iframePos.top
      posLeft -= iframePos.left
    }
    if (posLeft < 0) {
      posLeft = 0
    }
    this.controlsContainer.style.top = posTop + 'px'
    this.controlsContainer.style.left = posLeft + 'px'
    this.controlsContainer.style.width = elementPos.width + 'px'
    const layoutPos = this.iframe.getBoundingClientRect()
    const controlsPos = controls.getBoundingClientRect()
    if (!this.state.containerTimeout && layoutPos.left > controlsPos.left) {
      this.destroyControls()
      this.buildControls(data, true)
    }
  }

  /**
   * Update append control container position
   * @param element
   */
  updateAppendContainerPosition (element) {
    let elementPos = element.getBoundingClientRect()
    let control = this.appendControlContainer.firstElementChild
    let controlPos = 0
    if (control) {
      controlPos = control.getBoundingClientRect()
    }

    let posTop = elementPos.bottom - controlPos.height / 2
    let posLeft = elementPos.left
    if (this.iframe.tagName.toLowerCase() !== 'iframe') {
      let iframePos = this.iframe.getBoundingClientRect()
      posTop -= iframePos.top
      posLeft -= iframePos.left
    }
    this.appendControlContainer.style.top = posTop + 'px'
    this.appendControlContainer.style.left = posLeft + 'px'
    this.appendControlContainer.style.width = elementPos.width + 'px'
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
   * @param element
   */
  autoUpdateAppendContainerPosition (element) {
    this.stopAutoUpdateAppendContainerPosition()
    if (!this.state.appendContainerTimeout) {
      this.updateAppendContainerPosition(element, this.outline)
      this.state.appendContainerTimeout = this.iframeWindow.setInterval(this.updateAppendContainerPosition.bind(this, element, this.outline), 16)
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
    let elementPos = element.getBoundingClientRect()
    let controlsList = this.controlsContainer.querySelector('.vcv-ui-outline-controls')
    let controlsListPos = controlsList.getBoundingClientRect()
    let iframePos = this.iframe.getBoundingClientRect()
    if (elementPos.left + controlsListPos.width > iframePos.width) {
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
    let iframePos = this.iframe.getBoundingClientRect()
    dropdowns.forEach((dropdown) => {
      let dropdownPos = dropdown.querySelector('.vcv-ui-outline-control-dropdown-content').getBoundingClientRect()
      // drop up
      dropdown.classList.remove('vcv-ui-outline-control-dropdown-o-drop-up')
      if (dropdownPos.top + dropdownPos.height > window.innerHeight) {
        dropdown.classList.add('vcv-ui-outline-control-dropdown-o-drop-up')
      }
      // drop right
      dropdown.classList.remove('vcv-ui-outline-control-dropdown-o-drop-right')
      if (dropdownPos.left + dropdownPos.width > iframePos.left + iframePos.width) {
        dropdown.classList.add('vcv-ui-outline-control-dropdown-o-drop-right')
      }
    })
  }
}
