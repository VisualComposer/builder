/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  static unique = 0
  tweetCount = '5'

  componentDidMount () {
    let { timelineUrl, tweetCount, tweetTheme, width } = this.props.atts
    if (!tweetCount) {
      tweetCount = this.tweetCount
    }

    if (width) {
      this.checkCustomSize(width)
    }

    if (timelineUrl) {
      this.insertTwitter(timelineUrl, tweetCount, tweetTheme)
    }
  }

  componentWillReceiveProps (nextProps) {
    let { timelineUrl, tweetCount, tweetTheme } = this.props.atts
    if (!tweetCount) {
      tweetCount = this.tweetCount
    }
    let elementKey = `customProps:${this.props.id}-${timelineUrl}-${tweetCount}-${tweetTheme}`

    let nextAtts = nextProps.atts
    if (!nextAtts.tweetCount) {
      nextAtts.tweetCount = this.tweetCount
    }
    if (nextAtts.width) {
      this.checkCustomSize(nextAtts.width)
    } else {
      this.setState({
        size: null
      })
    }
    let nextElementKey = `customProps:${nextProps.id}-${nextAtts.timelineUrl}-${nextAtts.tweetCount}-${nextAtts.tweetTheme}`

    if (nextAtts.timelineUrl && elementKey !== nextElementKey) {
      this.insertTwitter(nextAtts.timelineUrl, nextAtts.tweetCount, nextAtts.tweetTheme)
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_twitterTimeline_' + Component.unique++
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

  insertTwitter (url, tweetCount, tweetTheme) {
    let createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&theme=' + tweetTheme + '&limit=' + tweetCount + '&widget_type=timeline'
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.appendTwitter(data.html)
        this.props.api.request('layout:rendered', true)
      }
    )
  }

  appendTwitter (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-twitter-timeline-inner')
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
    let { designOptions, customClass, alignment, width, metaCustomId } = atts
    let classes = 'vce-twitter-timeline'
    let wrapperClasses = 'vce-twitter-timeline-wrapper vce'
    let innerClasses = 'vce-twitter-timeline-inner'
    let customProps = {}
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-twitter-timeline--align-${alignment}`
    }

    if (width) {
      innerCustomProps.style = this.state ? this.state.size : null
    }

    customProps.key = `customProps:${id}`

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
        <div className={innerClasses} {...innerCustomProps} />
      </div>
    </div>
  }
}
