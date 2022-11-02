import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')

export default class FlickrImage extends vcvAPI.elementComponent {
  static unique = 0
  imageSizes = {
    thumbnail: '150',
    medium: '300',
    large: '1024'
  }

  constructor (props) {
    super(props)
    this.flickerInner = React.createRef()
    const _ = require('lodash')
    this.handleResize = _.debounce(this.handleResize.bind(this), 200)
  }

  componentDidMount () {
    this.insertFlickr(this.props.atts.flickrUrl)
    window.addEventListener('resize', this.handleResize)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.handleResize)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.atts.flickrUrl !== this.props.atts.flickrUrl || prevProps.atts.width !== this.props.atts.width) {
      this.insertFlickr(this.props.atts.flickrUrl)
    }
  }

  handleResize () {
    this.insertFlickr(this.props.atts.flickrUrl)
  }

  loadJSONP (url, callback, context) {
    const name = '_jsonp_flickrImage_' + FlickrImage.unique++
    if (url.indexOf('?') >= 0) {
      url += '&jsoncallback=' + name + '&format=json'
    } else {
      url += '?jsoncallback=' + name + '&format=json'
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url

    const clearScript = () => {
      document.head.removeChild(script)
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

  insertFlickr (url) {
    if (url.match('data-flickr-embed')) {
      this.appendFlickr(url)
    } else {
      const createdUrl = 'https://www.flickr.com/services/oembed/?url=' + url
      this.loadJSONP(
        createdUrl,
        (data) => {
          this.appendFlickr(data.html)
          this.props.api.request('layout:rendered', true)
        }
      )
    }
  }

  appendFlickr (tagString = '') {
    this.flickerInner.current.innerHTML = ''
    window.setTimeout(() => {
      this.updateInlineHtml(this.flickerInner.current, tagString)
    }, 0)
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

  checkImageSize (size) {
    let relatedSize = ''
    if (window.vcvImageSizes && window.vcvImageSizes[size]) {
      relatedSize = window.vcvImageSizes[size].width
    } else if (this.imageSizes[size]) {
      relatedSize = this.imageSizes[size]
    }
    return relatedSize ? `${relatedSize}px` : ''
  }

  render () {
    const { id, atts, editor } = this.props
    let { customClass, alignment, width, metaCustomId, extraDataAttributes } = atts
    let classes = 'vce-flickr-image'
    const wrapperClasses = 'vce vce-flickr-image-wrapper'
    const customProps = this.getExtraDataAttributes(extraDataAttributes)
    const innerClasses = 'vce-flickr-image-inner'
    const innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-flickr-image--align-${alignment}`
    }

    width = width.replace(/\s/g, '').toLowerCase()

    if (width) {
      if (width.match(/\d*/)[0]) {
        width = this.validateSize(width)
        width = /^\d+$/.test(width) ? `${width}px` : width
      } else {
        width = this.checkImageSize(width)
      }
      innerCustomProps.style = { maxWidth: width }
    }

    customProps.key = `customProps:${id}`

    if (metaCustomId) {
      customProps.id = metaCustomId
    }
    const content = null

    const doAll = this.applyDO('all')

    return (
      <div {...customProps} className={classes} {...editor}>
        <div id={'el-' + id} className={wrapperClasses} {...doAll}>
          <div className={innerClasses} {...innerCustomProps} ref={this.flickerInner} />
          {content}
        </div>
      </div>
    )
  }
}
