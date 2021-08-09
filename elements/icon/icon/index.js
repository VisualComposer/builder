/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import IconElement from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    //
    component.add(IconElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css')
  },
  // javascript callback
  ''
)
