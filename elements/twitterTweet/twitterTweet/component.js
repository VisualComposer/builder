import React from 'react'
import vcCake from 'vc-cake'
import { isEqual } from 'lodash'

const vcvAPI = vcCake.getService('api')

export default class TwitterTweet extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    const { tweetUrl, tweetTheme, width } = this.props.atts
    if (width) {
      this.checkCustomSize(width)
    }

    if (tweetUrl) {
      this.insertTwitter(tweetUrl, tweetTheme)
    }
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(this.props.atts, prevProps.atts)) {
      const { tweetUrl, tweetTheme } = prevProps.atts
      const elementKey = `customProps:${prevProps.id}-${tweetUrl}-${tweetTheme}`

      const nextAtts = this.props.atts
      if (nextAtts.width) {
        this.checkCustomSize(nextAtts.width)
      } else {
        this.setState({
          size: null
        })
      }
      const nextElementKey = `customProps:${this.props.id}-${nextAtts.tweetUrl}-${nextAtts.tweetTheme}`

      if (nextAtts.tweetUrl && elementKey !== nextElementKey) {
        this.insertTwitter(nextAtts.tweetUrl, nextAtts.tweetTheme)
      }
    }
  }

  loadJSONP (url, callback, context) {
    const name = '_jsonp_twitterTweet_' + TwitterTweet.unique++
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

  insertTwitter (url, tweetTheme) {
    const createdUrl = 'https://publish.twitter.com/oembed.json?url=' + url + '&theme=' + tweetTheme + '&widget_type=tweet'
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
    const { customClass, alignment, width, metaCustomId, extraDataAttributes } = atts
    let classes = 'vce-twitter-tweet'
    const wrapperClasses = 'vce-twitter-tweet-wrapper vce'
    const innerClasses = 'vce-twitter-tweet-inner'
    const customProps = this.getExtraDataAttributes(extraDataAttributes)
    const innerCustomProps = {}

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
