import './animate.css';

window.vcv.on('ready', function (action, id, options) {
  let enableAnimate = function (id, action, innerKey) {
    const selector = id ? '[data-vcv-element="' + id + '"]' : '[data-vce-animate]'
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
            let innerElements = element.querySelectorAll('[data-vcv-animate-fieldkey], [data-vce-animate]')
            innerElements = [].slice.call(innerElements)
            innerElements.forEach(function (innerElement) {
              animateElement(innerElement)
            })
          }
        } else {
          const innerSelector = '[data-vce-animate][data-vcv-animate-fieldkey="' + innerKey + '"]'
          const innerElement = element.querySelector(innerSelector)
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
    const previousElementWaypoints = element.vcvWaypoints
    if (previousElementWaypoints) {
      previousElementWaypoints.destroy()
      element.removeAttribute('data-vcv-o-animated')
    }
    const waypointObj = new window.Waypoint({
      element: element,
      handler: function (a, b, c, d, e) {
        element.setAttribute('data-vcv-o-animated', 'true')
        waypointObj.destroy()

        const duration = parseFloat(window.getComputedStyle(element)[ 'animationDuration' ]) * 1000
        const delay = parseFloat(window.getComputedStyle(element)[ 'animationDelay' ]) * 1000
        window.setTimeout(() => {
          element.setAttribute('data-vcv-o-animated-fully', 'true')
        }, delay + duration + 5)
      },
      offset: '90%'
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
