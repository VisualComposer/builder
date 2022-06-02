const now = window.performance && window.performance.now
  ? window.performance.now.bind(window.performance)
  : Date.now

const SCROLL_TIME = 468

function scrollElement (x, y) {
  this.scrollLeft = x
  this.scrollTop = y
}

function ease (k) {
  return 0.5 * (1 - Math.cos(Math.PI * k))
}

function step (context) {
  const time = now()
  let elapsed = (time - context.startTime) / SCROLL_TIME

  // avoid elapsed times higher than one
  elapsed = elapsed > 1 ? 1 : elapsed

  // apply easing to elapsed time
  const value = ease(elapsed)

  const currentX = context.startX + (context.x - context.startX) * value
  const currentY = context.startY + (context.y - context.startY) * value

  context.method.call(context.scrollable, currentX, currentY)

  // scroll more if we have not reached our destination
  if (currentX !== context.x || currentY !== context.y) {
    window.requestAnimationFrame(step.bind(window, context))
  }
}

export function smoothScroll (el, x = 0, y = 0) {
  const startTime = now()
  const scrollable = el
  const startX = el.scrollLeft
  const startY = el.scrollTop
  const method = scrollElement

  // scroll looping over a frame
  step({
    scrollable: scrollable,
    method: method,
    startTime: startTime,
    startX: startX,
    startY: startY,
    x: x,
    y: y
  })
}
