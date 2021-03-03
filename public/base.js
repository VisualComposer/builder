/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import './variables'
import './editor/services/dataManager/service'
import './editor/services/utils/service'
import './editor/services/dataProcessor/service'

// const $ = require('expose-loader?$!jquery')
(function ($) {
  $(() => {
    vcCake.env('platform', 'wordpress').start(() => {
      vcCake.env('editor', 'import')
    })
  })
}(window.jQuery))

if (vcCake.env('VCV_DEBUG') === true) {
  window.app = vcCake
}
