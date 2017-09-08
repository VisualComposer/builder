import _ from 'lodash'
import DOMElement from './domElement'

export default class MultiDOMElement {
  constructor (id, DOMNodes, options) {
    options = _.defaults(options, {
      containerFor: null,
      childFor: null,
      parent: null,
      handler: null
    })
    const domElements = DOMNodes.forEach((domNode) => {
      return new DOMElement(id, domNode, options)
    })
    Object.defineProperties(this, {
      /**
       * @memberOf! MultiDOMElement
       */
      'domElements': {
        configurable: false,
        enumerable: false,
        value: domElements,
        writable: false
      }
    })
  }

  refresh () {
    this.domElements.forEach((domElement) => {
      domElement.refresh()
    })
    return this
  }

  on (event, callback, capture) {
    this.domElements.forEach((domElement) => {
      domElement.on(event, callback, capture)
    })
    return this
  }

  off (event, callback, capture) {
    this.domElements.forEach((domElement) => {
      domElement.off(event, callback, capture)
    })
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
}
