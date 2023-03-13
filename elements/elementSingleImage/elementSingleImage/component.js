import React from 'react'
import { getService } from 'vc-cake'
import classNames from 'classnames'
import { setCssVariables } from 'vc-helpers'

const vcvAPI = getService('api')
const renderProcessor = getService('renderProcessor')
const { getBlockRegexp, parseDynamicBlock } = getService('utils')
const blockRegexp = getBlockRegexp()

export default class SingleImageElement extends vcvAPI.elementComponent {
  promise = null

  static image = null

  constructor (props) {
    super(props)

    this.state = {
      imgElement: null,
      parsedWidth: null,
      parsedHeight: null,
      naturalWidth: null,
      naturalHeight: null
    }

    this.setImage = this.setImage.bind(this)
    this.setImageState = this.setImageState.bind(this)
    this.setError = this.setError.bind(this)
  }

  componentDidMount () {
    this.promise = new window.Promise((resolve) => {
      this.resolve = resolve
      this.setImage(this.props)
    })
    renderProcessor.add(this.promise)
  }

  componentWillUnmount () {
    this.resolve && this.resolve(true)
    SingleImageElement.image && SingleImageElement.image.removeEventListener('load', this.setImageState)
    SingleImageElement.image && SingleImageElement.image.removeEventListener('error', this.setError)
  }

  componentDidUpdate (prevProps) {
    if (prevProps.atts.image !== this.props.atts.image) {
      this.setImage(this.props)
    } else if (prevProps.atts.size !== this.props.atts.size) {
      this.resetImageSizeState()
    } else if (prevProps.atts.shape !== this.props.atts.shape) {
      this.resetImageSizeState()
    }
  }

  parseSize (size, isRound, naturalWidth, naturalHeight) {
    let crop = true
    if (typeof size === 'string') {
      size = size.replace(/\s/g, '').replace(/px/g, '').toLowerCase().split('x')
    } else if (typeof size === 'object') {
      crop = size.crop
      size = [size.width, size.height]
    }

    naturalWidth = parseInt(naturalWidth)
    naturalHeight = parseInt(naturalHeight)

    const cropHorizontal = parseInt(size[0]) < naturalWidth
    const cropVertical = parseInt(size[1]) < naturalHeight

    if (crop) {
      size[0] = parseInt(size[0]) < naturalWidth ? parseInt(size[0]) : naturalWidth
      size[1] = parseInt(size[1]) < naturalHeight ? parseInt(size[1]) : naturalHeight
    } else {
      size[0] = cropHorizontal ? parseInt(size[0]) : naturalWidth
      size[1] = cropVertical ? parseInt(size[1]) : naturalHeight

      if (cropHorizontal && !cropVertical) {
        const prop = size[0] / naturalWidth
        size[1] = parseInt(naturalHeight * prop)
      }

      if (cropVertical && !cropHorizontal) {
        const prop = size[1] / naturalHeight
        size[0] = parseInt(naturalWidth * prop)
      }

      if (cropVertical && cropHorizontal) {
        if (naturalHeight < naturalWidth) {
          const prop = size[0] / naturalWidth
          size[1] = parseInt(naturalHeight * prop)
        } else {
          const prop = size[1] / naturalHeight
          size[0] = parseInt(naturalWidth * prop)
        }
      }
    }

    if (isRound) {
      const smallestSize = size[0] >= size[1] ? size[1] : size[0]
      size = {
        width: smallestSize,
        height: smallestSize
      }
    } else {
      size = {
        width: size[0],
        height: size[1]
      }
    }
    return size
  }

  checkRelatedSize (size) {
    let relatedSize = null
    if (window.vcvImageSizes && window.vcvImageSizes[size]) {
      relatedSize = window.vcvImageSizes[size]
    }
    return relatedSize
  }

  getSizes (atts, img) {
    if (!img) {
      return {
        width: '',
        height: ''
      }
    }
    let { size, shape } = atts
    size = size.replace(/\s/g, '').replace(/px/g, '').toLowerCase()

    let parsedSize = ''

    if (size.match(/\d+(x)\d+/)) {
      parsedSize = this.parseSize(size, shape === 'round', img.width, img.height)
    } else {
      parsedSize = this.checkRelatedSize(size)

      if (parsedSize) {
        parsedSize = this.parseSize(parsedSize, shape === 'round', img.width, img.height)
      } else {
        parsedSize = this.parseSize({ width: img.width, height: img.height }, shape === 'round', img.width, img.height)
      }
    }

    return {
      width: parsedSize.width,
      height: parsedSize.height
    }
  }

  setImage (props) {
    const imgSrc = this.getImageUrl(props.atts.image)

    SingleImageElement.image && SingleImageElement.image.removeEventListener('load', this.setImageState)
    SingleImageElement.image && SingleImageElement.image.removeEventListener('error', this.setError)

    SingleImageElement.image = new window.Image()

    SingleImageElement.image.addEventListener('load', this.setImageState)
    SingleImageElement.image.addEventListener('error', this.setError)

    if (imgSrc) {
      SingleImageElement.image.src = imgSrc
    } else {
      this.setError()
    }
    if (!imgSrc) {
      this.setState({
        imgElement: null,
        parsedWidth: null,
        parsedHeight: null,
        naturalWidth: null,
        naturalHeight: null
      })
    }
  }

  setImageState (e) {
    const img = e.currentTarget
    const sizes = this.getSizes(this.props.atts, img)

    this.setState({
      imgElement: img,
      parsedWidth: sizes.width,
      parsedHeight: sizes.height,
      naturalWidth: img.width,
      naturalHeight: img.height
    }, () => {
      this.resolve && this.resolve(true)
    })
  }

  resetImageSizeState () {
    const sizes = this.getSizes(this.props.atts, this.state.imgElement)
    this.setState({
      parsedWidth: sizes.width,
      parsedHeight: sizes.height
    })
  }

  setError () {
    this.resolve && this.resolve(false)
  }

  getImageShortcode (options) {
    const { props, classes, isDefaultImage, src, isDynamicImage, naturalSizes } = options

    let shortcode = `[vcvSingleImage class="${classes}" data-width="${this.state.parsedWidth || 0}" data-height="${this.state.parsedHeight || 0}" src="${src}" data-img-src="${props['data-img-src']}" data-attachment-id="${props['data-attachment-id']}" `

    let alt = props.alt
    let title = props.title
    if (isDefaultImage) {
      shortcode += ' data-default-image="true"'
    }

    if (isDynamicImage) {
      const blockInfo = parseDynamicBlock(this.props.rawAtts.image.full)
      shortcode += ` data-dynamic="${blockInfo.blockAtts.value}"`
      try {
        const url = new URL(blockInfo.blockAtts.currentValue)
        const urlParams = new URLSearchParams(url.search)

        if (urlParams.get('alt')) {
          alt = urlParams.get('alt')
        }

        if (urlParams.get('title')) {
          title = urlParams.get('title')
        }
      } catch (e) {
        // In case if dynamicField (noValue)
        console.warn('URL is not valid, skipping', blockInfo, blockInfo.blockAtts.currentValue)
      }

      if (naturalSizes) {
        shortcode += ' data-dynamic-natural-size="true"'
      }
    }

    shortcode += ` alt="${alt}" title="${title}" ]`

    return shortcode
  }

  render () {
    const { id, atts, editor } = this.props
    const { shape, clickableOptions, showCaption, customClass, size, alignment, metaCustomId, image, extraDataAttributes } = atts

    const imageForFilter = image && image.urls && image.urls.length ? image.urls[0] : image

    // Handle conditional classes
    const containerClasses = classNames({
      'vce-single-image-container': true,
      [customClass]: typeof customClass === 'string' && customClass,
      [`vce-single-image--align-${alignment}`]: alignment
    })
    const classes = classNames({
      'vce-single-image-inner vce-single-image--absolute': true,
      'vce-single-image-zoom-container': clickableOptions === 'zoom',
      [`vce-image-filter--${imageForFilter.filter}`]: imageForFilter && imageForFilter.filter && imageForFilter.filter !== 'normal'
    })
    const imageClasses = 'vce-single-image'

    // Handle conditional props
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)
    metaCustomId && (containerProps.id = metaCustomId)

    // Handle CSS variables
    const cssVars = {
      'text-align': alignment,
      'border-radius': shape
    }
    const styleObj = setCssVariables(cssVars)

    const CustomTag = clickableOptions && (clickableOptions.toLowerCase() !== 'none' && clickableOptions.toLowerCase() !== 'zoom')
      ? 'a'
      : 'div'
    let customProps = {}
    const customImageProps = {}
    const imgSrc = this.getImageUrl(image)

    const rawImage = this.props.rawAtts.image && this.props.rawAtts.image.full
    const isDynamic = Array.isArray(typeof rawImage === 'string' && rawImage.match(blockRegexp))

    customImageProps['data-img-src'] = imgSrc
    customImageProps['data-attachment-id'] = image && image.id ? image.id : 0
    customImageProps.alt = image && image.alt ? image.alt : ''
    customImageProps.title = image && image.title ? image.title : ''

    const captionText = image && image.caption ? image.caption : ''

    if (clickableOptions === 'url' && image && image.link && image.link.url) {
      const { url, title, targetBlank, relNofollow } = image.link
      customProps = {
        href: url,
        title: title,
        target: targetBlank ? '_blank' : undefined,
        rel: relNofollow ? 'nofollow' : undefined
      }
    } else if (clickableOptions === 'imageNewTab') {
      customProps = {
        href: imgSrc,
        target: '_blank'
      }
    } else if (clickableOptions === 'lightbox') {
      customProps = {
        href: imgSrc,
        'data-lightbox': `lightbox-${id}`
      }
    } else if (clickableOptions === 'photoswipe') {
      customProps = {
        href: imgSrc,
        'data-photoswipe-image': id,
        'data-photoswipe-index': 0
      }
      containerProps['data-photoswipe-item'] = `photoswipe-${id}`
      if (showCaption) {
        customProps['data-photoswipe-caption'] = image.caption
      }
      containerProps['data-photoswipe-gallery'] = id
    }

    const doAll = this.applyDO('all')
    const isCaptionTextHidden = !captionText
    const caption = (
      <figcaption hidden={isCaptionTextHidden}>
        {captionText}
      </figcaption>
    )

    let imgElement = null
    let naturalDynamicSizes = false
    if (isDynamic && ((this.state.naturalWidth === 1 && this.state.naturalHeight === 1) || ((!size || size === 'full') && shape !== 'round'))) {
      customProps['data-vce-delete-attr'] = 'style'
      naturalDynamicSizes = true
    }

    const shortcodeOptions = {
      props: customImageProps,
      classes: imageClasses,
      isDefaultImage: !(image && image.id),
      src: imgSrc,
      isDynamicImage: isDynamic,
      naturalSizes: naturalDynamicSizes
    }

    if (imgSrc) {
      imgElement = (
        <img className={`${imageClasses} vcvhelper`} src={imgSrc} {...customImageProps} data-vcvs-html={this.getImageShortcode(shortcodeOptions)} />
      )
    }

    // Set original image if not resized
    if ((!size || size === 'full') && shape !== 'round' && !isDynamic) {
      imgElement = (
        <img className={imageClasses} src={imgSrc} {...customImageProps} />
      )
    }

    return (
      <div className={containerClasses} {...editor} id={'el-' + id} style={styleObj}>
        <figure className='vce vce-single-image-wrapper' {...containerProps} {...doAll}>
          <CustomTag
            className={classes}
            style={{
              width: this.state.parsedWidth,
              paddingBottom: `${(this.state.parsedHeight / this.state.parsedWidth) * 100}%`
            }}
            {...customProps}
          >
            {imgElement}
          </CustomTag>
          {caption}
        </figure>
      </div>
    )
  }
}
