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
      let waypoint = new Waypoint({
        element: element,
        handler: function () {
          // remove old classes
          let oldClasses = []
          let re = /^vce-o-animate--/
          this.element.classList.forEach((className) => {
            if (className.search(re) !== -1) {
              oldClasses.push(className)
            }
          })
          oldClasses.forEach((className) => {
            this.element.classList.remove(className)
          })
          setTimeout(() => {
            // add new classes
            let newClasses = this.element.dataset[ 'vceAnimate' ].split(' ')
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
