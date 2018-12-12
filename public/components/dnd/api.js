export default class API {
  /**
   * @param {DndDataSet} dnd
   */
  constructor (dnd) {
    this.dnd = dnd
  }
  start (data) {
    this.dnd.manualScroll = true
    this.dnd.option('drop', false)
    this.dnd.start(null, null, null, this.dnd.container.querySelector(`[data-vcv-dnd-element="${data.id}"]`))
    data.point && this.dnd.check(data.point)
  }
  addNew (data) {
    if (data.endDnd) {
      this.dnd.draggingElement = null
      this.dnd.handleDragEnd()
    } else {
      this.dnd.start(data.id, false, data.tag, data.domNode, true)
      this.dnd.manualScroll = true
      this.dnd.option('drop', true)
      data.point && this.dnd.check(data.point)
    }
  }
}
