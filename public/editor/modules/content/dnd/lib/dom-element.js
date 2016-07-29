import _ from 'lodash'
import $ from 'jquery'

export default class DOMElement {
  constructor (id, DOMNode, options) {
    options = _.defaults(options, {
      containerFor: null,
      childFor: null,
      parent: null
    })
    Object.defineProperties(this, {
      'node': {
        configurable: false,
        enumerable: false,
        value: DOMNode,
        writable: false
      },
      '$node': {
        configurable: false,
        enumerable: false,
        value: $(DOMNode),
        writable: false
      },
      'id': {
        configurable: false,
        enumerable: false,
        value: id,
        writable: false
      },
      'options': {
        configurable: false,
        enumerable: false,
        value: options,
        writable: false
      }
    })
    this.node.setAttribute('data-vcv-dnd-element', this.id)
  }
  parent () {
    return this.options.parent
  }
  hasParent () {
    return !!this.options.parent
  }
  isChild (domElement) {
    return this.relatedTo(domElement.containerFor())
  }
  relatedTo (container) {
    if (!this.options.relatedTo || !container) {
      return false
    }
    let result = false
    if (Array.isArray(this.options.relatedTo)) {
      this.options.relatedTo.find((v) => {
        result = Array.isArray(container) ? container.indexOf(v) > -1 : container === v
        return result
      })
    } else if (container === this.options.relatedTo) {
      result = true
    }
    return result
  }

  containerFor () {
    return this.options.containerFor
  }
  equals (domElement) {
    return this.id === domElement.id
  }
  isNearBoundaries (point, gap) {
    let rect = this.node.getBoundingClientRect()
    return point.y - rect.top < gap || rect.bottom - point.y < gap ||
      point.x - rect.left < gap || rect.right - point.x < gap
  }
  on (event, callback, capture) {
    this.node.addEventListener(event, callback, !!capture)
    return this
  }
  off (event, callback, capture) {
    this.node.removeEventListener(event, callback, !!capture)
    return this
  }
}
