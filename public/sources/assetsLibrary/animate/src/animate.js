window.vcv.on('ready', (action, id) => {
  let enableAnimate = (id) => {
    window.Waypoint.destroyAll()
    let waypoints = []
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
      // remove old classes
      let oldClasses = []
      let re = /^vce-o-animate--/
      element.classList.forEach((className) => {
        if (className.search(re) !== -1) {
          oldClasses.push(className)
        }
      })
      element.classList.remove.apply(element.classList, oldClasses)

      let waypointObj = new window.Waypoint({
        element: element,
        handler: () => {
          // add new classes
          let newClasses = []
          if (element.dataset[ 'vceAnimate' ]) {
            newClasses = element.dataset[ 'vceAnimate' ].split(' ')
          }
          // _this.element.setAttribute('data-vce-animated', 'true')
          newClasses.push('vce-o-animate--animated')
          newClasses.forEach((className) => {
            element.classList.add(className)
          })
          waypointObj.destroy()
        },
        offset: '85%'
      })
      waypoints.push(waypointObj)
    })
  }

  if (action !== 'merge') {
    enableAnimate(action && id ? id : '')
  }
})
