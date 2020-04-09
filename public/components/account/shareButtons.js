import React from 'react'

export default class ShareButtons extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  componentDidMount () {
    this.insertTwitterJs(this.props.atts)
  }

  insertTwitterJs () {
    const htmlString = '<a class="twitter-share-button" href="https://twitter.com/intent/tweet" data-size="large" data-text="Hey, I just started to use Visual Composer Website Builder for WordPress" data-url="https://visualcomposer.com/" data-hashtags="wordpress" data-via="visualcomposers">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    const elementWrapper = this.twitterShare
    elementWrapper.innerHTML = ''
    const range = document.createRange()
    const documentFragment = range.createContextualFragment(htmlString)
    elementWrapper.appendChild(documentFragment)
  }

  handleShare () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=https://visualcomposer.com/&hashtag=%23wordpress', 'facebook-share-dialog', 'width=626,height=436')
    return false
  }

  render () {
    return (
      <div className='vcv-activation-share-buttons'>
        <p className='vcv-activation-share-text'>
          Don't forget to tweet about Visual Composer Website Builder. Thanks!
        </p>
        <div className='vcv-twitter-share-button' ref={(twitter) => { this.twitterShare = twitter }} />
      </div>
    )
  }
}
