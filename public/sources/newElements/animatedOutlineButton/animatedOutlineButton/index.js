import vcCake from 'vc-cake'
import AnimatedOutlineButtonComponent from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    component.add(AnimatedOutlineButtonComponent)
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
