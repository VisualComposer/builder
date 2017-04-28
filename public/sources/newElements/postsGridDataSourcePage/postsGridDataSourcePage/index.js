import vcCake from 'vc-cake'
import PostsGridDataSourcePage from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(PostsGridDataSourcePage);
  },
  // css settings // css for element
  {"css":false,"editorCss":false},
  ''
)
