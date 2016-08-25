export default class API {
  constructor (dnd) {
    this.dnd = dnd
  }
  start (id, point) {
    this.dnd.start(id)
    point && this.dnd.check(point)
  }
}
