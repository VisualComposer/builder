import vcCake from 'vc-cake'
import TwitterGrid from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(TwitterGrid);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss": require( 'raw-loader!./editor.css' ),"mixins":{"gridWidth":{"mixin": require( 'raw-loader!./cssMixins/gridWidth.pcss' )}}},
  ''
)
