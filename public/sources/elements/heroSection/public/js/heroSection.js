(() => {
  let breakpoints = [ 544, 768, 992, 1200 ]
  let classes = [
    'vce-hero-section-media--sm',
    'vce-hero-section-media--md',
    'vce-hero-section-media--lg',
    'vce-hero-section-media--xl'
  ]

  let handleWindowResize = () => {
    let heroSections = Array.prototype.slice.call(document.querySelectorAll('.vce-hero-section-container'))
    heroSections.forEach((heroSection) => {
      breakpoints.forEach((breakpoint, i) => {
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

  handleWindowResize()
  window.addEventListener('resize', handleWindowResize)
})()
