import vcCake from 'vc-cake'
import TextBlockElement from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    component.add(TextBlockElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      basicColor: {
        mixin: require('raw-loader!./cssMixins/basicColor.scss')
      },
      basicHoverColor: {
        mixin: require('raw-loader!./cssMixins/basicHoverColor.scss')
      }
    }
  },
  // javascript callback
  ''
)
