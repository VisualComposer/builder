import vcCake from 'vc-cake'
import TwitterTweet from './component'

const vcvAddElement = vcCake.getService('cook').add

vcvAddElement(
  require( './settings.json' ),
  // Component callback
  (component) => {
    component.add(TwitterTweet);
  },
  // css settings // css for element
  {"css": require( 'raw-loader!./styles.css' ),"editorCss": require( 'raw-loader!./editor.css' ),"mixins":{"tweetWidth":{"mixin": require( 'raw-loader!./cssMixins/tweetWidth.pcss' )}}},
  ''
)
