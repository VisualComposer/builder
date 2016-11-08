/* global React, vcvAPI, vcCake */
/*eslint no-unused-vars: 0*/
class Component extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
    this.getCustomSizeImage = this.getCustomSizeImage.bind(this)
    this.insertImage = this.insertImage.bind(this)
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
      'vcv-action': 'elements:imageController:customSize',
      'vcv-image-id': id,
      'vcv-size': size.width + 'x' + size.height
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
        this.refs.imageContainer.classList.add('vce-single-image--border-round')
      } else {
        this.refs.imageContainer.classList.remove('vce-single-image--border-round')
      }
    }
    img.src = imgSrc
    img.setAttribute('data-img-src', originalSrc)
    img.className = 'vce-single-image'
  }

  render () {
    let { id, atts, editor } = this.props
    let { image, designOptions, shape, clickableOptions, imageUrl, customClass, size, alignment } = atts
    let containerClasses = 'vce-single-image-container vce'
    let classes = 'vce-single-image-inner'
    let customProps = {}
    let CustomTag = 'div'
    let originalSrc = this.getImageUrl(image, 'full')
    let customImageProps = {
      'data-img-src': originalSrc
    }

    let imgSrc = originalSrc

    if (size && size.match(/\d*(x)\d*/) && image.id) {
      this.getCustomSizeImage(image, size, shape === 'round', originalSrc)
    } else if (shape === 'round' && image.id) {
      this.checkImageSize(image, this.getCustomSizeImage, true, size, originalSrc)
    } else {
      imgSrc = this.getImageUrl(image, size)
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
      classes += ' vce-single-image-zoom-container'
    }

    if (alignment) {
      containerClasses += ` vce-single-image--align-${alignment}`
    }

    if (shape === 'rounded') {
      classes += ' vce-single-image--border-rounded'
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
      <CustomTag {...customProps} className={classes} ref='imageContainer'>
        <img className='vce-single-image' src={imgSrc} {...customImageProps} />
      </CustomTag>
    </div>
  }
}
