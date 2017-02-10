/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertTwitterJs(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    let { shareText, tweetAccount, tweetButtonSize, buttonType, username, showUsername, hashtagTopic, tweetText } = this.props.atts
    let elementKey = `customProps:${this.props.id}-${buttonType}-${shareText}-${tweetAccount}-${tweetButtonSize}-${username}-${showUsername}-${hashtagTopic}-${tweetText}`

    let nextAtts = nextProps.atts
    let nextElementKey = `customProps:${nextProps.id}-${nextAtts.buttonType}-${nextAtts.shareText}-${nextAtts.tweetAccount}-${nextAtts.tweetButtonSize}-${nextAtts.username}-${nextAtts.showUsername}-${nextAtts.hashtagTopic}-${nextAtts.tweetText}`

    if (elementKey !== nextElementKey) {
      this.insertTwitterJs(nextProps.atts)
    }
  }

  insertTwitterJs (props) {
    let tag = this.createElementTag(props)
    let twitterScript = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    twitterScript = tag + twitterScript

    const wrapper = this.getDomNode().querySelector('.vce-tweet-button-inner')
    this.updateInlineHtml(wrapper, twitterScript)
  }

  createElementTag (props) {
    let element = document.createElement('a')

    let { shareText, tweetAccount, tweetButtonSize, buttonType, username, showUsername, hashtagTopic, tweetText } = props
    let buttonClass = 'twitter-' + buttonType + '-button'

    if (buttonType && buttonType === 'share' && shareText) {
      element.setAttribute('data-text', shareText)
    }

    if (buttonType && (buttonType === 'mention' || buttonType === 'hashtag') && tweetText) {
      element.setAttribute('data-text', tweetText)
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

    let links = {
      share: 'https://twitter.com/share',
      follow: 'https://twitter.com/' + username,
      mention: 'https://twitter.com/intent/tweet?screen_name=' + username,
      hashtag: 'https://twitter.com/intent/tweet?button_hashtag=' + hashtagTopic
    }
    let buttonLink = links[ buttonType ]

    let defaultContent = {
      share: 'Tweet',
      follow: showUsername ? 'Follow @' + username : 'Follow',
      mention: 'Tweet to @' + username,
      hashtag: 'Tweet #' + hashtagTopic ? hashtagTopic.split('#').pop() : hashtagTopic
  }
    let buttonContent = defaultContent[buttonType]

    element.setAttribute('href', buttonLink)
    element.setAttribute('data-show-count', 'false')
    element.className = buttonClass
    element.innerHTML = buttonContent

    let elementWrapper = document.createElement('div')
    elementWrapper.appendChild(element)

    return elementWrapper.innerHTML
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, metaCustomId } = atts
    let classes = 'vce-tweet-button'
    let innerClasses = 'vce-tweet-button-inner'
    let wrapperClasses = 'vce-tweet-button-wrapper vce'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-tweet-button--align-${alignment}`
    }
    if (designOptions.device) {
      let animations = []
      Object.keys(designOptions.device).forEach((device) => {
        let prefix = (device === 'all') ? '' : device
        if (designOptions.device[ device ].animation) {
          if (prefix) {
            prefix = `-${prefix}`
          }
          animations.push(`vce-o-animate--${designOptions.device[ device ].animation}${prefix}`)
        }
      })
      if (animations.length) {
        customProps[ 'data-vce-animate' ] = animations.join(' ')
      }
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return <div {...customProps} className={classes} {...editor}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll}>
        <div className={innerClasses} />
      </div>
    </div>
  }
}
