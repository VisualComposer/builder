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
        mixin: require('raw-loader!./cssMixins/color.scss')
      }
    }
  },
  // javascript callback
  ''
)
