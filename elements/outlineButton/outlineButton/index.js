/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import OutlineButtonComponent from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    component.add(OutlineButtonComponent)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      color: {
        mixin: require('raw-loader!./cssMixins/color.pcss')
      },
      borderColor: {
        mixin: require('raw-loader!./cssMixins/borderColor.pcss')
      },
      backgroundColor: {
        mixin: require('raw-loader!./cssMixins/backgroundColor.pcss')
      },
      designOptions: {
        mixin: require('raw-loader!./cssMixins/designOptions.pcss')
      }
    }
  },
  // javascript callback
  ''
)
