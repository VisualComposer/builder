import vcCake from 'vc-cake'
import HeroSectionElement from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    //
    component.add(HeroSectionElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      backgroundColor: {
        mixin: require('raw-loader!./cssMixins/backgroundColor.pcss')
      }
    }
  },
  // javascript callback
  ''
)
