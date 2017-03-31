(function () {
  if (typeof window.vceResetFullWidthRows !== 'undefined') {
    return
  }
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
      let rowHelper = row.parentElement
      let rowContent = row.querySelector('.vce-row-content')

      let elMarginLeft = parseInt(window.getComputedStyle(row, null)[ 'margin-left' ], 10)
      let elMarginRight = parseInt(window.getComputedStyle(row, null)[ 'margin-right' ], 10)

      let offset = 0 - rowHelper.getBoundingClientRect().left - elMarginLeft
      let width = document.documentElement.clientWidth

      row.style.width = width + 'px'
      row.style.left = offset + 'px'

      if (!row.getAttribute('data-vce-stretch-content')) {
        let padding = (-1 * offset)
        if (padding < 0) {
          padding = 0
        }
        let paddingRight = width - padding - rowHelper.getBoundingClientRect().width + elMarginLeft + elMarginRight
        if (paddingRight < 0) {
          paddingRight = 0
        }
        rowContent.style[ 'padding-left' ] = padding + 'px'
        rowContent.style[ 'padding-right' ] = paddingRight + 'px'
      } else {
        rowContent.style[ 'padding-left' ] = ''
        rowContent.style[ 'padding-right' ] = ''
      }
    })
  }

  getRows()
  window.addEventListener('resize', handleResize)
  window.vceResetFullWidthRows = getRows
}())
