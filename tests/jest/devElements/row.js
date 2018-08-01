import vcCake from 'vc-cake'
import {readJsonSync} from 'fs-extra'

import RowElement from './row/row/component'
const AddElement = vcCake.getService('cook').add
const AddElementToHub = vcCake.getService('hubElements').add
const settings = readJsonSync('./tests/jest/devElements/row/row/settings.json')

AddElement(
  settings,
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
