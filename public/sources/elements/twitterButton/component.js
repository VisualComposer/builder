/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertTwitterJs()
  }

  componentWillReceiveProps (nextProps) {
    this.insertTwitterJs()
  }

  insertTwitterJs () {
    let twitterScript = '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>'
    const component = this.getDomNode().querySelector('.vce-tweet-button-script')
    component.innerHTML = ''

    if (this.props.editor) {
      let range = document.createRange()
      let documentFragment = range.createContextualFragment(twitterScript)
      component.appendChild(documentFragment)
    } else {
      component.innerHTML = twitterScript
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, tweetText, tweetAccount, tweetButtonSize, buttonType, username, showUsername } = atts
    let classes = 'vce-tweet-button vce'
    let innerClasses = 'vce-tweet-button-inner'
    let customProps = {}
    let twitterButtonProps = {
      'data-show-count': 'false'
    }

    let buttonClass = 'twitter-' + buttonType + '-button'

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-tweet-button--align-${alignment}`
    }

    if (buttonType && buttonType !== 'follow' && tweetText) {
      twitterButtonProps['data-text'] = tweetText
    }

    if (buttonType && buttonType === 'share' && tweetAccount) {
      tweetAccount = tweetAccount.split('@').pop()
      twitterButtonProps['data-via'] = tweetAccount
    }

    if (tweetButtonSize && tweetButtonSize === 'large') {
      twitterButtonProps['data-size'] = tweetButtonSize
    }

    if (username) {
      username = username.split('@').pop()
      username = username.split('https://twitter.com/').pop()
    }

    if (buttonType && buttonType === 'follow') {
      twitterButtonProps['data-show-screen-name'] = showUsername.toString()
    }

    let links = {
      share: 'https://twitter.com/share',
      follow: 'https://twitter.com/' + username,
      mention: 'https://twitter.com/intent/tweet?screen_name=' + username,
      hashtag: 'https://twitter.com/intent/tweet?button_hashtag=' + username
    }
    let buttonLink = links[buttonType]

    let defaultContent = {
      share: 'Tweet',
      follow: showUsername ? 'Follow @' + username : 'Follow',
      mention: 'Tweet to @' + username,
      hashtag: 'Tweet #' + username
    }
    let buttonContent = defaultContent[buttonType]

    customProps.key = `customProps:${id}-${buttonType}-${tweetText}-${tweetAccount}-${tweetButtonSize}-${username}-${showUsername}`

    let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
    let animations = []
    devices.forEach((device) => {
      let prefix = designOptions.visibleDevices[ device ]
      if (designOptions[ device ].animation) {
        if (prefix) {
          prefix = `-${prefix}`
        }
        animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
      }
    })
    if (animations.length) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }

    if (editor) {
      innerClasses += ' vce-tweet-button-disabled'
    }

    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <div className={innerClasses}>
        <a href={buttonLink} className={buttonClass} {...twitterButtonProps}>{buttonContent}</a>
        <div className='vce-tweet-button-script' />
      </div>
    </div>
  }
}
