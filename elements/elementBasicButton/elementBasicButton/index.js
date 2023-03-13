/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import BasicButtonComponent from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  function (component) {
    component.add(BasicButtonComponent)
  },
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css')
  }
)
