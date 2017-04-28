import vcCake from 'vc-cake'
import WoocommerceProduct from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(WoocommerceProduct);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss":false},
  ''
)
