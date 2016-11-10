/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertTwitterJs(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    let { tweetText, tweetAccount, tweetButtonSize, buttonType, username, showUsername } = this.props.atts
    let elementKey = `customProps:${this.props.id}-${buttonType}-${tweetText}-${tweetAccount}-${tweetButtonSize}-${username}-${showUsername}`

    let nextAtts = nextProps.atts
    let nextElementKey = `customProps:${nextProps.id}-${nextAtts.buttonType}-${nextAtts.tweetText}-${nextAtts.tweetAccount}-${nextAtts.tweetButtonSize}-${nextAtts.username}-${nextAtts.showUsername}`

    if (elementKey !== nextElementKey) {
      this.insertTwitterJs(nextProps.atts)
    }
  }

  insertTwitterJs (props) {
    let tag = this.createElementTag(props)
    let twitterScript = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
    twitterScript = tag + twitterScript

    const component = this.getDomNode().querySelector('.vce-tweet-button-inner')
    component.innerHTML = ''

    if (this.props.editor) {
      let range = document.createRange()
      let documentFragment = range.createContextualFragment(twitterScript)
      component.appendChild(documentFragment)
    } else {
      component.innerHTML = twitterScript
    }
  }

  createElementTag (props) {
    let element = document.createElement('a')

    let { tweetText, tweetAccount, tweetButtonSize, buttonType, username, showUsername } = props
    let buttonClass = 'twitter-' + buttonType + '-button'

    if (buttonType && buttonType !== 'follow' && tweetText) {
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
      username = username.split('@').pop().split('https://twitter.com/').pop()
      username = username.replace(/\s+/g, '')
    }

    if (buttonType && buttonType === 'follow') {
      element.setAttribute('data-show-screen-name', showUsername.toString())
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
    let { designOptions, customClass, alignment } = atts
    let classes = 'vce-tweet-button vce'
    let innerClasses = 'vce-tweet-button-inner'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-tweet-button--align-${alignment}`
    }
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
      <div className={innerClasses} />
    </div>
  }
}
