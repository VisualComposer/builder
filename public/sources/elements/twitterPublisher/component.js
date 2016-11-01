/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    let atts = this.props.atts

    if (atts.twitterOptions && atts[atts.twitterOptions + 'Url']) {
      this.insertTwitter(
        atts[atts.twitterOptions + 'Url'],
        atts.twitterOptions,
        atts.tweetCount && atts.customOptions ? atts.tweetCount : '',
        atts.tweetTheme && atts.customOptions ? atts.tweetTheme : ''
      )
    } else {
      this.appendButton(
        atts.buttonType,
        atts.tweetText,
        atts.tweetAccount,
        atts.tweetButtonSize
      )
    }
  }

  componentWillReceiveProps (nextProps) {
    let nextAtts = nextProps.atts

    // TODO check if this.props.atts === nextProps.atts
    // if (this.props.atts[this.props.atts.twitterOptions + 'Url'] !== nextAtts[nextAtts.twitterOptions + 'Url']) {}

    if (nextAtts.twitterOptions && nextAtts[nextAtts.twitterOptions + 'Url']) {
      this.insertTwitter(
        nextAtts[nextAtts.twitterOptions + 'Url'],
        nextAtts.twitterOptions,
        nextAtts.tweetCount && nextAtts.customOptions ? nextAtts.tweetCount : '',
        nextAtts.tweetTheme && nextAtts.customOptions ? nextAtts.tweetTheme : ''
      )
    } else {
      this.appendButton(
        nextAtts.buttonType,
        nextAtts.tweetText,
        nextAtts.tweetAccount,
        nextAtts.tweetButtonSize
      )
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_twitterPublisher_' + Component.unique++
    if (url.match(/\?/)) {
      url += '&callback=' + name
    } else {
      url += '?callback=' + name
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url

    let clearScript = () => {
      document.getElementsByTagName('head')[ 0 ].removeChild(script)
      script = null
      delete window[ name ]
    }

    let timeout = 10 // 10 second by default
    let timeoutTrigger = window.setTimeout(() => {
      clearScript()
      this.onTwitterTimeout()
    }, timeout * 1000)

    window[ name ] = function (data) {
      window.clearTimeout(timeoutTrigger)
      callback.call((context || window), data)
      clearScript()
    }

    document.getElementsByTagName('head')[ 0 ].appendChild(script)
  }

  onTwitterTimeout () {
    console.log("errorrrr")
  }

  insertTwitter (url, widgetType, tweetCount, theme, buttonType) {
    let createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&theme=' + theme + '&limit=' + tweetCount + '&widget_type=' + widgetType
    console.log(createdUrl)
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.appendTwitter(data.html)
      }
    )
  }

  appendTwitter (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-twitter-publisher-inner')
    component.innerHTML = ''

    if (this.props.editor) {
      let range = document.createRange()
      let documentFragment = range.createContextualFragment(tagString)
      component.appendChild(documentFragment)
    } else {
      component.innerHTML = tagString
    }
  }

  appendButton (type, tweetText, account, buttonSize) {
    let tagString = ''

    if (type === 'share') {
      tagString = '<a href="https://twitter.com/share" class="twitter-share-button" data-text="' + tweetText + '" data-show-count="false">Tweet</a>'
    } else if (type === 'follow') {

    }



    tagString += '<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>'

    const component = this.getDomNode().querySelector('.vce-twitter-publisher-inner')
    component.innerHTML = ''
    let range = document.createRange()
    let documentFragment = range.createContextualFragment(tagString)
    component.appendChild(documentFragment)
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, twitterOptions, gridUrl, tweetUrl, timelineUrl, width, customOptions } = atts
    let classes = 'vce-twitter-publisher vce'
    let innerClasses = 'vce-twitter-publisher-inner'
    let customProps = {}
    let innerCustomProps = {}
    let twitterButtonProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment && customOptions) {
      classes += ` vce-twitter-publisher--align-${alignment}`
    }

    if (width && customOptions) {
      innerCustomProps.style = { maxWidth: width + 'px' }
    }

    customProps.key = `customProps:${id}`

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

    let errorHtml = ''

    // if (this.state && this.state.twitterError) {
    //   errorHtml = (
    //     <div className="vce-twitter-publisher-error">Errrrrooooorrrrrrrrr</div>
    //   )
    // }

    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <div className={innerClasses} {...innerCustomProps} />
    </div>
  }
}
