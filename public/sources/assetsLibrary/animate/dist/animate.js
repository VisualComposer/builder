/* global vcv */
/* global Waypoint */
vcv.on('ready', (action, id) => {
  if (action !== 'merge') {
    vceAnimate.enableAnimate(action && id ? id : '')
  }
})

let vceAnimate = {
  enableAnimate (id) {
    Waypoint.destroyAll()
    let waypoints = []
    let selector = id ? `[data-vcv-element="${id}"]` : '[data-vce-animate]'
    let elements = document.querySelectorAll(selector)
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
      element.classList.remove(...oldClasses)
      let waypoint = new Waypoint({
        element: element,
        handler: function () {
          setTimeout(() => {
            // add new classes
            let newClasses = []
            if (this.element.dataset[ 'vceAnimate' ]) {
              newClasses = this.element.dataset[ 'vceAnimate' ].split(' ')
            }
            newClasses.push('vce-o-animate--animated')
            newClasses.forEach((className) => {
              this.element.classList.add(className)
            })
            this.destroy()
          }, 100)
        },
        offset: 'bottom-in-view'
      })
      waypoints.push(waypoint)
    })
  }
}
