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
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      pointerColor: {
        mixin: require('raw-loader!./cssMixins/pointerColor.pcss')
      },
      pointerColorHover: {
        mixin: require('raw-loader!./cssMixins/pointerColorHover.pcss')
      },
      arrowColor: {
        mixin: require('raw-loader!./cssMixins/arrowColor.pcss')
      },
      arrowColorHover: {
        mixin: require('raw-loader!./cssMixins/arrowColorHover.pcss')
      },
      backgroundPosition: {
        mixin: require('raw-loader!./cssMixins/backgroundPosition.pcss')
      }
    }
  }
)
