import vcCake from 'vc-cake'
import WoocommerceProducts from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(WoocommerceProducts);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss":false},
  ''
)
