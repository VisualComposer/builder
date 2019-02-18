import React from 'react'
import vcCake from 'vc-cake'

const vcvAPI = vcCake.getService('api')
const renderProcessor = vcCake.getService('renderProcessor')

export default class SingleImageElement extends vcvAPI.elementComponent {
  promise = null

  static drawImageProp (ctx, img, x, y, w, h, offsetX, offsetY) {
    if (arguments.length === 2) {
      x = y = 0
      w = ctx.canvas.width
      h = ctx.canvas.height
    }

    // default offset is center
    offsetX = typeof offsetX === 'number' ? offsetX : 0.5
    offsetY = typeof offsetY === 'number' ? offsetY : 0.5

    // keep bounds [0.0, 1.0]
    if (offsetX < 0) {
      offsetX = 0
    }
    if (offsetY < 0) {
      offsetY = 0
    }
    if (offsetX > 1) {
      offsetX = 1
    }
    if (offsetY > 1) {
      offsetY = 1
    }

    let iw = img.width
    let ih = img.height
    let r = Math.min(w / iw, h / ih)
    let nw = iw * r // new prop. width
    let nh = ih * r // new prop. height
    let cx
    let cy
    let cw
    let ch
    let ar = 1

    // decide which gap to fill
    if (Math.round(nw) < w) {
      ar = w / nw
    }
    if (Math.round(nh) < h) {
      ar = h / nh
    }

    nw *= ar
    nh *= ar

    // calc source rectangle
    cw = iw / (nw / w)
    ch = ih / (nh / h)

    cx = (iw - cw) * offsetX
    cy = (ih - ch) * offsetY

    // make sure source rectangle is valid
    if (cx < 0) {
      cx = 0
    }
    if (cy < 0) {
      cy = 0
    }
    if (cw > iw) {
      cw = iw
    }
    if (ch > ih) {
      ch = ih
    }

    // make canvas high quality
    ctx.imageSmoothingQuality = 'high'

    /// fill image in dest. rectangle
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h)
  }

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
    this.promise = new window.Promise((resolve, reject) => {
      this.resolve = resolve
      this.setImage(this.props)
    })
    renderProcessor.add(this.promise)
  }

  componentWillUnmount () {
    SingleImageElement.image && SingleImageElement.image.removeEventListener('load', this.setImageState)
    SingleImageElement.image && SingleImageElement.image.removeEventListener('error', this.setError)
  }

  componentWillReceiveProps (nextProps) {
    this.setImage(nextProps)
  }

  parseSize (size, isRound, naturalWidth, naturalHeight) {
    let crop = true
    if (typeof size === 'string') {
      size = size.replace(/\s/g, '').replace(/px/g, '').toLowerCase().split('x')
    } else if (typeof size === 'object') {
      crop = size.crop
      size = [ size.width, size.height ]
    }

    naturalWidth = parseInt(naturalWidth)
    naturalHeight = parseInt(naturalHeight)

    const cropHorizontal = parseInt(size[ 0 ]) < naturalWidth
    const cropVertical = parseInt(size[ 1 ]) < naturalHeight

    if (crop) {
      size[ 0 ] = parseInt(size[ 0 ]) < naturalWidth ? parseInt(size[ 0 ]) : naturalWidth
      size[ 1 ] = parseInt(size[ 1 ]) < naturalHeight ? parseInt(size[ 1 ]) : naturalHeight
    } else {
      size[ 0 ] = cropHorizontal ? parseInt(size[ 0 ]) : naturalWidth
      size[ 1 ] = cropVertical ? parseInt(size[ 1 ]) : naturalHeight

      if (cropHorizontal && !cropVertical) {
        const prop = size[ 0 ] / naturalWidth
        size[ 1 ] = parseInt(naturalHeight * prop)
      }

      if (cropVertical && !cropHorizontal) {
        const prop = size[ 1 ] / naturalHeight
        size[ 0 ] = parseInt(naturalWidth * prop)
      }

      if (cropVertical && cropHorizontal) {
        if (naturalHeight < naturalWidth) {
          const prop = size[ 0 ] / naturalWidth
          size[ 1 ] = parseInt(naturalHeight * prop)
        } else {
          const prop = size[ 1 ] / naturalHeight
          size[ 0 ] = parseInt(naturalWidth * prop)
        }
      }
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

  checkRelatedSize (size) {
    let relatedSize = null
    if (window.vcvImageSizes && window.vcvImageSizes[ size ]) {
      relatedSize = window.vcvImageSizes[ size ]
    }
    return relatedSize
  }

  getSizes (atts, img) {
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
      imgElement: e.currentTarget,
      parsedWidth: sizes.width,
      parsedHeight: sizes.height,
      naturalWidth: img.width,
      naturalHeight: img.height
    }, () => {
      this.resolve && this.resolve(true)
    })
  }

  setError () {
    this.resolve && this.resolve(false)
  }

  resizeImage () {
    const { imgElement, parsedWidth, parsedHeight, naturalWidth, naturalHeight } = this.state

    if (!this.canvas) {
      return
    }

    const ctx = this.canvas.getContext('2d')

    if (!imgElement) {
      ctx.clearRect(0, 0, parsedWidth, parsedHeight)
      return
    }

    this.canvas.width = parsedWidth
    this.canvas.height = parsedHeight
    this.canvas.naturalWidth = naturalWidth
    this.canvas.naturalHeight = naturalHeight

    SingleImageElement.drawImageProp(ctx, imgElement, 0, 0, parsedWidth, parsedHeight, 0.5, 0.5)
  }

  getImageShortcode (options) {
    const { props, classes, isDefaultImage, src } = options
    let shortcode = `[vcvSingleImage class="${classes}" data-width="${this.state.parsedWidth || 0}" data-height="${this.state.parsedHeight || 0}" src="${src}" data-img-src="${props[ 'data-img-src' ]}" alt="${props.alt}" title="${props.title}"`

    if (isDefaultImage) {
      shortcode += ' data-default-image="true"'
    }

    shortcode += ']'

    return shortcode
  }

  render () {
    let { id, atts, editor } = this.props
    let { image, shape, clickableOptions, showCaption, customClass, size, alignment, metaCustomId } = atts
    let containerClasses = 'vce-single-image-container'
    let wrapperClasses = 'vce vce-single-image-wrapper'
    let classes = 'vce-single-image-inner'
    let imageClasses = 'vce-single-image'
    let customProps = {}
    let containerProps = {}
    let wrapperProps = {}
    let CustomTag = 'div'
    let customImageProps = {}
    let imgSrc = this.getImageUrl(image)

    customImageProps[ 'data-img-src' ] = imgSrc
    customImageProps[ 'alt' ] = image && image.alt ? image.alt : ''
    customImageProps[ 'title' ] = image && image.title ? image.title : ''

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    if (clickableOptions === 'url' && image && image.link && image.link.url) {
      CustomTag = 'a'
      let { url, title, targetBlank, relNofollow } = image.link
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
    } else if (clickableOptions === 'photoswipe') {
      CustomTag = 'a'
      customProps = {
        'href': imgSrc,
        'data-photoswipe-image': id,
        'data-photoswipe-index': 0
      }
      wrapperProps[ 'data-photoswipe-item' ] = `photoswipe-${id}`
      if (showCaption) {
        customProps[ 'data-photoswipe-caption' ] = image.caption
      }
      containerProps[ 'data-photoswipe-gallery' ] = id
    }

    if (alignment) {
      containerClasses += ` vce-single-image--align-${alignment}`
    }

    if (shape === 'rounded') {
      classes += ' vce-single-image--border-rounded'
    }

    if (shape === 'round') {
      classes += ' vce-single-image--border-round'
    }

    customProps.key = `customProps:${id}-${imgSrc}-${clickableOptions}-${shape}-${size}`

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')
    let caption = null

    if (image && image.caption) {
      caption = (
        <figcaption>
          {image.caption}
        </figcaption>
      )
    }
    const imageForFilter = image && image.urls && image.urls.length ? image.urls[ 0 ] : image

    if (imageForFilter && imageForFilter.filter && imageForFilter.filter !== 'normal') {
      classes += ` vce-image-filter--${imageForFilter.filter}`
    }

    let imgElement = ''
    const shortcodeOptions = {
      props: customImageProps,
      classes: imageClasses,
      isDefaultImage: !(image && image.id),
      src: imgSrc
    }

    if (imgSrc) {
      imgElement = (
        <span className={`${imageClasses} vcvhelper`}
          {...customImageProps}
          data-vcvs-html={this.getImageShortcode(shortcodeOptions)}>
          <canvas ref={(canvas) => { this.canvas = canvas }} />
        </span>
      )
    }

    // Set original image if not resized
    if (size === 'full' && shape !== 'round') {
      imgElement = (
        <img className={imageClasses} src={imgSrc} {...customImageProps} />
      )
    }

    this.resizeImage()

    return <div className={containerClasses} {...editor} {...containerProps}>
      <div className={wrapperClasses} {...wrapperProps} id={'el-' + id} {...doAll}>
        <figure>
          <CustomTag {...customProps} className={classes} ref='imageContainer'>
            {imgElement}
          </CustomTag>
          {caption}
        </figure>
      </div>
    </div>
  }
}
