import _ from 'lodash'
import $ from 'jquery'

export default class DOMElement {
  constructor (id, DOMNode, options) {
    options = _.defaults(options, {
      containerFor: null,
      childFor: null,
      parent: null,
      handler: null
    })
    Object.defineProperties(this, {
      /**
       * @memberOf! DOMElement
       */
      'node': {
        configurable: false,
        enumerable: false,
        value: DOMNode,
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      '$node': {
        configurable: false,
        enumerable: false,
        value: $(DOMNode),
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      'id': {
        configurable: false,
        enumerable: false,
        value: id,
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      'options': {
        configurable: false,
        enumerable: false,
        value: options,
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      'isEmptyAsContainer': {
        enumerable: false,
        get: function () {
          this.$node.find('[data-vcv-dnd-element]').length === 0
        }
      }
    })
    let handler = this.options.handler
    if (typeof handler === 'string') {
      handler = this.$node.find(this.options.handler).get(0)
    }
    if (handler && handler.ELEMENT_NODE) {
      /**
       * @memberOf! DOMElement
       */
      Object.defineProperty(this, 'handler', {
        configurable: false,
        enumerable: false,
        value: handler,
        writable: false
      })
    }
    this.node.setAttribute('data-vcv-dnd-element', this.id)
    if(this.handler) {
      this.handler.setAttribute('data-vcv-dnd-element-handler', this.id)
    } else {
      this.node.setAttribute('data-vcv-dnd-element-handler', this.id)
    }
  }
  parent () {
    return this.options.parent
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
    let handler = this.handler || this.node
    handler.addEventListener(event, callback, !!capture)
    return this
  }
  off (event, callback, capture) {
    let handler = this.handler || this.node
    handler.removeEventListener(event, callback, !!capture)
    return this
  }
}
