export default class API {
  constructor (dnd, api) {
    this.api = api
    this.dnd = dnd
    this.init()
  }
  init () {
    this.api.addAction('startDragging', this.start.bind(this))
  }
  start (id, point) {
    this.dnd.start(id)
    point && this.dnd.check(point)
  }
}
