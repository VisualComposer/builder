import vcCake from 'vc-cake'
import RawJs from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(RawJs);
  },
  // css settings // css for element
  {"css":false,"editorCss": require( 'raw-loader!./editor.css' )},
  ''
)
