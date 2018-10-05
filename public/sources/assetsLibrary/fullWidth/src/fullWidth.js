(function () {
  if (typeof window.vceResetFullWidthElements !== 'undefined') {
    return
  }

  let fullWidthElements = undefined
  const headerZone = '[data-vcv-layout-zone="header"]'
  const footerZone = '[data-vcv-layout-zone="footer"]'
  const headerFooterEditor = '.vcv-editor-theme-hf'

  function getFullWidthElements() {
    fullWidthElements = Array.prototype.slice.call(document.querySelectorAll('[data-vce-full-width="true"],[data-vce-full-width-section="true"]'))
    if (fullWidthElements.length) {
      handleResize()
    }
  }

  function handleResize() {
    if (!fullWidthElements.length) {
      return
    }
    fullWidthElements.forEach(function (element) {
      const mainBody = document.body
      const elementParent = element.parentElement
      const elementContent = element.querySelector('[data-vce-element-content="true"]')
      const elementCustomContainer = document.querySelector('.vce-full-width-custom-container')

      const elMarginLeft = parseInt(window.getComputedStyle(element, null)['margin-left'], 10)
      const elMarginRight = parseInt(window.getComputedStyle(element, null)['margin-right'], 10)
      let offset, width

      if (element.closest(headerZone) || element.closest(footerZone) || element.closest(headerFooterEditor)) {
        return
      }

      if (document.body.contains(elementCustomContainer)) {
        offset = 0 - elementParent.getBoundingClientRect().left - elMarginLeft + elementCustomContainer.getBoundingClientRect().left
        width = elementCustomContainer.getBoundingClientRect().width
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
  window.addEventListener('resize', handleResize)
  window.vceResetFullWidthElements = getFullWidthElements

  window.vcv.on('ready', function () {
    window.vceResetFullWidthElements && window.vceResetFullWidthElements()
  })
})()
