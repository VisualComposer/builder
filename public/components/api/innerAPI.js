const components = {}
export default {
  pick (point, component, options) {
    const pointSplit = point.split(':')
    let eventSplit = ''
    pointSplit.forEach((event) => {
      eventSplit = eventSplit ? `${eventSplit}:${event}` : event
      if (components[eventSplit]) {
        component = components[eventSplit].call(component, options)
      }
    })
    return component
  },
  mount (point, callback) {
    components[point] = callback
  }
}
