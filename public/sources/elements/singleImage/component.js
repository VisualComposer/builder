/* global React, vcvAPI */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  constructor(props) {
    super(props);
    this.setSize = this.setSize.bind(this)
    this.setCustomSizeState = this.setCustomSizeState.bind(this)
    this.setMaxWidthState = this.setMaxWidthState.bind(this)
  }
  componentDidMount () {
    if (this.props.atts.shape && this.props.atts.shape === 'round' && this.props.atts.size) {
      this.checkCustomSize(this.props.atts.image, this.props.atts.size, true)
    } else if (this.props.atts.shape && this.props.atts.shape === 'round') {
      this.checkImageSize(this.props.atts.image, this.setMaxWidthState)
    } else if (this.props.atts.size) {
      this.checkCustomSize(this.props.atts.image, this.props.atts.size, false)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.shape && nextProps.atts.shape === 'round' && nextProps.atts.size) {
      this.checkCustomSize(nextProps.atts.image, nextProps.atts.size, true)
    } else if (nextProps.atts.shape && nextProps.atts.shape === 'round') {
      this.checkImageSize(nextProps.atts.image, this.setMaxWidthState)
    } else if (nextProps.atts.size) {
      this.checkCustomSize(nextProps.atts.image, nextProps.atts.size, false)
    } else {
      this.setState({
        imgSize: null
      })
    }
  }

  render () {
    let { id, atts, editor } = this.props
    let { image, designOptions, shape, clickableOptions, imageUrl, customClass, size, alignment } = atts
    let containerClasses = 'vce-single-image-container vce'
    let classes = 'vce-single-image'
    let customProps = {}
    let CustomTag = 'div'

    var imgSrc = this.getImageUrl(image)
    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }
    if (clickableOptions === 'url') {
      CustomTag = 'a'
      let { url, title, targetBlank, relNofollow } = imageUrl
      customProps = {
        'href': url,
        'title': title,
        'target': targetBlank ? '_blank' : undefined,
        'rel': relNofollow ? 'nofollow' : undefined
      }
    } else if (clickableOptions === 'imageNewTab') {
      CustomTag = 'a'
      customProps = {
        'href': imgSrc,
        'target': '_blank'
      }
    } else if (clickableOptions === 'lightbox') {
      CustomTag = 'a'
      customProps = {
        'href': imgSrc,
        'data-lightbox': `lightbox-${id}`
      }
    } else if (clickableOptions === 'zoom') {
      classes += ' vce-single-image-zoom-container'
    }

    if (shape && shape !== 'square') {
      classes += ` vce-single-image--border-${shape}`

      if (shape === 'round') {
        customProps.style = this.state ? this.state.imgSize : null
      }
    }

    if (alignment) {
      classes += ` vce-single-image--align-${alignment}`
    }

    if (typeof size === 'string' && size) {
      customProps.style = this.state ? this.state.imgSize : null
      size = size.toLowerCase().split(' ').join('')

      if (size === 'thumbnail') {
        classes += ' vce-single-image--size-thumbnail'
      } else if (size.match(/\d*(x)\d*/)) {
        classes += ' vce-single-image--size-custom'
      }
    }

    customProps.key = `customProps:${id}-${imgSrc}-${clickableOptions}-${shape}-${size}`

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
    return <div className={containerClasses} id={'el-' + id} {...editor}>
      <CustomTag {...customProps} className={classes}>
        <img className='vce-single-image' src={imgSrc} />
      </CustomTag>
    </div>
  }

  setMaxWidthState (size, image) {
    if (size) {
      this.setSize(size.height >= size.width ? size.width : size.height, image, true)
    } else {
      this.setState({ imgSize: null })
    }
  }

  checkImageSize (image, callback) {
    let img = new window.Image()
    img.onload = () => {
      let size = {
        width: img.width,
        height: img.height
      }
      callback(size, image)
    }
    img.onerror = () => {
      callback(null)
    }
    img.src = this.getImageUrl(image)
  }

  checkCustomSize (image, size, round) {
    size = size.toLowerCase().split(' ').join('')

    if (size.match(/\d*(x)\d*/)) {
      size = size.split('x')
      size = {
        width: size[0],
        height: size[1]
      }
      this.setCustomSize(size, image)
    } else {
      switch (size) {
        case 'thumbnail':
          size = 150
          round = true
          break
        case 'medium':
          size = 300
          break
        case 'large':
          size = 660
          break
        case 'full':
          size = 'auto'
          break
        default:
          size = 'auto'
      }
      this.setSize(size, image, round)
    }
  }

  setCustomSize (size, image) {
    this.setState({
      customSize: size
    })
    if (size && size.height && size.width) {
      this.checkImageSize(image, this.setCustomSizeState)
    }
  }

  setCustomSizeState (size, image) {
    let imgSrc = this.getImageUrl(image)
    let customSize = this.state.customSize
    let imgSize = size

    let currentSize = {
      height: customSize.height >= imgSize.height ? imgSize.height : customSize.height,
      width: customSize.width >= imgSize.width ? imgSize.width : customSize.width
    }

    this.setState({
      imgSize: {
        height: currentSize.height + 'px',
        maxWidth: currentSize.width + 'px',
        backgroundImage: 'url(' + imgSrc + ')'
      }
    })
  }

  setSize (size, image, round) {
    let imgSrc = this.getImageUrl(image)

    if (round && size === 'auto') {
      this.checkImageSize(image, this.setMaxWidthState)
    } else if (size === 'auto') {
      this.setState({
        imgSize: null
      })
    } else {
      this.setState({
        imgSize: {
          maxWidth: size + 'px',
          backgroundImage: round ? 'url(' + imgSrc + ')' : null
        }
      })
    }
  }

  getPublicImage (filename) {
    const vcCake = require('vc-cake')
    let assetsManager
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      assetsManager = vcCake.getService('wip-assets-manager')
    } else {
      assetsManager = vcCake.getService('assets-manager')
    }
    var { tag } = this.props.atts
    return assetsManager.getPublicPath(tag, filename)
  }

  getImageUrl (image) {
    let imageUrl
    // Move it to attribute
    if (image && image.full) {
      imageUrl = image.full
    } else {
      imageUrl = this.getPublicImage(image)
    }
    return imageUrl
  }
}
