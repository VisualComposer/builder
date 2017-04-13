import vcCake from 'vc-cake'
import IconElement from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('./settings.json'),
  // Component callback
  function (component) {
    //
    component.add(IconElement)
  },
  // css settings // css for element
  {
    css: require('raw-loader!./styles.css'),
    editorCss: require('raw-loader!./editor.css'),
    mixins: {
      iconColor: {
        mixin: require('raw-loader!./cssMixins/iconColor.pcss')
      },
      iconColorHover: {
        mixin: require('raw-loader!./cssMixins/iconColorHover.pcss')
      },
      shapeColor: {
        mixin: require('raw-loader!./cssMixins/shapeColor.pcss')
      },
      shapeColorHover: {
        mixin: require('raw-loader!./cssMixins/shapeColorHover.pcss')
      }
    }
  },
  // javascript callback
  ''
)
