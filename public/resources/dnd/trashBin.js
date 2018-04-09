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

    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.transitionEnd = this.transitionEnd.bind(this)
  }

  create () {
    this.cancelRemove = true
    const oldTrashBin = this.options.container.querySelector('#vcv-dnd-trash-bin')
    if (oldTrashBin) {
      this.options.container.removeChild(oldTrashBin)
    }
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
    this.elContainer.addEventListener('mouseenter', this.onMouseEnter)
    let iframe = document.getElementById('vcv-editor-iframe') || null
    let iframeParent = iframe && iframe.parentNode ? iframe.parentNode : null
    let rect = iframeParent && iframeParent.getBoundingClientRect()
    this.offsetX = rect && rect.left ? rect.left : 0
    this.offsetY = rect && rect.top ? rect.top : 0
  }

  onMouseEnter (e) {
    this.options.handleDrag && this.options.handleDrag(e, this.offsetX, this.offsetY)
    this.elContainer && this.elContainer.addEventListener('mousemove', this.onMouseMove)
    this.elContainer && this.elContainer.addEventListener('mouseleave', this.onMouseLeave)
    this.elContainer && this.elContainer.addEventListener('mouseup', this.options.handleDragEnd)
  }

  onMouseMove (e) {
    this.options.handleDrag && this.options.handleDrag(e, this.offsetX, this.offsetY)
  }

  onMouseLeave () {
    this.elContainer && this.elContainer.removeEventListener('mousemove', this.onMouseMove)
    this.elContainer && this.elContainer.removeEventListener('mouseleave', this.onMouseLeave)
    this.elContainer && this.elContainer.removeEventListener('mouseup', this.options.handleDragEnd)
  }

  setActive () {
    this.elContainer && this.elContainer.classList && this.elContainer.classList.add('vcv-ui-trash-bin-active')
    this.isActive = true
  }

  removeActive () {
    this.elContainer && this.elContainer.classList && this.elContainer.classList.remove('vcv-ui-trash-bin-active')
    this.isActive = false
  }

  setPoint = function (x, y) {
    this.point.x = x
    this.point.y = y
    this.setStyle(x, y)
  }

  transitionEnd () {
    this.elContainer && this.elContainer.removeEventListener('transitionend', this.transitionEnd)
    if (!this.cancelRemove) {
      this.options.container && this.options.container.removeChild(this.elContainer)
    }
  }

  remove () {
    if (this.isActive) {
      this.removeActive()
    }
    this.cancelRemove = false
    this.elContainer && this.elContainer.addEventListener('transitionend', this.transitionEnd)
    this.elContainer && this.elContainer.classList && this.elContainer.classList.remove('vcv-dnd-trash-bin-show')
    this.elContainer && this.elContainer.removeEventListener('mouseenter', this.onMouseEnter)
  }

  setStyle (x, y) {
    this.elContainer && this.elContainer.setAttribute('style', `bottom: ${y}px; right: ${x}px;`)
  }
}
