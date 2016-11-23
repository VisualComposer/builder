/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  constructor (props) {
    super(props)
  }

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
    let { image, designOptions, shape, clickableOptions, imageUrl, customClass, alignment } = atts
    let containerClasses = 'vce-image-gallery-container vce'
    let classes = 'vce-image-gallery-inner'
    let customProps = {}
    let CustomTag = 'div'
    let imgSrc = this.getImageUrl(image)
    let customImageProps = ''

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

    let halfUrls = Math.ceil(imgSrc.length / 2)
    let firstUrls = imgSrc.splice(0, halfUrls)

    let firstColumns = []

    firstUrls.forEach((src, index) => {
      firstColumns.push(
        <div className='vce-image-gallery-col' key={index}>
          <CustomTag {...customProps} className={classes} ref='imageContainer'>
            <img className='vce-image-gallery' src={src} {...customImageProps} />
          </CustomTag>
        </div>
      )
    })

    let secondColumns = []

    imgSrc.forEach((src, index) => {
      secondColumns.push(
        <div className='vce-image-gallery-col' key={index}>
          <CustomTag {...customProps} className={classes} ref='imageContainer'>
            <img className='vce-image-gallery' src={src} {...customImageProps} />
          </CustomTag>
        </div>
      )
    })

    return <div className={containerClasses} id={'el-' + id} {...editor}>
      <div className='vce-image-gallery-row'>
        {firstColumns}
      </div>
      <div className='vce-image-gallery-row'>
        {secondColumns}
      </div>
    </div>
  }
}
