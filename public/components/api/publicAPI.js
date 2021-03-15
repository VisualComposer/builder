import ee from 'event-emitter'
import innerAPI from './innerAPI'

const MyEventEmitter = function () {}
ee(MyEventEmitter.prototype)
const apiEventEmitter = new MyEventEmitter()

export default {
  on (event, callback) {
    apiEventEmitter.on('vcv:api:' + event, callback)
  },
  once (event, callback) {
    apiEventEmitter.once('vcv:api:' + event, callback)
  },
  off (event, callback) {
    apiEventEmitter.off('vcv:api:' + event, callback)
  },
  trigger (event) {
    const args = Array.prototype.slice.call(arguments, 1)
    apiEventEmitter.emit.apply(apiEventEmitter, [`vcv:api:${event}`].concat(args))
  },
  ready (callback) {
    this.once('ready', callback)
  },
  mount (point, callback) {
    return innerAPI.mount(point, callback)
  },
  applyFilter (name, value, options) {
    return innerAPI.applyFilter(name, value, options)
  },
  addFilter (name, callback) {
    return innerAPI.addFilter(name, callback)
  },
  dispatch (event, options) {
    return innerAPI.dispatch(event, options)
  },
  subscribe (event, callback, once = false) {
    return innerAPI.subscribe(event, callback, once)
  },
  filter (name, callback) {
    return innerAPI.filter(name, callback)
  }
}
