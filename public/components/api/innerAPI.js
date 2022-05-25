import React from 'react'
import { env } from 'vc-cake'
import ee from 'event-emitter'

const InnerAPIEmitter = function () {
  // do nothing
}
ee(InnerAPIEmitter.prototype)
const apiEventEmitter = new InnerAPIEmitter()

const components = {}
const filters = {}
export default {
  pick (point, component, options) {
    const pointSplit = point.split(':')
    let eventSplit = ''
    pointSplit.forEach((event) => {
      eventSplit = eventSplit ? `${eventSplit}:${event}` : event
      if (components[eventSplit]) {
        component = components[eventSplit].call(component, options)
      }
    })
    if (React.isValidElement(component)) {
      return component
    } else {
      env('debug') && console.warn('Not a react element', point)
    }
    return null
  },
  mount (point, callback) {
    if (typeof callback === 'function') {
      components[point] = callback
    } else {
      env('debug') && console.warn('Not a correct callback', point)
    }
  },
  applyFilter (name, value, options) {
    if (filters[name] && filters[name].length) {
      filters[name].forEach((callback) => {
        const newValue = callback.call(this, Object.assign({}, value), options)
        if ((Array.isArray(value) && !Array.isArray(newValue)) || (Array.isArray(newValue) && !Array.isArray(value)) || (typeof value !== typeof newValue)) {
          env('debug') && console.warn(`Returned value must be ${typeof value}`, newValue)
        } else {
          value = newValue
        }
      })
    }
    return value
  },
  addFilter (name, callback) {
    if (!filters[name]) {
      filters[name] = []
    }
    filters[name].push(callback)
  },
  dispatch (event, options) {
    apiEventEmitter.emit.apply(apiEventEmitter, [`vcv:inner:api:${event}`].concat(options))
  },
  subscribe (event, callback, once = false) {
    if (once) {
      apiEventEmitter.once(`vcv:inner:api:${event}`, callback)
    } else {
      apiEventEmitter.on(`vcv:inner:api:${event}`, callback)
    }
  },
  unsubscribe (event, callback) {
    apiEventEmitter.off('vcv:inner:api:' + event, callback)
  }
}
