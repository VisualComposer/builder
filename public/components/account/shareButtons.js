import React from 'react'

export default class ShareButtons extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  componentDidMount () {
    this.insertTwitterJs(this.props.atts)
  }

  insertTwitterJs () {
    let htmlString = '<a class="twitter-share-button" href="https://twitter.com/intent/tweet" data-size="large" data-text="Hey, I just started to use Visual Composer Website Builder for WordPress" data-url="https://visualcomposer.com/" data-hashtags="wordpress" data-via="visualcomposers">Tweet</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    const elementWrapper = this.twitterShare
    elementWrapper.innerHTML = ''
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(htmlString)
    elementWrapper.appendChild(documentFragment)
  }

  handleShare () {
    window.open('https://www.facebook.com/sharer/sharer.php?u=https://visualcomposer.com/&hashtag=%23wordpress', 'facebook-share-dialog', 'width=626,height=436')
    return false
  }

  render () {
    const spreadTheWordText = ShareButtons.localizations ? ShareButtons.localizations.spreadTheWordText : 'Enjoy Visual Composer Website Builder? Let your friends know about it - spread the word.'
    return (
      <div className='vcv-activation-share-buttons'>
        <p className='vcv-activation-share-text'>{spreadTheWordText}</p>
        <a className='vcv-facebook-share-button' href='#' onClick={this.handleShare}>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' color='#ffffff' className='vcv-facebook-share-logo'>
            <path fill='#ffffff' fillRule='evenodd'
              d='M8 14H3.667C2.733 13.9 2 13.167 2 12.233V3.667A1.65 1.65 0 0 1 3.667 2h8.666A1.65 1.65 0 0 1 14 3.667v8.566c0 .934-.733 1.667-1.667 1.767H10v-3.967h1.3l.7-2.066h-2V6.933c0-.466.167-.9.867-.9H12v-1.8c.033 0-.933-.266-1.533-.266-1.267 0-2.434.7-2.467 2.133v1.867H6v2.066h2V14z' />
          </svg>
          <span className='vcv-facebook-share-text'>Share</span>
        </a>
        <div className='vcv-twitter-share-button' ref={(twitter) => { this.twitterShare = twitter }} />

      </div>
    )
  }
}
