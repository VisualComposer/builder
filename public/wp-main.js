/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'

import { start } from './resources/editorInit/start'
import { rebuildPosts } from './resources/editorInit/rebuildPosts'

(($) => {
  let started = false
  if (window.vcvPostUpdateAction && window.vcvPostUpdateAction === 'updatePosts') {
    rebuildPosts()
  }
  const setStarted = () => {
    started = true
  }

  // Need to wait while ALL Elements will be initialized otherwise can break layout
  $.ready(function () {
    start(setStarted)
  })
  // In case if jQuery.ready fails try to load manually
  window.setTimeout(() => {
    if (!started) {
      start(setStarted)
    }
  }, 10000)
})(window.jQuery)

if (vcCake.env('debug') === true) {
  window.app = vcCake
}
