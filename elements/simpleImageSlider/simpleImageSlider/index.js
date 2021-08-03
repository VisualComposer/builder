/* eslint-disable import/no-webpack-loader-syntax */
import { getService } from 'vc-cake'
import SimpleImageSlider from './component'

const vcvAddElement = getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  (component) => {
    component.add(SimpleImageSlider)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css')
  }
)
