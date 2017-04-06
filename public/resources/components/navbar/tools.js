/**
 * Get closest parent to element
 * @param el
 * @param selector
 * @returns {*}
 */
export const getClosest = (el, selector) => {
  let matchesFn;
  // find vendor prefix
  [ 'matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector', 'oMatchesSelector' ].some(function (fn) {
    if (typeof document.body[ fn ] === 'function') {
      matchesFn = fn
      return true
    }
    return false
  })
  let parent
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

/**
 * Get real width and height for element in DOM.
 *
 * @param $el
 * @param container
 * @returns {*|NavbarControl.state.realSize|{width, height}}
 */
export const getRealSize = ($el, parent) => {
  const realSize = {width: 0, height: 0}
  let $tempEl = $el.cloneNode(true)
  $tempEl.style.position = 'fixed'
  let container
  if ($el.closest === undefined) {
    container = getClosest($el, parent)
  } else {
    container = $el.closest(parent)
  }
  container.appendChild($tempEl)
  let style = window.getComputedStyle($tempEl, null)
  // get width
  realSize.width = $tempEl.offsetWidth
  realSize.width += parseInt(style.marginLeft) + parseInt(style.marginRight)
  // get height
  realSize.height = $tempEl.offsetHeight
  realSize.height += parseInt(style.marginLeft) + parseInt(style.marginRight)

  $tempEl.remove()
  return realSize
}
