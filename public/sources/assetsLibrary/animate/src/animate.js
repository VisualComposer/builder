window.vcv.on('ready', (action, id) => {
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
      let $element = window.jQuery(element)
      if ($element.data('vcvWaypoints')) {
        $element.data('vcvWaypoints').destroy()
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
          element.setAttribute('data-vcv-o-animated', 'true')
          // newClasses.push('vce-o-animate--animated')
          newClasses.forEach((className) => {
            element.classList.add(className)
          })
          waypointObj.destroy()
        },
        offset: '85%'
      })
      $element.data('vcvWaypoints', waypointObj)
    })
  }

  if (action !== 'merge') {
    enableAnimate(action && id ? id : '')
  }
})
