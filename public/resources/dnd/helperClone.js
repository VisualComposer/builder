export default class Helper {
  constructor (DOMNode, mousePoint = false) {
    Object.defineProperty(this, 'clone', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: DOMNode.cloneNode(true)
    })
    Object.defineProperty(this, 'maxCloneHeight', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: 350
    })
    if (typeof mousePoint === 'object' && mousePoint.x !== undefined && mousePoint.y !== undefined) {
      Object.defineProperty(this, 'mousePoint', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: mousePoint
      })
    }
    if (DOMNode.getBoundingClientRect().height >= this.maxCloneHeight) {
      Object.defineProperty(this, 'cutSize', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: true
      })
    }
    this.hide()
    this.setInitStyle(DOMNode)
    DOMNode.parentNode.insertBefore(this.clone, DOMNode)
  }
  setInitStyle (domNode) {
    let rect = domNode.getBoundingClientRect()
    this.clone.style.position = 'fixed'
    this.clone.style.opacity = '0.3'
    this.clone.style.pointerEvents = 'none'
    let {height, width} = rect
    this.clone.style.width = width + 'px'
    this.clone.style.overflowY = 'hidden'
    if (this.cutSize) {
      this.clone.style.maxHeight = this.maxCloneHeight + 'px'
      height = this.maxCloneHeight
    } else {
      this.clone.style.height = height + 'px'
    }
    this.clone.style.transition = 'none'
    this.clone.displayStyle = 'block'
    let marginTop, marginLeft
    if (this.mousePoint) {
      marginTop = rect.top - this.mousePoint.y
      if (Math.abs(marginTop) > height) {
        marginTop = -height / 2
      }
      marginLeft = rect.left - this.mousePoint.x
    } else {
      marginTop = -height / 2
      marginLeft = -width / 2
    }
    this.clone.style.marginTop = marginTop + 'px'
    this.clone.style.marginLeft = marginLeft + 'px'
    if (this.clone.classList.contains('vce-row') || this.clone.classList.contains('vce-col')) {
      this.clone.style.border = '1px dashed rgba(183, 183, 183, 1)'
      this.clone.displayStyle = 'flex'
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
    this.clone.style.display = this.clone.displayStyle
  }
  remove () {
    let clone = this.clone
    this.clone = null
    clone.parentNode.removeChild(clone)
  }
}
