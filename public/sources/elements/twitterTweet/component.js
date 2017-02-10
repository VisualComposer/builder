/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    let { tweetUrl, tweetTheme, width } = this.props.atts
    if (width) {
      this.checkCustomSize(width)
    }

    if (tweetUrl) {
      this.insertTwitter(tweetUrl, tweetTheme)
    }
  }

  componentWillReceiveProps (nextProps) {
    let { tweetUrl, tweetTheme } = this.props.atts
    let elementKey = `customProps:${this.props.id}-${tweetUrl}-${tweetTheme}`

    let nextAtts = nextProps.atts
    if (nextAtts.width) {
      this.checkCustomSize(nextAtts.width)
    } else {
      this.setState({
        size: null
      })
    }
    let nextElementKey = `customProps:${nextProps.id}-${nextAtts.tweetUrl}-${nextAtts.tweetTheme}`

    if (nextAtts.tweetUrl && elementKey !== nextElementKey) {
      this.insertTwitter(nextAtts.tweetUrl, nextAtts.tweetTheme)
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_twitterTweet_' + Component.unique++
    if (url.indexOf('?') >= 0) {
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
        this.props.api.request('layout:rendered', true)
      }
    )
  }

  appendTwitter (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-twitter-tweet-inner')
    this.updateInlineHtml(component, tagString)
  }

  checkCustomSize (width) {
    width = this.validateSize(width)
    width = /^\d+$/.test(width) ? width + 'px' : width
    let size = { width }
    this.setSizeState(size)
  }

  validateSize (value) {
    let units = [ 'px', 'em', 'rem', '%', 'vw', 'vh' ]
    let re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')
    if (value === '' || value.match(re)) {
      return value
    } else {
      return null
    }
  }

  setSizeState (size) {
    this.setState({ size })
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, alignment, width, metaCustomId } = atts
    let classes = 'vce-twitter-tweet'
    let wrapperClasses = 'vce-twitter-tweet-wrapper vce'
    let innerClasses = 'vce-twitter-tweet-inner'
    let customProps = {}
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-twitter-tweet--align-${alignment}`
    }

    if (width) {
      innerCustomProps.style = this.state ? this.state.size : null
    }

    customProps.key = `customProps:${id}`

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return <div {...customProps} className={classes} {...editor}>
      <div className={wrapperClasses} id={'el-' + id} {...doAll}>
        <div className={innerClasses} {...innerCustomProps} />
      </div>
    </div>
  }
}
