import vcCake from 'vc-cake'
import PostsGrid from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(PostsGrid);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss": require( 'raw-loader!./editor.css' ),"mixins":{"postsGridColumns":{"mixin": require( 'raw-loader!./cssMixins/postsGridColumns.pcss' )},"postsGridGap":{"mixin": require( 'raw-loader!./cssMixins/postsGridGap.pcss' )},"postsGridPaginationColor":{"mixin": require( 'raw-loader!./cssMixins/postsGridPaginationColor.pcss' )}}},
  ''
)
