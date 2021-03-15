import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class TwitterGrid extends vcvAPI.elementComponent {
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

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
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

  /* eslint-enable */

  loadJSONP (url, callback, context) {
    const name = '_jsonp_twitterGrid_' + TwitterGrid.unique++
    if (url.indexOf('?') >= 0) {
      url += '&callback=' + name
    } else {
      url += '?callback=' + name
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url

    const clearScript = () => {
      document.getElementsByTagName('head')[0].removeChild(script)
      script = null
      delete window[name]
    }

    const timeout = 10 // 10 second by default
    const timeoutTrigger = window.setTimeout(() => {
      clearScript()
    }, timeout * 1000)

    window[name] = function (data) {
      window.clearTimeout(timeoutTrigger)
      callback.call((context || window), data)
      clearScript()
    }

    document.getElementsByTagName('head')[0].appendChild(script)
  }

  insertTwitter (url, tweetCount) {
    const createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&limit=' + tweetCount + '&widget_type=grid'
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.appendTwitter(data.html)
        this.props.api.request('layout:rendered', true)
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
    const size = { width }
    this.setSizeState(size)
  }

  validateSize (value) {
    const units = ['px', 'em', 'rem', '%', 'vw', 'vh']
    const re = new RegExp('^-?\\d*(\\.\\d{0,9})?(' + units.join('|') + ')?$')
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
    const { id, atts, editor } = this.props
    const { customClass, alignment, width, metaCustomId } = atts
    let classes = 'vce-twitter-grid'
    const innerClasses = 'vce-twitter-grid-inner'
    const wrapperClasses = 'vce-twitter-grid-wrapper vce'
    const customProps = {}
    const innerCustomProps = {}

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

    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div {...customProps} className={classes} {...editor}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll}>
          <div className={innerClasses} {...innerCustomProps} />
        </div>
      </div>
    )
  }
}
