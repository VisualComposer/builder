import vcCake from 'vc-cake'
import RowElement from '../../../devElements/row/row/component'
const AddElement = vcCake.getService('cook').add
const AddElementToHub = vcCake.getService('hubElements').add

AddElement(
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

AddElementToHub(
  {
    tag: 'row',
    assetsPath: '',
    bundlePath: '',
    elementPath: '',
    settings: {
      metaDescription: '',
      metaPreviewUrl: '',
      metaThumbnailUrl: '',
      name: ''
    }
  }
)
