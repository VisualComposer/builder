/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import './config/variables'
import './editor/services/dataProcessor/service'

const $ = require('expose-loader?$!jquery')
$(() => {
  vcCake.env('platform', 'wordpress').start(() => {
    vcCake.env('editor', 'import')
  })
})

if (vcCake.env('debug') === true) {
  window.app = vcCake
}
