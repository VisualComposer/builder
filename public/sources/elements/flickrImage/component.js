/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    this.insertFlickr(this.props.atts.flickrUrl)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.atts.flickrUrl !== nextProps.atts.flickrUrl) {
      this.insertFlickr(nextProps.atts.flickrUrl)
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_flickrImage_' + Component.unique++
    if (url.match(/\?/)) {
      url += '&jsoncallback=' + name + '&format=json'
    } else {
      url += '?jsoncallback=' + name + '&format=json'
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

  insertFlickr (url) {
    let createdUrl = 'http://www.flickr.com/services/oembed/?url=' + url
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.appendFlickr(data.html)
      }
    )
  }

  appendFlickr (tagString = '') {
    const component = this.getDomNode()
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
    let { designOptions, customClass, alignment } = atts
    let classes = 'vce-flickr-image vce'
    let customProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (alignment) {
      classes += ` vce-flickr-image--align-${alignment}`
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

    if (editor) {
      classes += ' vce-flickr-image-disabled'
    }

    return <div {...customProps} className={classes} id={'el-' + id} {...editor} />
  }
}
