import _ from 'lodash'
export default class TrashBin {
  constructor (options) {
    Object.defineProperty(this, 'options', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: _.defaults(options, {
        document: document,
        container: document.body
      })
    })

    this.transitionEnd = this.transitionEnd.bind(this)
  }

  create () {
    this.cancelRemove = true
    this.elContainer = document.createElement('div')
    this.elContainer.classList.add('vcv-ui-trash-bin-container')
    this.el = document.createElement('i')
    this.el.classList.add('vcv-ui-trash-bin-icon', 'vcv-ui-icon', 'vcv-ui-icon-trash')
    this.elContainer.id = 'vcv-dnd-trash-bin'
    this.point = { x: 50, y: 50 }
    this.elContainer.appendChild(this.el)
    this.options.container.appendChild(this.elContainer)
    setTimeout(() => {
      this.elContainer.classList.add('vcv-dnd-trash-bin-show')
    }, 0)
  }

  setActive () {
    this.elContainer.classList.add('vcv-ui-trash-bin-active')
    this.isActive = true
  }

  removeActive () {
    this.elContainer.classList.remove('vcv-ui-trash-bin-active')
    this.isActive = false
  }

  setPoint = function (x, y) {
    this.point.x = x
    this.point.y = y
    this.setStyle(x, y)
  }

  transitionEnd () {
    this.elContainer.removeEventListener('transitionend', this.transitionEnd)
    if (!this.cancelRemove) {
      this.options.container.removeChild(this.elContainer)
    }
  }

  remove () {
    if (this.isActive) {
      this.removeActive()
    }
    this.cancelRemove = false
    this.elContainer.addEventListener('transitionend', this.transitionEnd)
    this.elContainer.classList.remove('vcv-dnd-trash-bin-show')
  }

  setStyle (x, y) {
    this.elContainer.setAttribute('style', `bottom: ${y}px; right: ${x}px;`)
  }
}
