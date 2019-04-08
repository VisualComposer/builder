import ee from 'event-emitter'
import debounce from './debounce'

const MyEventEmitter = function () {}
ee(MyEventEmitter.prototype)
const apiEventEmitter = new MyEventEmitter()

const emitter = debounce((event, args) => {
  apiEventEmitter.emit.apply(apiEventEmitter, [ `vcv:api:${event}` ].concat(args))
}, 10)

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
    emitter(event, args)
  },
  ready (callback) {
    this.once('ready', callback)
  }
}
