/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  static unique = 0
  static imageSizes = {
    thumbnail: {
      height: '150',
      width: '150'
    },
    medium: {
      height: '300',
      width: '300'
    },
    large: {
      height: '1024',
      width: '1024'
    }
  }

  componentDidMount () {
    this.insertFlickr(this.props.atts.flickrUrl)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.atts.flickrUrl !== nextProps.atts.flickrUrl || this.props.atts.size !== nextProps.atts.size) {
      this.insertFlickr(nextProps.atts.flickrUrl)
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_flickrImage_' + Component.unique++
    if (url.indexOf('?') >= 0) {
      url += '&jsoncallback=' + name + '&format=json'
    } else {
      url += '?jsoncallback=' + name + '&format=json'
    }

    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src = url

    let clearScript = () => {
      document.head.removeChild(script)
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

  insertFlickr (url) {
    if (url.match('data-flickr-embed')) {
      this.appendFlickr(url)
    } else {
      let createdUrl = 'https://www.flickr.com/services/oembed/?url=' + url
      this.loadJSONP(
        createdUrl,
        (data) => {
          this.appendFlickr(data.html)
        }
      )
    }
  }

  appendFlickr (tagString = '') {
    const component = this.refs.flickerInner
    component.innerHTML = ''
    this.updateInlineHtml(component, tagString)
  }

  checkImageSize (size) {
    let relatedSize = ''
    if (window.vcvImageSizes && window.vcvImageSizes[ size ]) {
      relatedSize = window.vcvImageSizes[ size ]
    } else if (Component.imageSizes[ size ]) {
      relatedSize = Component.imageSizes[ size ]
    }
    return relatedSize
  }

  parseSize (size) {
    size = size.split('x')
    return { width: size[ 0 ], height: size[ 1 ] }
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, alignment, size } = atts
    let classes = 'vce-flickr-image'
    let customProps = {}
    let innerClasses = 'vce-flickr-image-inner vce'
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-flickr-image--align-${alignment}`
    }

    size = size.replace(/\s/g, '').replace(/px/g, '').toLowerCase()

    if (size && size.match(/\d*(x)\d*/)) {
      size = this.parseSize(size)
    } else if (size && size !== 'full') {
      size = this.checkImageSize(size)
    }

    if (size && size.width) {
      innerCustomProps.style = { width: `${size.width}px` }
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
      <div className={innerClasses} {...innerCustomProps} id={'el-' + id} ref='flickerInner' />
    </div>
  }
}
