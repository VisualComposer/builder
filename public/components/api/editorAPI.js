import innerAPI from './innerAPI'

export default {
  mount (point, callback) {
    const allowedPoints = ['panelMessages:third-party']
    if (allowedPoints.indexOf(point) < 0) {
      console.warn('Mount point not allowed', point)
      return
    }
    return innerAPI.mount(point, callback)
  },
  applyFilter (name, value, options) {
    return innerAPI.applyFilter(name, value, options)
  },
  addFilter (name, callback) {
    const allowedFilters = ['saveRequestData', 'insightPanelsData']
    if (allowedFilters.indexOf(name) < 0) {
      console.warn('Filter point not allowed', name)
      return
    }
    return innerAPI.addFilter(name, callback)
  },
  dispatch (event, options) {
    return innerAPI.dispatch(event, options)
  },
  subscribe (event, callback, once = false) {
    return innerAPI.subscribe(event, callback, once)
  },
  unsubscribe (event, callback) {
    return innerAPI.unsubscribe(event, callback)
  }
}
