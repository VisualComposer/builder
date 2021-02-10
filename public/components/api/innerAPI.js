import ee from 'event-emitter'

const InnerAPIEmitter = function () {}
ee(InnerAPIEmitter.prototype)
const apiEventEmitter = new InnerAPIEmitter()
const filters = {}
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
    return component
  },
  mount (point, callback) {
    components[point] = callback
  },
  despatch (event, ...options) {
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
  },
  apply (name, value, ...options) {
    if (filters[name] && filters[name].length) {
      this.filter[name].each((callback) => {
        value = callback.call(value, ...options)
      })
    }
    return value
  },
  filter (name, callback) {
    if (filters[name]) {
      filters[name] = []
    }
    filters[name].push(callback)
  }
}
