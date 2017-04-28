import vcCake from 'vc-cake'
import TwitterTimeline from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(TwitterTimeline);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss": require( 'raw-loader!./editor.css' ),"mixins":{"timelineWidth":{"mixin": require( 'raw-loader!./cssMixins/timelineWidth.pcss' )}}},
  ''
)
