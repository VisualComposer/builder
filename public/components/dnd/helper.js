import _ from 'lodash'
export default class Helper {
  constructor (element, options) {
    Object.defineProperty(this, 'element', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: element
    })
    Object.defineProperty(this, 'options', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: _.defaults(options, {
        container: document.body,
        wrapper: null
      })
    })
    Object.defineProperty(this, 'control', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: this.draw()
    })
    this.hide()
  }

  draw () {
    const oldHelper = this.options.container.querySelector('#vcv-ui-drag-helper-wrapper')
    if (oldHelper) {
      this.options.container.removeChild(oldHelper)
    }

    const helperContainer = document.createElement('div')
    helperContainer.classList.add('vcv-ui-drag-helper-wrapper')
    helperContainer.id = 'vcv-ui-drag-helper-wrapper'

    const control = document.createElement('div')
    control.classList.add('vcv-drag-helper')
    control.classList.add('vcv-drag-helper-' + this.element.tag)
    if (this.element.containerFor() && this.element.containerFor().length) {
      control.classList.add('vcv-drag-helper-container')
    }
    helperContainer.appendChild(control)
    this.options.container.appendChild(helperContainer)
    const icon = this.element.options.iconLink

    if (icon) {
      control.innerHTML = '<img src="' +
        icon + '" class="vcv-ui-dnd-helper-icon" alt="" title=""/>'
    }

    const rect = control.getBoundingClientRect()
    control.style.marginTop = -rect.height / 2 + 'px'
    control.style.marginLeft = -rect.width / 2 + 'px'
    // prevent helper from showing when dropping from addElement panel
    control.style.top = '-100%'
    control.style.left = '-100%'
    return control
  }

  setPosition (point) {
    this.control.style.top = point.top ? `${point.y - point.top}px` : `${point.y}px`
    this.control.style.left = point.left ? `${point.x - point.left}px` : `${point.x}px`
  }

  hide () {
    this.control.style.display = 'none'
  }

  show () {
    window.setTimeout(() => {
      if (this && this.control) {
        this.control.style.display = 'flex'
      }
    }, 50)
  }

  remove () {
    const control = this.control
    this.control = null
    const controlParent = control.parentNode
    if (controlParent.classList.contains('vcv-ui-drag-helper-wrapper')) {
      controlParent.parentNode && controlParent.parentNode.removeChild(controlParent)
    } else {
      controlParent.removeChild(control)
    }
  }
}
