import vcCake from 'vc-cake'
import Separator from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(Separator);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss": require( 'raw-loader!./editor.css' ),"mixins":{"basicColor":{"mixin": require( 'raw-loader!./cssMixins/basicColor.pcss' )},"separatorWidth":{"mixin": require( 'raw-loader!./cssMixins/separatorWidth.pcss' )}}},
  ''
)
