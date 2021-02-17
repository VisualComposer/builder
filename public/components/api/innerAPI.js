import React from 'react'
import { env } from 'vc-cake'
const components = {}
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
  }
}
