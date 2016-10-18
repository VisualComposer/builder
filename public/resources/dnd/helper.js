export default class Helper {
  constructor (DOMNode, mousePoint = false) {
    Object.defineProperty(this, 'displayStyle', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: window.getComputedStyle(DOMNode).display
    })
    Object.defineProperty(this, 'tag', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: DOMNode.tagName
    })
    Object.defineProperty(this, 'maxCloneHeight', {
      enumerable: false,
      configurable: false,
      writable: true,
      value: 300
    })
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
    if (DOMNode.getBoundingClientRect().height >= this.maxCloneHeight) {
      Object.defineProperty(this, 'fade', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: true
      })
    }

    if (this.fade) this.setHelperFade(DOMNode)
    this.setInitStyle(DOMNode.getBoundingClientRect(), DOMNode)
    DOMNode.parentNode.insertBefore(this.clone, DOMNode)
    if (this.fade) this.setFadeCenter(DOMNode.getBoundingClientRect())
    this.hide()
  }

  setHelperFade () {
    let fadeContainer = document.createElement(this.tag)
    let svgHtml = '<svg style="height: 100%; width: 100%;"><defs><mask id="mask" maskunits="userSpaceOnUse" maskcontentunits="userSpaceOnUse"><lineargradient id="linearGradient" gradientunits="objectBoundingBox" x2="0" y2="1"><stop stop-color="white" stop-opacity="1" offset="70%"></stop><stop stop-color="white" stop-opacity="0" offset="100%"></stop></lineargradient><rect width="100%" height="100%" fill="url(#linearGradient)"></rect></mask></defs><foreignobject class="vcv-helper-fade" width="100%" height="100%" style="mask: url(#mask)"><div class="vcv-helper-fade-inner"></div></foreignobject></svg>'

    fadeContainer.innerHTML = svgHtml
    fadeContainer.querySelector('.vcv-helper-fade-inner').appendChild(this.clone)
    this.clone = fadeContainer
  }
  setFadeCenter (rect) {
    if (this.mousePoint && (this.mousePoint.y > rect.top + this.maxCloneHeight)) {
      let cloneRect = this.clone.getBoundingClientRect()
      this.clone.style.marginTop = '-' + cloneRect.height / 2 + 'px'
      this.clone.style.marginLeft = '-' + cloneRect.width / 2 + 'px'
    }
  }
  setInitStyle (rect, DOMNode) {
    this.clone.style.position = 'fixed'
    this.clone.style.opacity = '0.3'
    this.clone.style.pointerEvents = 'none'
    this.clone.style.width = rect.width + 'px'
    this.clone.style.height = (this.fade ? this.maxCloneHeight : rect.height) + 'px'
    this.clone.style.transition = 'none'

    if (this.mousePoint) {
      this.clone.style.marginTop = rect.top - this.mousePoint.y + 'px'
      this.clone.style.marginLeft = rect.left - this.mousePoint.x + 'px'
    } else {
      this.clone.style.marginTop = '-' + rect.height / 2 + 'px'
      this.clone.style.marginLeft = '-' + rect.width / 2 + 'px'
    }

    this.clone.setAttribute('data-vcv-dnd-helper', true)

    if (this.clone.classList.contains('vce-row') || this.clone.classList.contains('vce-col')) {
      this.clone.style.border = '1px dashed rgba(183, 183, 183, 1)'
    }

    // For tree view
    let layoutControl = DOMNode.querySelector('.vcv-ui-tree-layout-control')
    if (layoutControl) {
      this.clone.style.height = layoutControl.clientHeight + 'px'
    }

    // For fade element
    if (this.fade) {
      if ((DOMNode.classList.contains('vce-row') || DOMNode.classList.contains('vce-col'))) {
        this.clone.querySelector('.vcv-helper-fade-inner').style.border = '1px dashed rgba(183, 183, 183, 1)'
      }
      if (DOMNode.classList.contains('vce-col')) {
        this.clone.querySelector('.vcv-helper-fade-inner').style.display = 'flex'
        this.clone.querySelector('.vcv-helper-fade-inner').style.paddingTop = '35px'
      }
      if (DOMNode.classList.contains('vce-row')) {
        this.clone.querySelector('.vcv-helper-fade-inner').style.padding = '0 15px'
      }
    }
  }
  setPosition (point) {
    this.clone.style.top = point.y + 'px'
    this.clone.style.left = point.x + 'px'
  }
  hide () {
    this.clone.style.display = 'none'
  }
  show () {
    this.clone.style.display = this.displayStyle
  }
  remove () {
    let clone = this.clone
    this.clone = null
    clone.parentNode.removeChild(clone)
  }
}
