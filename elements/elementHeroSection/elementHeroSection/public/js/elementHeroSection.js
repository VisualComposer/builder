(function () {
  var breakpoints = [544, 768, 992, 1200]
  var classes = ['vce-hero-section-media--sm', 'vce-hero-section-media--md', 'vce-hero-section-media--lg', 'vce-hero-section-media--xl']

  var handleWindowResize = function handleWindowResize () {
    var heroSections = Array.prototype.slice.call(document.querySelectorAll('.vce-hero-section-container'))
    heroSections.forEach(function (heroSection) {
      breakpoints.forEach(function (breakpoint, i) {
        if (heroSection.getBoundingClientRect().width > breakpoint) {
          if (!heroSection.classList.contains(classes[i])) {
            heroSection.classList.add(classes[i])
          }
        } else {
          if (heroSection.classList.contains(classes[i])) {
            heroSection.classList.remove(classes[i])
          }
        }
      })
    })
  }

  window.vcv.on('ready', function () {
    handleWindowResize()
    window.addEventListener('resize', handleWindowResize)
  })
  window.vcv.on('heroSectionReady', handleWindowResize)
})()
