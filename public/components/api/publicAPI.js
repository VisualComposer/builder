import EventEmitter from 'events'
import lodash from 'lodash'
class MyEmitter extends EventEmitter {}
const apiEventEmitter = new MyEmitter()
apiEventEmitter.setMaxListeners(0)
const emitter = lodash.debounce((event, args) => {
  apiEventEmitter.emit.apply(apiEventEmitter, ['vcv:api:' + event].concat(args))
}, 500)

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
