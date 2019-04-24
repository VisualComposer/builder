import './animate.css';

window.vcv.on('ready', function (action, id, options) {
  let enableAnimate = function (id, action, innerKey) {
    let selector = id ? '[data-vcv-element="' + id + '"]' : '[data-vce-animate]'
    let elements = document.querySelectorAll(selector)
    elements = [].slice.call(elements)
    elements.forEach(function (element) {
      if (id) {
        if (!innerKey) {
          let containerElement = element

          if (!containerElement.getAttribute('data-vce-animate')) {
            containerElement = element.querySelector('[data-vce-animate]:not([data-vcv-animate-fieldkey])')
          }

          if (containerElement) {
            animateElement(containerElement)
          }

          if (action === 'add') {
            let innerElements = element.querySelectorAll('[data-vcv-animate-fieldkey]')
            innerElements = [].slice.call(innerElements)
            innerElements.forEach(function (innerElement) {
              animateElement(innerElement)
            })
          }
        } else {
          let innerSelector = '[data-vce-animate][data-vcv-animate-fieldkey="' + innerKey + '"]'
          let innerElement = element.querySelector(innerSelector)
          if (innerElement) {
            animateElement(innerElement)
          }
        }
      } else {
        animateElement(element)
      }
    })
  }

  let animateElement = function (element) {
    let previousElementWaypoints = element.vcvWaypoints
    if (previousElementWaypoints) {
      previousElementWaypoints.destroy()
      element.removeAttribute('data-vcv-o-animated')
    }
    let waypointObj = new window.Waypoint({
      element: element,
      handler: function (a, b, c, d, e) {
        element.setAttribute('data-vcv-o-animated', 'true')
        waypointObj.destroy()
        const duration = parseFloat(window.getComputedStyle(element)[ 'animationDuration' ]) * 1000
        window.setTimeout(() => {
          element.parentElement.style.overflowX = 'hidden'
          window.setTimeout(() => {
            element.parentElement.style.overflowX = ''
          }, 0)
        }, duration + 200)
      },
      offset: '85%'
    })
    element.vcvWaypoints = waypointObj
  }

  // TODO refactor if statement, simplify logic
  if (action === 'add' || action === undefined || (action === 'update' && options && (options.changedAttribute === 'animation' || options.changedAttributeType === 'animateDropdown' || !options.hidden))) {
    let innerKey = ''
    if (action && options && options.changedAttributeType === 'animateDropdown' && options.changedAttribute !== 'animation') {
      innerKey = options.changedAttribute
    }
    enableAnimate(action && id ? id : '', action, innerKey)
  }
})
