/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import FaqToggle from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  (component) => {
    component.add(FaqToggle)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      color: {
        mixin: require('raw-loader!./cssMixins/color.pcss')
      },
      shapeColor: {
        mixin: require('raw-loader!./cssMixins/shapeColor.pcss')
      },
      hoverColor: {
        mixin: require('raw-loader!./cssMixins/hoverColor.pcss')
      },
      shapeHoverColor: {
        mixin: require('raw-loader!./cssMixins/shapeHoverColor.pcss')
      }
    }
  },
  ''
)
