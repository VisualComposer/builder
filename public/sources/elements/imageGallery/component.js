/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  componentDidMount () {

  }

  componentWillReceiveProps (nextProps) {

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
      if (image instanceof Array) {
        let urls = []
        image.forEach((item) => {
          urls.push(item && item.full ? item.full : this.getPublicImage(item))
        })
        imageUrl = urls
      } else {
        imageUrl = image && image.full ? image.full : this.getPublicImage(image)
      }
    }
    return imageUrl
  }

  render () {
    let { id, atts, editor } = this.props
    let { image, designOptions, shape, clickableOptions, imageUrl, customClass, alignment, columns } = atts
    let containerClasses = 'vce-image-gallery vce'
    let classes = 'vce-image-gallery-inner'
    let customProps = {}
    let CustomTag = 'div'
    let imgSrc = this.getImageUrl(image)
    let customImageProps = ''

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    let mixinData = this.getMixinData('imageGalleryGap')
    if (mixinData) {
      containerClasses += ` vce-image-gallery--gap-${mixinData.selector}`
    }

    mixinData = this.getMixinData('imageGalleryColumns')
    if (mixinData) {
      containerClasses += ` vce-image-gallery--columns-${mixinData.selector}`
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
        'href': imgSrc,
        'target': '_blank'
      }
    } else if (clickableOptions === 'lightbox') {
      CustomTag = 'a'
      customProps = {
        'href': imgSrc,
        'data-lightbox': `lightbox-${id}`
      }
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

    // customProps.key = `customProps:${id}-${imgSrc}-${clickableOptions}-${shape}`

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

    let galleryItems = []

    imgSrc.forEach((src, index) => {
      galleryItems.push(
        <div className='vce-image-gallery-item' key={index}>
          <CustomTag {...customProps} className={classes} ref='imageContainer'>
            <img className='vce-image-gallery-img' src={src} {...customImageProps} />
          </CustomTag>
        </div>
      )
    })

    return <div className={containerClasses} id={'el-' + id} {...editor}>
      <div className='vce-image-gallery-list'>
        {galleryItems}
      </div>
    </div>
  }
}
