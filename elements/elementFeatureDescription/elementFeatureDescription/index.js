/* eslint-disable import/no-webpack-loader-syntax */
import vcCake from 'vc-cake'
import FeatureDescription from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  (component) => {
    component.add(FeatureDescription)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: false,
    mixins: {
      backgroundPosition: {
        mixin: require('raw-loader!./cssMixins/backgroundPosition.pcss')
      }
    }
  },
  ''
)
