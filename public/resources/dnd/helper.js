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
        container: document.body
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
    let control = document.createElement('div')
    control.classList.add('vcv-drag-helper')
    control.classList.add('vcv-drag-helper-' + this.element.tag)
    if (this.element.containerFor() && this.element.containerFor().length) {
      control.classList.add('vcv-drag-helper-container')
    }
    this.options.container.appendChild(control)
    let icon = this.element.options.iconLink

    if (icon) {
      control.innerHTML = '<img src="' +
        icon + '" class="vcv-ui-dnd-helper-icon" alt="" title=""/>'
    }

    let rect = control.getBoundingClientRect()
    control.style.marginTop = -rect.height / 2 + 'px'
    control.style.marginLeft = -rect.width / 2 + 'px'
    return control
  }
  setPosition (point) {
    this.control.style.top = point.y + 'px'
    this.control.style.left = point.x + 'px'
  }
  hide () {
    this.control.style.display = 'none'
  }
  show () {
    this.control.style.display = 'flex'
  }
  remove () {
    let control = this.control
    this.control = null
    control.parentNode.removeChild(control)
  }
}
