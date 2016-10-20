/* global vcv */
/* global Waypoint */
vcv.ready(() => {
  // vceAnimate.enableAnimate()
})
vcv.on('ready', () => {
  vceAnimate.enableAnimate()
})

let vceAnimate = {
  enableAnimate () {
    Waypoint.destroyAll()
    let waypoints = []
    let elements = document.querySelectorAll('[data-vce-animate]')
    elements.forEach((element) => {
      // remove old classes
      let oldClasses = []
      let re = /^vce-o-animate--/
      element.classList.forEach((className) => {
        if (className.search(re) !== -1) {
          oldClasses.push(className)
        }
      })
      oldClasses.forEach((className) => {
        element.classList.remove(className)
      })
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
