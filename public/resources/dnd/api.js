export default class API {
  constructor (dnd) {
    this.dnd = dnd
  }
  start (data) {
    this.dnd.start(data.id)
    data.point && this.dnd.check(data.point)
  }
}
