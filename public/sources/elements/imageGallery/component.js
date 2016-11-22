/* global React, vcvAPI, vcCake */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
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

  constructor (props) {
    super(props)
    this.getCustomSizeImage = this.getCustomSizeImage.bind(this)
    this.insertImage = this.insertImage.bind(this)
    this.setCustomSizeState = this.setCustomSizeState.bind(this)
  }

  componentDidMount () {
    if (this.props.atts.size === 'full' && this.props.atts.shape !== 'round') {
      return true
    }
    if (this.props.atts.image && !this.props.atts.image.id) {
      if (this.props.atts.size) {
        if (this.props.atts.size.match(/\d*(x)\d*/)) {
          this.setCustomSizeState(this.props.atts.image, this.props.atts.size, this.props.atts.shape === 'round')
        } else if (this.props.atts.size === 'full') {
          this.checkImageSize(this.props.atts.image, this.setCustomSizeState, this.props.atts.shape === 'round')
        } else {
          this.setCustomSizeState(this.props.atts.image, this.checkRelatedSize(this.props.atts.size), this.props.atts.shape === 'round')
        }
      } else {
        this.checkImageSize(this.props.atts.image, this.setCustomSizeState, this.props.atts.shape === 'round')
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.atts.size === 'full' && nextProps.atts.shape !== 'round') {
      this.setState({
        imgSize: null
      })
      return true
    }
    if (nextProps.atts.image && !nextProps.atts.image.id) {
      if (nextProps.atts.size) {
        if (nextProps.atts.size.match(/\d*(x)\d*/)) {
          this.setCustomSizeState(nextProps.atts.image, nextProps.atts.size, nextProps.atts.shape === 'round')
        } else if (nextProps.atts.size === 'full') {
          this.checkImageSize(nextProps.atts.image, this.setCustomSizeState, nextProps.atts.shape === 'round')
        } else {
          this.setCustomSizeState(nextProps.atts.image, this.checkRelatedSize(nextProps.atts.size), nextProps.atts.shape === 'round')
        }
      } else {
        this.checkImageSize(nextProps.atts.image, this.setCustomSizeState, nextProps.atts.shape === 'round')
      }
    } else {
      this.setState({
        imgSize: null
      })
    }
  }

  checkImageSize (image, callback, isRound, size, originalSrc) {
    let img = new window.Image()
    img.onload = () => {
      let size = {
        width: img.width,
        height: img.height
      }
      callback(image, size, isRound, originalSrc)
    }
    img.src = this.getImageUrl(image, size)
  }

  getPublicImage (filename) {
    let assetsManager
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      assetsManager = vcCake.getService('wipAssetsManager')
    } else {
      assetsManager = vcCake.getService('assets-manager')
    }
    var { tag } = this.props.atts
    return assetsManager.getPublicPath(tag, filename)
  }

  getImageUrl (image, size) {
    let imageUrl
    // Move it to attribute
    if (size && image && image[ size ]) {
      imageUrl = image[ size ]
    } else {
      if (image && image.full) {
        imageUrl = image.full
      } else {
        imageUrl = this.getPublicImage(image)
      }
    }
    return imageUrl
  }

  parseSize (size, isRound) {
    if (typeof size === 'string') {
      size = size.split('x')
    } else if (typeof size === 'object') {
      size = [ size.width, size.height ]
    }

    if (isRound) {
      let smallestSize = size[ 0 ] >= size[ 1 ] ? size[ 1 ] : size[ 0 ]
      size = {
        width: smallestSize,
        height: smallestSize
      }
    } else {
      size = {
        width: size[ 0 ],
        height: size[ 1 ]
      }
    }
    return size
  }

  getCustomSizeImage (image, size, isRound, originalSrc) {
    let id = image.id
    size = this.parseSize(size, isRound)
    vcCake.getService('dataProcessor').appServerRequest({
      'vcv-action': 'elements:imageController:customSize:adminNonce',
      'vcv-image-id': id,
      'vcv-size': size.width + 'x' + size.height,
      'vcv-nonce': window.vcvNonce
    }).then((data) => {
      let imageData = JSON.parse(data)
      this.insertImage(imageData.img.imgUrl, originalSrc)
    })
  }

  insertImage (imgSrc, originalSrc) {
    let img = new window.Image()
    img.onload = () => {
      this.refs.imageContainer.innerHTML = ''
      this.refs.imageContainer.appendChild(img)
      vcCake.env('iframe').vcv.trigger('singleImageReady')
      if (this.props.atts.shape === 'round') {
        this.refs.imageContainer.classList.add('vce-image-gallery--border-round')
      } else {
        this.refs.imageContainer.classList.remove('vce-image-gallery--border-round')
      }
    }
    img.src = imgSrc
    img.setAttribute('data-img-src', originalSrc)
    img.className = 'vce-image-gallery'
  }

  checkRelatedSize (size) {
    let relatedSize = ''
    if (window.vcvImageSizes && window.vcvImageSizes[ size ]) {
      relatedSize = window.vcvImageSizes[ size ]
    } else if (Component.imageSizes[ size ]) {
      relatedSize = Component.imageSizes[ size ]
    }
    return relatedSize
  }

  setCustomSizeState (image, size, isRound) {
    let imgSrc = this.getImageUrl(image)
    let currentSize = this.parseSize(size, isRound)

    this.setState({
      imgSize: {
        width: currentSize.width + 'px',
        backgroundImage: currentSize.width ? 'url(' + imgSrc + ')' : ''
      }
    })
  }

  render () {
    let { id, atts, editor } = this.props
    let { image, designOptions, shape, clickableOptions, imageUrl, customClass, size, alignment } = atts
    let containerClasses = 'vce-image-gallery-container vce'
    let classes = 'vce-image-gallery-inner'
    let customProps = {}
    let CustomTag = 'div'
    let originalSrc = this.getImageUrl(image, 'full')
    let customImageProps = {
      'data-img-src': originalSrc
    }

    let imgSrc = originalSrc

    size = size.replace(/\s/g, '').replace(/px/g, '').toLowerCase()

    if (image && image.id) {
      if (size && size.match(/\d*(x)\d*/)) {
        this.getCustomSizeImage(image, size, shape === 'round', originalSrc)
      } else if (shape === 'round') {
        this.checkImageSize(image, this.getCustomSizeImage, true, size, originalSrc)
      } else {
        imgSrc = this.getImageUrl(image, size)
      }
    }

    if (this.state && this.state.imgSize) {
      classes += ' vce-image-gallery--size-custom'
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    if (clickableOptions === 'url' && imageUrl && imageUrl.url) {
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
        'href': originalSrc,
        'target': '_blank'
      }
    } else if (clickableOptions === 'lightbox') {
      CustomTag = 'a'
      customProps = {
        'href': originalSrc,
        'data-lightbox': `lightbox-${id}`
      }
    } else if (clickableOptions === 'zoom') {
      classes += ' vce-image-gallery-zoom-container'
    }

    if (alignment) {
      containerClasses += ` vce-image-gallery--align-${alignment}`
    }

    if (shape === 'rounded') {
      classes += ' vce-image-gallery--border-rounded'
    }

    if (shape === 'round') {
      classes += ' vce-image-gallery--border-round'
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

    customProps.style = this.state ? this.state.imgSize : null

    return <div className={containerClasses} id={'el-' + id} {...editor}>
      <CustomTag {...customProps} className={classes} ref='imageContainer'>
        <img className='vce-image-gallery' src={imgSrc} {...customImageProps} />
      </CustomTag>
    </div>
  }
}
