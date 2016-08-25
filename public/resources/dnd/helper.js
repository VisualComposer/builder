export default class Helper {
  constructor (DOMNode, mousePoint = false) {
    Object.defineProperty(this, 'clone', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: DOMNode.cloneNode(true)
    })
    if (typeof mousePoint === 'object' && mousePoint.x !== undefined && mousePoint.y !== undefined) {
      Object.defineProperty(this, 'mousePoint', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: mousePoint
      })
    }
    this.hide()
    this.setInitStyle(DOMNode.getBoundingClientRect())
    DOMNode.parentNode.insertBefore(this.clone, DOMNode)
  }
  setInitStyle (rect) {
    this.clone.style.position = 'fixed'
    this.clone.style.opacity = '0.3'
    this.clone.style.pointerEvents = 'none'
    this.clone.style.width = rect.width + 'px'
    this.clone.style.height = rect.height + 'px'
    this.clone.style.transition = 'none'
    if (this.mousePoint) {
      this.clone.style.marginTop = rect.top - this.mousePoint.y + 'px'
      this.clone.style.marginLeft = rect.left - this.mousePoint.x + 'px'
    } else {
      this.clone.style.marginTop = '-' + rect.height / 2 + 'px'
      this.clone.style.marginLeft = '-' + rect.width / 2 + 'px'
    }
    this.clone.setAttribute('data-vcv-dnd-helper', true)
  }
  setPosition (point) {
    this.clone.style.top = point.y + 'px'
    this.clone.style.left = point.x + 'px'
  }
  hide () {
    this.clone.style.display = 'none'
  }
  show () {
    this.clone.style.display = 'block'
  }
  remove () {
    let clone = this.clone
    this.clone = null
    clone.parentNode.removeChild(clone)
  }
}
