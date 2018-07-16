import vcCake from 'vc-cake'
import ColumnElement from './column/column/component'
const AddElement = vcCake.getService('cook').add
const AddElementToHub = vcCake.getService('hubElements').add

AddElement(
  require('./column/column/settings.json'),
  // Component callback
  function (component) {
    component.add(ColumnElement)
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
    tag: 'column',
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
