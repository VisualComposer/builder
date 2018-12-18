/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'

import { start } from './components/editorInit/start'
import { rebuildPosts } from './components/editorInit/rebuildPosts'
import heartbeat from './components/heartbeat/index'

(() => {
  let started = false
  if (window.vcvPostUpdateAction && window.vcvPostUpdateAction === 'updatePosts') {
    rebuildPosts()
  }
  const setStarted = () => {
    started = true
  }

  // Need to wait while ALL Elements will be initialized otherwise can break layout
  window.onload = () => {
    heartbeat(window.jQuery)
    start(setStarted)
  }
  // In case if jQuery.ready fails try to load manually
  window.setTimeout(() => {
    if (!started) {
      start(setStarted)
    }
  }, 10000)
})()

if (vcCake.env('debug') === true) {
  window.app = vcCake
}
