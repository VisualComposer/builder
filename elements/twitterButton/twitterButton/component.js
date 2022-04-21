import React from 'react'
import vcCake from 'vc-cake'
import { isEqual } from 'lodash'

const vcvAPI = vcCake.getService('api')

export default class TwitterButton extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertTwitterJs(this.props.atts)
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(this.props.atts, prevProps.atts)) {
      const { shareText, tweetAccount, tweetButtonSize, buttonType, username, showUsername, hashtagTopic, tweetText } = prevProps.atts
      const elementKey = `customProps:${prevProps.id}-${buttonType}-${shareText}-${tweetAccount}-${tweetButtonSize}-${username}-${showUsername}-${hashtagTopic}-${tweetText}`

      const nextAtts = this.props.atts
      const nextElementKey = `customProps:${this.props.id}-${nextAtts.buttonType}-${nextAtts.shareText}-${nextAtts.tweetAccount}-${nextAtts.tweetButtonSize}-${nextAtts.username}-${nextAtts.showUsername}-${nextAtts.hashtagTopic}-${nextAtts.tweetText}`

      if (elementKey !== nextElementKey) {
        this.insertTwitterJs(this.props.atts)
      }
    }
  }

  insertTwitterJs (props) {
    const tag = this.createElementTag(props)
    let twitterScript = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    twitterScript = tag + twitterScript

    const wrapper = this.getDomNode().querySelector('.vce-tweet-button-inner')
    this.updateInlineHtml(wrapper, twitterScript)
  }

  extractDynamicContent (content) {
    if (typeof content !== 'object') {
      return content
    }

    const contentProps = content.props

    if (contentProps) {
      return contentProps.dangerouslySetInnerHTML.__html
    }
  }

  createElementTag (props) {
    const element = document.createElement('a')

    let { shareText, tweetAccount, tweetButtonSize, buttonType, username, showUsername, hashtagTopic, tweetText } = props
    const buttonClass = 'twitter-' + buttonType + '-button'

    if (buttonType && buttonType === 'share' && shareText) {
      element.setAttribute('data-text', this.extractDynamicContent(shareText))
    }

    if (buttonType && (buttonType === 'mention' || buttonType === 'hashtag') && tweetText) {
      element.setAttribute('data-text', this.extractDynamicContent(tweetText))
    }

    if (buttonType && buttonType === 'share' && tweetAccount) {
      tweetAccount = tweetAccount.split('@').pop()
      element.setAttribute('data-via', tweetAccount)
    }

    if (tweetButtonSize && tweetButtonSize === 'large') {
      element.setAttribute('data-size', tweetButtonSize)
    }

    if (username) {
      username = username.split('@').pop()
      username = username.split('https://twitter.com/').pop()
      username = username.replace(/\s+/g, '')
    }

    if (hashtagTopic) {
      hashtagTopic = hashtagTopic.split('https://twitter.com/hashtag/').pop()
      hashtagTopic = hashtagTopic.replace('?src=hash', '')
      hashtagTopic = hashtagTopic.replace(/\s+/g, '')
    }

    if (buttonType && buttonType === 'follow') {
      element.setAttribute('data-show-screen-name', showUsername.toString())
    }

    const links = {
      share: 'https://twitter.com/share',
      follow: 'https://twitter.com/' + username,
      mention: 'https://twitter.com/intent/tweet?screen_name=' + username,
      hashtag: 'https://twitter.com/intent/tweet?button_hashtag=' + hashtagTopic
    }
    const buttonLink = links[buttonType]

    const defaultContent = {
      share: 'Tweet',
      follow: showUsername ? 'Follow @' + username : 'Follow',
      mention: 'Tweet to @' + username,
      hashtag: 'Tweet #' + hashtagTopic ? hashtagTopic.split('#').pop() : hashtagTopic
    }
    const buttonContent = defaultContent[buttonType]

    element.setAttribute('href', buttonLink)
    element.setAttribute('data-show-count', 'false')
    element.className = buttonClass
    element.innerHTML = buttonContent

    const elementWrapper = document.createElement('div')
    elementWrapper.appendChild(element)

    return elementWrapper.innerHTML
  }

  render () {
    const { id, atts, editor } = this.props
    const { customClass, alignment, metaCustomId } = atts
    let classes = 'vce-tweet-button'
    const innerClasses = 'vce-tweet-button-inner'
    const wrapperClasses = 'vce-tweet-button-wrapper vce'
    const customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-tweet-button--align-${alignment}`
    }

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div {...customProps} className={classes} {...editor}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll}>
          <div className={innerClasses} />
        </div>
      </div>
    )
  }
}
