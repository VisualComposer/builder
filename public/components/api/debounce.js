export default function debounce (func, wait) {
  let lastArgs
  let lastThis
  let timerId
  let result
  let lastCallTime
  if (typeof func !== 'function') {
    throw new TypeError('function must be passed as the first argument')
  }
  wait = Number(wait) || 0

  function invokeFunc () {
    let args = lastArgs
    let thisArg = lastThis

    lastArgs = lastThis = undefined
    result = func.apply(thisArg, args)
    return result
  }

  function leadingEdge () {
    // Reset any `maxWait` timer.
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired(), wait)
    // Invoke the leading edge.
    return result
  }
  function remainingWait (time) {
    let timeSinceLastCall = time - lastCallTime
    return wait - timeSinceLastCall
  }

  function shouldInvoke (time) {
    let timeSinceLastCall = time - lastCallTime
    // Either this is the first call, activity has stopped and we're at the trailing
    // edge, the system time has gone backwards and we're treating it as the
    // trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) || (timeSinceLastCall < 0))
  }

  function timerExpired () {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge (time) {
    timerId = undefined

    // Only invoke if we have `lastArgs` which means `func` has been debounced at
    // least once.
    if (lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel () {
    if (timerId !== undefined) {
      clearTimeout(timerId)
    }
    lastArgs = lastCallTime = lastThis = timerId = undefined
  }

  function flush () {
    return timerId === undefined
      ? result
      : trailingEdge(Date.now())
  }

  function debounced () {
    let time = Date.now()
    let isInvoking = shouldInvoke(time)
    lastArgs = arguments
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime)
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait)
    }
    return result
  }
  debounced.cancel = cancel
  debounced.flush = flush
  return debounced
}
