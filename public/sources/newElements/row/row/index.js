import vcCake from 'vc-cake'
import RowElement from './component'
const vcvAddElement = vcCake.getService('cook').add

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
        'mixin': require('raw-loader!./cssMixins/columnGap.pcss')
      }
    }
  },
  // javascript callback
  ''
)
