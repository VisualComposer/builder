import './backgroundZoom.css';

window.vcv.on('ready', function (action, id) {
  if (action !== 'merge') {
    let selector = id ? '[data-vcv-element="' + id + '"] [data-vce-assets-zoom]' : '[data-vce-assets-zoom]'
    if (selector) {
      let elements = document.querySelectorAll(selector)
      elements = [].slice.call(elements)
      elements.forEach((element) => {
        let scale = element.dataset.vceAssetsZoomScale
        let duration = element.dataset.vceAssetsZoomDuration
        let styleString = `transform: scale(${scale}); transition: transform ${duration}s linear;`
        let previousElementWaypoints = element.vcvWaypoints
        if (previousElementWaypoints) {
          previousElementWaypoints.destroy()
          element.setAttribute('style', '')
        }
        let waypointObj = new window.Waypoint({
          element: element,
          handler: (a, b, c, d, e) => {
            element.setAttribute('style', styleString)
            waypointObj.destroy()
          },
          offset: '85%'
        })
        element.vcvWaypoints = waypointObj
      })
    }
  }
})