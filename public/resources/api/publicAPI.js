import EventEmitter from 'events'
const apiEventEmitter = new EventEmitter()
apiEventEmitter.setMaxListeners(300)

export default {
  on (event, callback) {
    apiEventEmitter.on('vcv:api:' + event, callback)
  },
  once (event, callback) {
    apiEventEmitter.once('vcv:api:' + event, callback)
  },
  off (event, callback) {
    apiEventEmitter.removeListener('vcv:api:' + event, callback)
  },
  trigger (event) {
    var args = Array.prototype.slice.call(arguments, 1)
    apiEventEmitter.emit.apply(apiEventEmitter, ['vcv:api:' + event].concat(args))
  },
  ready (callback) {
    this.once('ready', callback)
  }
}
