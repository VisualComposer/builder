import vcCake from 'vc-cake'
import PostsGridDataSourceCustomPostType from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(PostsGridDataSourceCustomPostType);
  },
  // css settings // css for element
  {"css":false,"editorCss":false},
  ''
)
