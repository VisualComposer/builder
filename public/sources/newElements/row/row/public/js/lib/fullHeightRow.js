(function () {
  if (typeof window.vceResetFullHeightRows !== 'undefined') {
    return
  }
  let fullHeightRows

  function getRows () {
    fullHeightRows = Array.prototype.slice.call(document.querySelectorAll('.vce-row-full-height'))
    if (fullHeightRows.length) {
      handleResize()
    }
  }

  function handleResize () {
    if (!fullHeightRows.length) {
      return
    }
    fullHeightRows.forEach((row) => {
      let windowHeight = window.innerHeight
      let offsetTop = row.getBoundingClientRect().top + window.pageYOffset

      if (offsetTop < windowHeight) {
        let fullHeight = 100 - offsetTop / (windowHeight / 100)
        row.style.minHeight = `${fullHeight}vh`
      } else {
        row.style.minHeight = ''
      }
    })
  }

  getRows()
  window.addEventListener('resize', handleResize)
  window.vceResetFullHeightRows = getRows
}())
