import vcCake from 'vc-cake'
import PostsGridDataSourcePost from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(PostsGridDataSourcePost);
  },
  // css settings // css for element
  {"css":false,"editorCss":false},
  ''
)
