/* eslint-disable import/no-webpack-loader-syntax */
import { getService } from 'vc-cake'
import RowElement from './component'

const vcvAddElement = getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    component.add(RowElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: false,
    mixins: {
      columnGap: {
        mixin: require('raw-loader!./cssMixins/columnGap.pcss')
      }
    }
  }
)
