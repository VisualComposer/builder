(function () {
  if (typeof window.vceResetFullHeightRows !== 'undefined') {
    return
  }

  var fullHeightRows = undefined

  function getRows() {
    fullHeightRows = Array.prototype.slice.call(document.querySelectorAll('.vce-row-full-height'))
    if (fullHeightRows.length) {
      handleResize()
    }
  }

  function getClosest (el, selector) {
    var matchesFn
    // find vendor prefix
    [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
      if (typeof document.body[ fn ] === 'function') {
        matchesFn = fn
        return true
      }
      return false
    })
    var parent
    // traverse parents
    while (el) {
      parent = el.parentElement
      if (parent && parent[ matchesFn ](selector)) {
        return parent
      }
      el = parent
    }
    return null
  }

  function handleResize() {
    if (!fullHeightRows.length) {
      return
    }
    fullHeightRows.forEach(function (row) {
      var windowHeight = window.innerHeight
      var offsetTop = row.getBoundingClientRect().top + window.pageYOffset
      var rowContainer = getClosest(row, '.vce-row-container')
      var isPreviousSiblingRow = rowContainer.previousElementSibling && rowContainer.previousElementSibling.classList.contains('vce-row-container')

      if (offsetTop < windowHeight && !isPreviousSiblingRow) {
        var fullHeight = 100 - offsetTop / (windowHeight / 100)
        if (fullHeight > 100) {
          fullHeight = 100
        }
        row.style.minHeight = fullHeight + 'vh'
      } else {
        row.style.minHeight = ''
      }
    })
  }

  getRows()
  window.addEventListener('resize', handleResize)
  window.vceResetFullHeightRows = getRows

  window.vcv.on('ready', function () {
    window.vceResetFullHeightRows && window.vceResetFullHeightRows()
  })
})()


