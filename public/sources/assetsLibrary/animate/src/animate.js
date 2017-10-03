window.vcv.on('ready', (action, id, options) => {
  // window.Waypoint.destroyAll()
  let enableAnimate = (id) => {
    let selector = id ? '[data-vcv-element="' + id + '"]' : '[data-vce-animate]'
    let elements = document.querySelectorAll(selector)
    elements = [].slice.call(elements)
    elements.forEach((element) => {
      if (id && !element.getAttribute('data-vce-animate')) {
        element = element.querySelector('[data-vce-animate]')
        if (!element) {
          return
        }
      }
      let previousElementWaypoints = element.vcvWaypoints
      if (previousElementWaypoints) {
        previousElementWaypoints.destroy()
        element.removeAttribute('data-vcv-o-animated')
      }
      let waypointObj = new window.Waypoint({
        element: element,
        handler: (a, b, c, d, e) => {
          element.setAttribute('data-vcv-o-animated', 'true')
          waypointObj.destroy()
        },
        offset: '85%'
      })
      element.vcvWaypoints = waypointObj
    })
  }

  if (action === 'add' || action === undefined || (action === 'update' && options && options.changedAttribute === 'animation')) {
    enableAnimate(action && id ? id : '')
  }
})
