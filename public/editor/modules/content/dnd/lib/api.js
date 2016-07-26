export default class API {
  constructor (dnd, api) {
    this.api = api
    this.dnd = dnd
    this.init()
  }
  init () {
    this.api.addAction('startDragging', this.start.bind(this))
  }
  start (DOMNode, point) {
    this.dnd.start(DOMNode)
    point && this.dnd.check(point)
  }
}
