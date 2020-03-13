(function () {
  if (typeof window.vceResetFullWidthElements !== 'undefined') {
    return
  }

  let throttled = false
  let isScaling = false // is scaling happening (zoom-in/zoom-out)
  let scale = 1 // initial scale value
  let fullWidthElements = undefined
  const throttleDelay = 50
  const headerZone = '[data-vcv-layout-zone="header"]'
  const footerZone = '[data-vcv-layout-zone="footer"]'
  const headerFooterEditor = '.vcv-editor-theme-hf'
  const customContainerSelector = '.vce-full-width-custom-container'

  function getFullWidthElements() {
    fullWidthElements = Array.prototype.slice.call(document.querySelectorAll('[data-vce-full-width="true"]:not([data-vcv-do-helper-clone]),[data-vce-full-width-section="true"]:not([data-vcv-do-helper-clone])'))
    if (fullWidthElements.length) {
      handleResize()
    }
  }

  function handleResize() {
    if (!fullWidthElements.length) {
      return
    }
    // resize should happen only on initial scale (1)
    if (typeof scale === 'number' && scale !== 1) {
      return
    }
    fullWidthElements.forEach(function (element) {
      const mainBody = document.body
      const elementParent = element.parentElement
      const elementContent = element.querySelector('[data-vce-element-content="true"]')

      const elMarginLeft = parseInt(window.getComputedStyle(element, null)['margin-left'], 10)
      const elMarginRight = parseInt(window.getComputedStyle(element, null)['margin-right'], 10)
      let offset, width

      if (element.closest(headerZone) || element.closest(footerZone) || element.closest(headerFooterEditor)) {
        return
      }

      let customContainer = element.closest(customContainerSelector)
      if (customContainer) {
        offset = 0 - elementParent.getBoundingClientRect().left - elMarginLeft + customContainer.getBoundingClientRect().left
        width = customContainer.getBoundingClientRect().width
      } else {
        offset = 0 - elementParent.getBoundingClientRect().left - elMarginLeft
        width = document.documentElement.getBoundingClientRect().width
      }

      element.style.width = width + 'px'
      if (mainBody.classList.contains('rtl')) {
        element.style.right = offset + 'px'
      } else {
        element.style.left = offset + 'px'
      }

      if (!element.getAttribute('data-vce-stretch-content') && !element.getAttribute('data-vce-section-stretch-content')) {
        let padding = -1 * offset
        if (padding < 0) {
          padding = 0
        }
        let paddingRight = width - padding - elementParent.getBoundingClientRect().width + elMarginLeft + elMarginRight
        if (paddingRight < 0) {
          paddingRight = 0
        }
        elementContent.style['padding-left'] = padding + 'px'
        elementContent.style['padding-right'] = paddingRight + 'px'
      } else {
        elementContent.style['padding-left'] = ''
        elementContent.style['padding-right'] = ''
      }
    })
  }

  getFullWidthElements()
  // Detect scaling (zoom-in/zoom-out)
  window.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
      isScaling = true
    }
  }, false)

  // Set screen scale value on scale end
  window.addEventListener('touchend', function(e) {
    if (isScaling) {
      isScaling = false
      scale = window.visualViewport && window.visualViewport.scale
    }
  }, false)

  // Resize with throttle for performance
  window.addEventListener('resize', function() {
    if (!throttled) {
      handleResize()
      throttled = true
      setTimeout(function () {
        throttled = false
      }, throttleDelay)
    }
  })

  window.vceResetFullWidthElements = getFullWidthElements

  window.vcv.on('ready', function () {
    window.vceResetFullWidthElements && window.vceResetFullWidthElements()
  })
})()
