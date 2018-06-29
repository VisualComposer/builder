import vcCake from 'vc-cake'
import RowElement from '../../../devElements/row/row/component'
const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require('../../../devElements/row/row/settings.json'),
  // Component callback
  function (component) {
    component.add(RowElement)
  },
  // css settings // css for element
  {
    css: '',
    editorCss: false,
    mixins: {
      columnGap: {
        mixin: ''
      }
    }
  },
  // javascript callback
  ''
)
