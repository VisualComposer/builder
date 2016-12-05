/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  static unique = 0
  tweetCount = '5'

  componentDidMount () {
    let { gridUrl, tweetCount, width } = this.props.atts
    if (!tweetCount) {
      tweetCount = this.tweetCount
    }

    if (width) {
      this.checkCustomSize(width)
    }

    if (gridUrl) {
      this.insertTwitter(gridUrl, tweetCount)
    }
  }

  componentWillReceiveProps (nextProps) {
    let { gridUrl, tweetCount } = this.props.atts
    if (!tweetCount) {
      tweetCount = this.tweetCount
    }
    let elementKey = `customProps:${this.props.id}-${gridUrl}-${tweetCount}`

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
    let nextElementKey = `customProps:${nextProps.id}-${nextAtts.gridUrl}-${nextAtts.tweetCount}`

    if (nextAtts.gridUrl && elementKey !== nextElementKey) {
      this.insertTwitter(nextAtts.gridUrl, nextAtts.tweetCount)
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_twitterGrid_' + Component.unique++
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

  insertTwitter (url, tweetCount) {
    let createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&limit=' + tweetCount + '&widget_type=grid'
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.appendTwitter(data.html)
      }
    )
  }

  appendTwitter (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-twitter-grid-inner')
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
    let { designOptions, customClass, alignment, width } = atts
    let classes = 'vce-twitter-grid'
    let innerClasses = 'vce-twitter-grid-inner'
    let wrapperClasses = 'vce-twitter-grid-wrapper vce'
    let customProps = {}
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-twitter-grid--align-${alignment}`
    }

    if (width) {
      innerCustomProps.style = this.state ? this.state.size : null
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

    return <div {...customProps} className={classes} {...editor}>
      <div className={wrapperClasses} id={'el-' + id}>
        <div className={innerClasses} {...innerCustomProps} />
      </div>
    </div>
  }
}
