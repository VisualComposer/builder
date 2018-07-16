import vcCake from 'vc-cake'
import TextBlockElement from './textBlock/textBlock/component'
const AddElement = vcCake.getService('cook').add
const AddElementToHub = vcCake.getService('hubElements').add

AddElement(
  require('./textBlock/textBlock/settings.json'),
  // Component callback
  function (component) {
    component.add(TextBlockElement)
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
    tag: 'textBlock',
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
