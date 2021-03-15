import ee from 'event-emitter'

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
  }
}
