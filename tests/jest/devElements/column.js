import vcCake from 'vc-cake'
import {readJsonSync} from 'fs-extra'
import ColumnElement from './column/column/component'
const AddElement = vcCake.getService('cook').add
const AddElementToHub = vcCake.getService('hubElements').add
const settings = readJsonSync('./tests/jest/devElements/column/column/settings.json')
AddElement(
  settings,
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
