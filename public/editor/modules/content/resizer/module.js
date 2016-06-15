import vcCake from 'vc-cake'
import $ from 'jquery'
import './css/resizer-tree-view.less'
import Resizer from './lib/resizer'

vcCake.add('resizer', function (api) {
  api.module('ui-tree-layout').on('show', function () {
    // Width resizer
    var $target, $resizer
    $target = $('.vcv-ui-tree-view-layout', '#vcv-ui-tree-layout-wrapper')
    $resizer = $('.resizer-tree-view-layout', '#vcv-ui-tree-layout-wrapper')
    var xResizer = initResize($target, {
      resizeY: false,
      resizerClasses: false,
      resizerAppend: false,
      $resizer: $resizer
    })

    // Height resizer
    $target = $('.vcv-ui-tree-view-container', '#vcv-ui-tree-layout-wrapper')
    $resizer = $('.resizer-tree-view-container', '#vcv-ui-tree-layout-wrapper')
    var yResizer = initResize($target, {
      resizeX: false,
      resizerClasses: false,
      resizerAppend: false,
      $resizer: $resizer
    })

    // XY resizer
    $resizer = $('.resizer-tree-view', '#vcv-ui-tree-layout-wrapper')
    initResize($resizer, {
      resizeX: false,
      resizeY: false,
      callback: function (e) {
        xResizer.doResize(e)
        yResizer.doResize(e)
      },
      resizerClasses: false,
      resizerAppend: false,
      $resizer: $resizer
    })
  })
})

function initResize ($target, settings) {
  return new Resizer($target, settings)
}
