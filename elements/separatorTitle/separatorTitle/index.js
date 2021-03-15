/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import SeparatorTitle from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  (component) => {
    component.add(SeparatorTitle)
  },
  // css settings // css for element
  {
    'css': require('raw-loader!./styles.css'),
    'editorCss': require('raw-loader!./editor.css'),
    'mixins': {
      'separatorColor': { 'mixin': require('raw-loader!./cssMixins/separatorColor.pcss') },
      'separatorWidth': { 'mixin': require('raw-loader!./cssMixins/separatorWidth.pcss') },
      'separatorThickness': { 'mixin': require('raw-loader!./cssMixins/separatorThickness.pcss') },
      'titleColor': { 'mixin': require('raw-loader!./cssMixins/titleColor.pcss') }
    }
  },
  ''
)
