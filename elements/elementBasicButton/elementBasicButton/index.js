/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import BasicButtonComponent from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    component.add(BasicButtonComponent)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      basicColor: {
        mixin: require('raw-loader!./cssMixins/basicColor.pcss')
      },
      basicHoverColor: {
        mixin: require('raw-loader!./cssMixins/basicHoverColor.pcss')
      }
    }
  }
)
