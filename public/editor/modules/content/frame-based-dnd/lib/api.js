export default class API {
  constructor (dnd, api) {
    this.api = api
    this.dnd = dnd
    this.init()
  }
  init () {
    this.api.addAction('startDraging', this.start.bind(this))
  }
  start (DOMNode) {
    console.log('start dragging')
    this.dnd.start(DOMNode)
  }
}
