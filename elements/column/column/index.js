/* eslint-disable import/no-webpack-loader-syntax */
import { getService } from 'vc-cake'
import ColumnElement from './component'

const vcvAddElement = getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    //
    component.add(ColumnElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css')
  }
)
