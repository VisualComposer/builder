import vcCake from 'vc-cake'
import GoogleFontsHeadingElement from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    //
    component.add(GoogleFontsHeadingElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      basicColor: {
        textColor: require('raw-loader!./cssMixins/textColor.pcss')
      }
    }
  },
  // javascript callback
  ''
)
