/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    let atts = this.props.atts

    if (atts.tweetUrl) {
      this.insertTwitter(
        atts.tweetUrl,
        atts.tweetTheme && atts.customOptions ? atts.tweetTheme : ''
      )
    }
  }

  componentWillReceiveProps (nextProps) {
    let nextAtts = nextProps.atts
    let atts = this.props.atts

    if ((atts.tweetUrl !== nextAtts.tweetUrl || atts.tweetTheme !== nextAtts.tweetTheme || atts.customOptions !== nextAtts.customOptions) && nextAtts.tweetUrl) {
      this.insertTwitter(
        nextAtts.tweetUrl,
        nextAtts.tweetTheme && nextAtts.customOptions ? nextAtts.tweetTheme : ''
      )
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_twitterTweet_' + Component.unique++
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
    }, timeout * 1000)

    window[ name ] = function (data) {
      window.clearTimeout(timeoutTrigger)
      callback.call((context || window), data)
      clearScript()
    }

    document.getElementsByTagName('head')[ 0 ].appendChild(script)
  }

  insertTwitter (url, tweetTheme) {
    let createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&theme=' + tweetTheme + '&widget_type=tweet'
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.appendTwitter(data.html)
      }
    )
  }

  appendTwitter (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-twitter-tweet-inner')
    component.innerHTML = ''

    if (this.props.editor) {
      let range = document.createRange()
      let documentFragment = range.createContextualFragment(tagString)
      component.appendChild(documentFragment)
    } else {
      component.innerHTML = tagString
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, width, customOptions } = atts
    let classes = 'vce-twitter-tweet vce'

    let customProps = {}
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment && customOptions) {
      classes += ` vce-twitter-tweet--align-${alignment}`
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

    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <div className='vce-twitter-tweet-inner' {...innerCustomProps} />
    </div>
  }
}
