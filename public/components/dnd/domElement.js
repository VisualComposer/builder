import _ from 'lodash'

export default class DOMElement {
  constructor (id, DOMNode, options) {
    options = _.defaults(options, {
      containerFor: null,
      childFor: null,
      parent: null,
      handler: null,
      datasetKey: 'vcvDndDomElement'
    })
    Object.defineProperties(this, {
      /**
       * @memberOf! DOMElement
       */
      node: {
        configurable: false,
        enumerable: false,
        value: DOMNode,
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      $node: {
        configurable: false,
        enumerable: false,
        value: window.jQuery(DOMNode),
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      id: {
        configurable: false,
        enumerable: false,
        value: id,
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      options: {
        configurable: false,
        enumerable: false,
        value: options,
        writable: false
      },
      /**
       * @memberOf! DOMElement
       */
      isEmptyAsContainer: {
        enumerable: false,
        get: function () {
          return this.$node.find('[data-vcv-dnd-element]').length === 0
        }
      }
    })
    this.setAttributes()
  }

  setAttributes () {
    let handler = this.options.handler
    if (typeof handler === 'string') {
      handler = this.$node.find(this.options.handler).get(0)
    }
    if (handler && handler.ELEMENT_NODE) {
      if (this.handler !== undefined) {
        /**
         * @memberOf! DOMElement
         */
        Object.defineProperty(this, 'handler', {
          configurable: true,
          enumerable: false,
          value: handler,
          writable: true
        })
      } else {
        this.handler = handler
      }
    }
    this.node.setAttribute('data-vcv-dnd-element', this.id)
    if (this.handler) {
      this.handler.setAttribute('data-vcv-dnd-element-handler', this.id)
      this.handler.dataset[this.options.datasetKey] = this.node.className
    } else if (!this.options.handler) {
      this.node.setAttribute('data-vcv-dnd-element-handler', this.id)
    }
  }

  refresh () {
    this.setAttributes()
    return this
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

  isNearHorizontalBoundaries (point, gap) {
    const rect = this.node.getBoundingClientRect()
    return  point.x - rect.left < gap || rect.right - point.x < gap
  }

  isNearBoundaries (point, gap) {
    const rect = this.node.getBoundingClientRect()
    return point.y - rect.top < gap || rect.bottom - point.y < gap ||
      point.x - rect.left < gap || rect.right - point.x < gap
  }

  on (event, callback, capture) {
    const handler = this.dragHandler
    handler && handler.addEventListener(event, callback, !!capture)
    return this
  }

  off (event, callback, capture) {
    const handler = this.dragHandler
    handler && handler.removeEventListener(event, callback, !!capture)
    return this
  }

  get dragHandler () {
    return this.options.handler ? this.handler : this.node
  }

  get tag () {
    return this.options.tag
  }
}
