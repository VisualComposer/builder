/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  getPublicImage (filename) {
    let { tag } = this.props.atts

    let assetsManager
    if (vcCake.env('FEATURE_ASSETS_MANAGER')) {
      assetsManager = vcCake.getService('wipAssetsManager')
    } else {
      assetsManager = vcCake.getService('assets-manager')
    }

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
    let { image, designOptions, shape, clickableOptions, customClass } = atts
    let containerClasses = ['vce-image-masonry-gallery']
    let wrapperClasses = ['vce-image-masonry-gallery-wrapper vce']
    let containerProps = {}
    let CustomTag = 'div'

    if (typeof customClass === 'string' && customClass) {
      containerClasses.push(customClass)
    }

    let mixinData = this.getMixinData('imageGalleryGap')
    if (mixinData) {
      wrapperClasses.push(`vce-image-masonry-gallery--gap-${mixinData.selector}`)
    }

    mixinData = this.getMixinData('imageGalleryColumns')
    if (mixinData) {
      wrapperClasses.push(`vce-image-masonry-gallery--columns-${mixinData.selector}`)
    }

    if (shape === 'rounded') {
      containerClasses.push('vce-image-masonry-gallery--border-rounded')
    }

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
      containerProps[ 'data-vce-animate' ] = animations.join(' ')
    }

    let galleryItems = []

    image && image.forEach((img, index) => {
      let src = this.getImageUrl(img)
      let customProps = {}
      let customImageProps = {
        'alt': img && img.alt ? img.alt : '',
        'title': img && img.title ? img.title : ''
      }
      CustomTag = 'div'

      if (clickableOptions === 'url' && img.link && img.link.url) {
        CustomTag = 'a'
        let { url, title, targetBlank, relNofollow } = img.link
        customProps = {
          'href': url,
          'title': title,
          'target': targetBlank ? '_blank' : undefined,
          'rel': relNofollow ? 'nofollow' : undefined
        }
      } else if (clickableOptions === 'imageNewTab') {
        CustomTag = 'a'
        customProps = {
          'href': src,
          'target': '_blank'
        }
      } else if (clickableOptions === 'lightbox') {
        CustomTag = 'a'
        customProps = {
          'href': src,
          'data-lightbox': `lightbox-${id}`
        }
      }

      galleryItems.push(
        <div className='vce-image-masonry-gallery-item' key={`vce-image-masonry-gallery-item-${index}-${id}`}>
          <CustomTag {...customProps} className='vce-image-masonry-gallery-item-inner'>
            <img className='vce-image-masonry-gallery-img' src={src} {...customImageProps} />
          </CustomTag>
        </div>
      )
    })

    return (
      <div className={containerClasses.join(' ')} {...editor} {...containerProps}>
        <div className={wrapperClasses.join(' ')} id={'el-' + id}>
          {galleryItems}
        </div>
      </div>
    )
  }
}
