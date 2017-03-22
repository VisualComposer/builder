import vcCake from 'vc-cake'
import SingleImageElement from './component'
const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    component.add(SingleImageElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: false
  },
  // javascript callback
  ''
)
