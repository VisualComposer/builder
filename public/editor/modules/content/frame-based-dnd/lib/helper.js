export default class Helper {
  constructor (DOMNode) {
    this.clone = DOMNode.cloneNode(true)
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
    this.clone.style.marginTop = '-' + rect.height / 2 + 'px'
    this.clone.style.marginLeft = '-' + rect.width / 2 + 'px'
  }
  setPosition (point) {
    this.clone.style.top = point.y + 'px'
    this.clone.style.left = point.x + 'px'
  }
  remove () {
    let clone = this.clone
    this.clone = null
    clone.parentNode.removeChild(clone)
  }
}
