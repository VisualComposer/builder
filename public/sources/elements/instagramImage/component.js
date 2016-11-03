/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  static unique = 0

  componentDidMount () {
    if (this.props.atts.size) {
      this.checkCustomSize(this.props.atts.size)
    }
    this.insertInstagram(this.props.atts.instagramUrl)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.size) {
      this.checkCustomSize(nextProps.atts.size)
    } else {
      this.setState({
        imgSize: null
      })
    }

    if (this.props.atts.instagramUrl !== nextProps.atts.instagramUrl) {
      this.insertInstagram(nextProps.atts.instagramUrl)
    }
  }

  checkCustomSize (size) {
    size = size.toLowerCase()

    if (size.match(/\d*/)[0] === '') {
      switch (size) {
        case 'thumbnail':
          size = 150
          break
        case 'medium':
          size = 300
          break
        case 'large':
          size = 660
          break
        case 'full':
          size = ''
          break
        default:
          size = ''
      }
    }
    this.setSizeState(size)
  }

  setSizeState (size) {
    this.setState({
      imgSize: {
        maxWidth: size + 'px'
      }
    })
  }

  updateInstagramHtml (tagString = '') {
    const component = this.getDomNode().querySelector('.vce-instagram-image-inner')
    component.innerHTML = ''

    if (this.props.editor) {
      let range = document.createRange()
      let documentFragment = range.createContextualFragment(tagString)
      component.appendChild(documentFragment)

      let iframe = document.querySelector('#vcv-editor-iframe').contentWindow
      if (iframe && iframe.instgrm && iframe.instgrm.Embeds ) {
        iframe.instgrm.Embeds.process()
      }
    } else {
      component.innerHTML = tagString
    }
  }

  loadJSONP (url, callback, context) {
    let name = '_jsonp_instagramImage_' + Component.unique++
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

  insertInstagram (url) {
    let createdUrl = 'https://api.instagram.com/oembed/?url=' + url
    this.loadJSONP(
      createdUrl,
      (data) => {
        this.updateInstagramHtml(data.html)
      }
    )
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions, customClass, size, alignment } = atts
    let classes = 'vce-instagram-image vce'
    let customProps = {}
    let innerClasses = 'vce-instagram-image-inner'
    let innerCustomProps = {}

    if (typeof customClass === 'string' && customClass) {
      classes += ' ' + customClass
    }

    if (typeof size === 'string' && size) {
      innerCustomProps.style = this.state ? this.state.imgSize : null
    }

    if (alignment) {
      classes += ` vce-instagram-image--align-${alignment}`
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
      innerClasses += ' vce-instagram-image-disabled'
    }

    return <div {...customProps} className={classes} id={'el-' + id} {...editor}>
      <div className={innerClasses} {...innerCustomProps} />
    </div>
  }
}
