import vcCake from 'vc-cake'
import TextBlockElement from './textBlock/textBlock/component'
import {readJsonSync} from 'fs-extra'

const AddElement = vcCake.getService('cook').add
const AddElementToHub = vcCake.getService('hubElements').add
const settings = readJsonSync('./tests/jest/devElements/textBlock/textBlock/settings.json')

AddElement(
  settings,
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
