(function () {
  if (typeof window.vceResetFullWidthElements !== 'undefined') {
    return
  }

  let isScaling = false // is scaling happening (zoom-in/zoom-out)
  let scale = 1 // initial scale value
  let fullWidthElements = undefined
  const headerZone = '[data-vcv-layout-zone="header"]'
  const footerZone = '[data-vcv-layout-zone="footer"]'
  const headerFooterEditor = '.vcv-editor-theme-hf'
  const headerFooterLayout = '.vcv-content--header-footer'
  const blankLayout = '.vcv-content--blank'
  const customContainerSelector = '.vce-full-width-custom-container'
  const layoutContent = '.vce-layouts-wp-content-area-container'

  function getFullWidthElements() {
    const visibleElements = []
    const hiddenElements = []
    fullWidthElements = Array.prototype.slice.call(document.querySelectorAll('[data-vce-full-width="true"]:not([data-vcv-do-helper-clone]),[data-vce-full-width-section="true"]:not([data-vcv-do-helper-clone])'))

    fullWidthElements.forEach(function (element) {
      if (element.offsetHeight && element.offsetWidth) {
        visibleElements.push(element)
      } else {
        hiddenElements.push(element)
      }
    })

    if (visibleElements.length) {
      handleResize()
    }

    if (hiddenElements.length) {
      const options = {
        root: document.documentElement
      }

      const callback = (entries, observer) => {
        entries.forEach(function (entry) {
          if (entry.intersectionRatio > 0) {
            handleResize()
          }
        });
      };

      hiddenElements.forEach(function (element) {
        let observer = new window.IntersectionObserver(callback, options)
        observer.observe(element)
      })
    }
  }

  function handleResize() {
    if (!fullWidthElements.length) {
      return
    }
    // resize should happen only after scaling is ended or on initial scale (1)
    if (isScaling || (typeof scale === 'number' && scale !== 1)) {
      return
    }
    fullWidthElements.forEach(function (element) {
      const mainBody = document.body
      const layoutArea = document.querySelector(layoutContent)
      const elementParent = element.parentElement
      const elementContent = element.querySelector('[data-vce-element-content="true"]')

      const elMarginLeft = parseInt(window.getComputedStyle(element, null)['margin-left'], 10)
      const elMarginRight = parseInt(window.getComputedStyle(element, null)['margin-right'], 10)
      let offset, width

      if (!element.closest('[data-vce-element-content]') && (element.closest(headerFooterLayout) || element.closest(blankLayout)) // Remove paddings if HF layout
       ) { // Remove paddings if layout has wrapper row
        if (!element.getAttribute('data-vce-stretch-content') && !element.getAttribute('data-vce-section-stretch-content')) { // Fix BC for row paddings
          elementContent.style['padding-left'] = ''
          elementContent.style['padding-right'] = ''
        }
        return
      }
    
      if (!element.closest('[data-vce-element-content]') && (element.closest(headerZone) || element.closest(footerZone) || element.closest(headerFooterEditor))) {
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

      if (!layoutArea?.closest('[data-vce-element-content]') && !element.getAttribute('data-vce-stretch-content') && !element.getAttribute('data-vce-section-stretch-content')) {
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
  const throttle = (func, limit) => {
    let lastFunc
    let lastRan
    return function() {
      const context = this
      const args = arguments
      if (!lastRan) {
        func.apply(context, args)
        lastRan = Date.now()
      } else {
        clearTimeout(lastFunc)
        lastFunc = setTimeout(function() {
          if ((Date.now() - lastRan) >= limit) {
            func.apply(context, args)
            lastRan = Date.now()
          }
        }, limit - (Date.now() - lastRan))
      }
    }
  }
  // Resize with throttle for performance
  window.addEventListener('resize', throttle(handleResize, 50))

  window.vceResetFullWidthElements = getFullWidthElements

  window.vcv.on('ready', function () {
    window.vceResetFullWidthElements && window.vceResetFullWidthElements()
  })
})()
