import vcCake from 'vc-cake'
import WoocommerceMyAccount from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(WoocommerceMyAccount);
  },
  // css settings // css for element
  {"css":false,"editorCss":false},
  ''
)
