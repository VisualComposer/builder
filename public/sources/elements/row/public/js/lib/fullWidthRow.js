(function () {
  let fullWidthRows

  function getRows () {
    fullWidthRows = Array.prototype.slice.call(document.querySelectorAll('[data-vce-full-width="true"]'))
    if (fullWidthRows.length) {
      handleResize()
    }
  }

  function handleResize () {
    if (!fullWidthRows.length) {
      return
    }
    fullWidthRows.forEach((row) => {
      let rowHelper = row.parentElement.querySelector('.vce-row-full-width')
      let rowContent = row.querySelector('.vce-row-content')
      let offset = 0 - rowHelper.getBoundingClientRect().left
      let width = document.documentElement.clientWidth

      row.style.width = width + 'px'
      row.style.left = offset + 'px'

      if (!row.getAttribute('data-vce-stretch-content')) {
        let padding = (-1 * offset)
        if (padding < 0) {
          padding = 0
        }
        let paddingRight = width - padding - rowHelper.getBoundingClientRect().width
        if (paddingRight < 0) {
          paddingRight = 0
        }
        rowContent.style['padding-left'] = padding + 'px'
        rowContent.style['padding-right'] = paddingRight + 'px'
      } else {
        rowContent.style['padding-left'] = ''
        rowContent.style['padding-right'] = ''
      }
    })
  }

  getRows()
  window.addEventListener('resize', handleResize)
  window.vceResetRowSelector = getRows
}())
