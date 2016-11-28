import {getService} from 'vc-cake'
const documentManager = getService('document')
const cook = getService('cook')
const categoriesService = getService('categories')

class ControlsHandler {
  constructor (sliceSize) {
    Object.defineProperties(this, {
      sliceSize: {
        enumerable: false,
        configurable: false,
        writable: false,
        value: sliceSize
      }
    })
    this.iframeContainer = document.querySelector('.vcv-layout-iframe-container')
    this.iframeOverlay = document.querySelector('#vcv-editor-iframe-overlay')
    this.iframe = document.querySelector('#vcv-editor-iframe')
    this.iframeWindow = this.iframe && this.iframe.contentWindow
    this.iframeDocument = this.iframeWindow && this.iframeWindow.document

    this.controlsContainer = null

    this.state = {
      containerTimeout: null
    }
    this.updateDropdownsPosition = this.updateDropdownsPosition.bind(this)

    this.setup()
  }

  setup () {
    this.controlsContainer = document.createElement('div')
    this.controlsContainer.classList.add('vcv-ui-outline-controls-container', 'wip')
    this.iframeOverlay.appendChild(this.controlsContainer)
    this.controlsContainer.addEventListener('mouseenter', this.updateDropdownsPosition)
  }

  /**
   * Get controls container
   * @returns {null|*}
   */
  getControlsContainer () {
    return this.controlsContainer
  }

  /**
   * Show outline
   * @param data
   */
  show (data) {
    this.createControls(data)
    this.autoUpdateContainerPosition(data.element)
  }

  /**
   * Hide outline
   */
  hide () {
    this.destroyControls()
    this.stopAutoUpdateContainerPosition()
  }

  createControls (data) {
    if (this.sliceSize) {
      let slicedElements = data.vcElementsPath.slice(0, this.sliceSize)
      slicedElements.reverse()
      let treeTrigger = data.vcElementsPath[ this.sliceSize ]
      // create controls
      let controlsList = document.createElement('nav')
      controlsList.classList.add('vcv-ui-outline-controls')
      this.controlsContainer.appendChild(controlsList)

      // create tree trigger
      if (treeTrigger) {
        controlsList.appendChild(this.createControlForTrigger(
          treeTrigger,
          {
            title: 'Tree View',
            event: 'bar-content-start:show'
          }
        ))
      }

      // create element controls
      slicedElements.forEach((elementId) => {
        controlsList.appendChild(this.createControlForElement(elementId))
      })

      // change controls direction
      this.updateControlsPosition(data.element)
    }
  }

  createControlForTrigger (element, options) {
    // create trigger
    let trigger = document.createElement('a')
    trigger.classList.add('vcv-ui-outline-control', 'vcv-ui-outline-control-more')
    trigger.dataset.vcvElememtId = element
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
        icon: categoriesService.getElementIcon(vcElement.get('tag'))
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

  getVcElement (elementId) {
    return cook.get(documentManager.get(elementId))
  }

  getElementColorIndex (vcElement) {
    var colorIndex = 2
    if (vcElement && vcElement.containerFor().length > 0) {
      colorIndex = vcElement.containerFor().indexOf('Column') > -1 ? 0 : 1
    }
    return colorIndex
  }

  destroyControls () {
    while (this.controlsContainer && this.controlsContainer.firstChild) {
      this.controlsContainer.removeChild(this.controlsContainer.firstChild)
    }
  }

  /**
   * Update controls container position
   * @param element
   */
  updateContainerPosition (element) {
    let elementPos = element.getBoundingClientRect()
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

    this.controlsContainer.style.top = posTop + 'px'
    this.controlsContainer.style.left = elementPos.left + 'px'
    this.controlsContainer.style.width = elementPos.width + 'px'
  }

  /**
   * Automatically update controls container position after timeout
   * @param element
   */
  autoUpdateContainerPosition (element) {
    this.stopAutoUpdateContainerPosition()
    if (!this.state.containerTimeout) {
      this.updateContainerPosition(element, this.outline)
      this.state.containerTimeout = this.iframeWindow.setInterval(this.updateContainerPosition.bind(this, element, this.outline), 16)
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

  updateDropdownsPosition (e) {
    let dropdowns = this.controlsContainer.querySelectorAll('.vcv-ui-outline-control-dropdown')
    let iframePos = this.iframe.getBoundingClientRect()
    dropdowns.forEach((dropdown) => {
      let dropdownPos = dropdown.querySelector('.vcv-ui-outline-control-dropdown-content').getBoundingClientRect()
      // drop up
      dropdown.classList.remove('vcv-ui-outline-control-dropdown-o-drop-up')
      if (dropdownPos.top + dropdownPos.height > iframePos.top + iframePos.height) {
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

export default ControlsHandler
