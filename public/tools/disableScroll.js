const keys = { 37: 1, 38: 1, 39: 1, 40: 1 }

function preventDefault (e) {
  e.preventDefault()
}

function preventDefaultForScrollKeys (e) {
  if (keys[e.keyCode]) {
    preventDefault(e)
    return false
  }
}

let wheelOpt = null
let wheelEvent = null

function setWheelSettings (contentWindow) {
  // modern Chrome requires { passive: false } when adding event
  let supportsPassive = false
  try {
    contentWindow.addEventListener('test', null, Object.defineProperty({}, 'passive', {
      get: function () {
        supportsPassive = true
        return true
      }
    }))
  } catch (e) {
    // do nothing
  }

  wheelOpt = supportsPassive ? { passive: false } : false
  wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel'
}

// call this to Disable
export function disableScroll (contentWindow) {
  if (wheelOpt === null) {
    setWheelSettings(contentWindow)
  }
  contentWindow.addEventListener('DOMMouseScroll', preventDefault, false) // older FF
  contentWindow.addEventListener(wheelEvent, preventDefault, wheelOpt) // modern desktop
  contentWindow.addEventListener('touchmove', preventDefault, wheelOpt) // mobile
  contentWindow.addEventListener('keydown', preventDefaultForScrollKeys, false)
}

// call this to Enable
export function enableScroll (contentWindow) {
  if (wheelOpt === null) {
    setWheelSettings(contentWindow)
  }
  contentWindow.removeEventListener('DOMMouseScroll', preventDefault, false)
  contentWindow.removeEventListener(wheelEvent, preventDefault, wheelOpt)
  contentWindow.removeEventListener('touchmove', preventDefault, wheelOpt)
  contentWindow.removeEventListener('keydown', preventDefaultForScrollKeys, false)
}
