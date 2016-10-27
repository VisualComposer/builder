/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  componentDidMount () {
    this.insertTwitterJs()
  }

  componentWillReceiveProps (nextProps) {
    this.insertTwitterJs()
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, tweetText, tweetAccount, tweetButtonSize } = atts
    let classes = 'vce-tweet-button vce'
    let innerClasses = 'vce-tweet-button-inner'
    let customProps = {}
    let twitterButtonProps = {
      'data-show-count': 'false'
    }

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-tweet-button--align-${alignment}`
    }

    if (tweetText) {
      twitterButtonProps['data-text'] = tweetText
    }

    if (tweetAccount) {
      twitterButtonProps['data-via'] = tweetAccount
    }

    if (tweetButtonSize && tweetButtonSize === 'large') {
      twitterButtonProps['data-size'] = tweetButtonSize
    }

    customProps.key = `customProps:${id}-${tweetText}-${tweetAccount}-${tweetButtonSize}`

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


    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <div className={innerClasses}>
        <a href='https://twitter.com/share' className='twitter-share-button' {...twitterButtonProps}>Tweet</a>
      </div>
    </div>
  }

  insertTwitterJs () {
    let twitterScript= '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>'
    const component = this.getDomNode()
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(twitterScript)
    component.appendChild(documentFragment)
  }
}
