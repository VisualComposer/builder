import React from 'react'
import vcCake from 'vc-cake'
import { isEqual } from 'lodash'

const vcvAPI = vcCake.getService('api')

export default class TwitterTimeline extends vcvAPI.elementComponent {
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

  componentDidUpdate (prevProps) {
    if (!isEqual(prevProps.atts, this.props.atts)) {
      let { timelineUrl, tweetCount, tweetTheme } = prevProps.atts
      if (!tweetCount) {
        tweetCount = this.tweetCount
      }
      const elementKey = `customProps:${prevProps.id}-${timelineUrl}-${tweetCount}-${tweetTheme}`

      const nextAtts = this.props.atts
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
      const nextElementKey = `customProps:${this.props.id}-${nextAtts.timelineUrl}-${nextAtts.tweetCount}-${nextAtts.tweetTheme}`

      if (nextAtts.timelineUrl && elementKey !== nextElementKey) {
        this.insertTwitter(nextAtts.timelineUrl, nextAtts.tweetCount, nextAtts.tweetTheme)
      }
    }
  }

  loadJSONP (url, callback, context) {
    const name = '_jsonp_twitterTimeline_' + TwitterTimeline.unique++
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

  insertTwitter (url, tweetCount, tweetTheme) {
    const createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&theme=' + tweetTheme + '&limit=' + tweetCount + '&widget_type=timeline'
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
    let classes = 'vce-twitter-timeline'
    const wrapperClasses = 'vce-twitter-timeline-wrapper vce'
    const innerClasses = 'vce-twitter-timeline-inner'
    const customProps = {}
    const innerCustomProps = {}

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
