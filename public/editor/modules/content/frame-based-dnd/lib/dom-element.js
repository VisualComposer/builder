import {getService} from 'vc-cake'

const cook = getService('cook')
const documentManager = getService('document')

export default class DOMElement {
  constructor (DOMNode, documentDOM) {
    let id = DOMNode ? DOMNode.getAttribute('data-vc-element') : null
    if (id) {
      Object.defineProperties(this, {
        'node': {
          configurable: false,
          enumerable: false,
          value: DOMNode,
          writable: false
        },
        'id': {
          configurable: false,
          enumerable: false,
          value: DOMNode.getAttribute('data-vc-element'),
          writable: false
        },
        'data': {
          configurable: false,
          enumerable: false,
          value: cook.get(documentManager.get(id)),
          writable: false
        },
        'documentDOM': {
          configurable: false,
          enumerable: false,
          value: documentDOM,
          writable: false
        }
      })
    }
  }
  parent () {
    if (!this.isElement()) {
      return new DOMElement()
    }
    let id = this.data.get('parent')
    let DOMNode = this.documentDOM.querySelector('[data-vc-element="' + id + '"]')
    return new DOMElement(DOMNode, this.documentDOM)
  }
  hasParent () {
    return this.isElement() && !!this.data.get('parent')
  }
  isChild (domElement) {
    return this.isElement() && domElement.isElement() && this.data.relatedTo(domElement.data.containerFor())
  }
  isElement () {
    return this.data && this.data.get('id') && this.node
  }
  equals (domElement) {
    return this.isElement() && this.data.get('id') === domElement.data.get('id')
  }
  isNearBoundaries (point, gap) {
    if (!this.isElement()) {
      return false
    }
    let rect = this.node.getBoundingClientRect()
    return point.y - rect.top < gap || rect.bottom - point.y < gap ||
      point.x - rect.left < gap || rect.right - point.x < gap
  }
}
