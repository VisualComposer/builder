import React from 'react'
import vcCake from 'vc-cake'
import { isEqual } from 'lodash'

const vcvAPI = vcCake.getService('api')

export default class ImageGallery extends vcvAPI.elementComponent {
  imageSources = []
  imageOrder = {}

  constructor (props) {
    super(props)
    this.createCustomSizeImage = this.createCustomSizeImage.bind(this)
  }

  componentDidMount () {
    this.prepareImage(JSON.parse(JSON.stringify(this.props.atts.image)))
  }

  componentDidUpdate (prevProps) {
    if (!isEqual(this.props.atts.image, prevProps.atts.image) || this.props.atts.image.length !== this.state.imgSrc.length) {
      this.imageSources = []
      this.imageOrder = {}
      this.prepareImage(JSON.parse(JSON.stringify(this.props.atts.image)))
    }
  }

  prepareImage (image) {
    if (image.length && typeof image[0] === 'object') {
      const newImages = []
      image.forEach((item) => {
        const newItem = item
        newItem.full = newItem.id ? newItem.full : this.getImageUrl(newItem.full)
        newItem.id = newItem.id ? newItem.id : Math.random()
        newImages.push(item)
      })
      image = newImages
      this.setImageOrder(image)
      this.resizeImage(image)
    }
    const imgArr = []
    image.forEach((img) => {
      imgArr.push({ imgSrc: this.getImageUrl(img) })
    })
    this.setImgSrcState(imgArr)
  }

  setImageOrder (imageArray) {
    imageArray.forEach((image, index) => {
      this.imageOrder[index] = image.id
    })
  }

  checkImageSize (image, callback, imgCount) {
    const img = new window.Image()
    img.onload = () => {
      const size = {
        width: img.width,
        height: img.height
      }
      callback(image, size, imgCount)
    }
    img.src = image.full
  }

  resizeImage (imageArray) {
    imageArray.forEach((image) => {
      this.checkImageSize(image, this.createCustomSizeImage, imageArray.length)
    })
  }

  createCustomSizeImage (image, size, imgCount) {
    image.orientation = this.checkOrientation(size)
    const checkImg = this.imageSources.filter((obj) => {
      return obj.id === image.id
    })
    if (!checkImg.length) {
      this.imageSources.push(image)
    }

    if (this.imageSources.length === imgCount) {
      this.orderImages()
    }
  }

  orderImages () {
    const imagesInOrder = []
    this.imageSources.forEach((img, index) => {
      const imgObj = this.imageSources.filter((obj) => {
        return obj.id === this.imageOrder[index]
      })
      if (imgObj[0]) {
        imagesInOrder.push({
          imgSrc: this.getImageUrl(imgObj[0], 'large'),
          orientation: imgObj[0].orientation,
          originalSrc: this.getImageUrl(imgObj[0]),
          alt: imgObj[0].alt,
          title: imgObj[0].title
        })
      }
    })

    this.setImgSrcState(imagesInOrder)
  }

  checkOrientation (size) {
    return size.width >= size.height ? 'landscape' : 'portrait'
  }

  setImgSrcState (imgSrc) {
    this.setState({ imgSrc })
  }

  render () {
    const { id, atts, editor } = this.props
    const { image, shape, clickableOptions, showCaption, customClass, metaCustomId, showCaptionGeneral, captionAlignment, gap, columns } = atts
    let containerClasses = 'vce-image-gallery'
    const wrapperClasses = 'vce-image-gallery-wrapper vce'
    const containerProps = {}
    let CustomTag = 'div'
    const imgSrc = this.state && this.state.imgSrc

    if (typeof customClass === 'string' && customClass) {
      containerClasses += ' ' + customClass
    }

    containerClasses += ` vce-image-gallery--gap-${gap}`
    containerClasses += ` vce-image-gallery--columns-${columns}`

    if (shape === 'rounded') {
      containerClasses += ' vce-image-gallery--border-rounded'
    }

    if (shape === 'round') {
      containerClasses += ' vce-image-gallery--border-round'
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    if (showCaptionGeneral && captionAlignment) {
      containerClasses += ` vce-image-gallery-caption--align-${captionAlignment}`
    }

    const galleryItems = []

    imgSrc && imgSrc.forEach((src, index) => {
      let customProps = {}
      let classes = 'vce-image-gallery-item-inner'
      let imgClasses = 'vce-image-gallery-img'
      const customImageProps = {
        alt: src && src.alt ? src.alt : '',
        title: src && src.title ? src.title : ''
      }
      const itemProps = {}

      if (src.orientation === 'portrait') {
        imgClasses += ' vce-image-gallery-img--orientation-portrait'
      }

      if (clickableOptions === 'url' && image[index].link && image[index].link.url) {
        CustomTag = 'a'
        const { url, title, targetBlank, relNofollow } = image[index].link
        customProps = {
          href: url,
          title: title,
          target: targetBlank ? '_blank' : undefined,
          rel: relNofollow ? 'nofollow' : undefined
        }
      } else if (clickableOptions === 'imageNewTab') {
        CustomTag = 'a'
        customProps = {
          href: src.originalSrc || src.imgSrc,
          target: '_blank'
        }
      } else if (clickableOptions === 'lightbox') {
        CustomTag = 'a'
        customProps = {
          href: src.originalSrc || src.imgSrc,
          'data-lightbox': `lightbox-${id}`
        }
      } else if (clickableOptions === 'photoswipe') {
        CustomTag = 'a'
        customProps = {
          href: src.originalSrc || src.imgSrc,
          'data-photoswipe-image': id,
          'data-photoswipe-index': index
        }
        if (showCaption) {
          customProps['data-photoswipe-caption'] = image[index].caption
        }
        containerProps['data-photoswipe-gallery'] = id
        itemProps['data-photoswipe-item'] = `photoswipe-${id}`
      }

      if (image[index] && image[index].filter && image[index].filter !== 'normal') {
        classes += ` vce-image-filter--${image[index].filter}`
      }
      let caption = ''
      if (showCaptionGeneral && image[index].caption) {
        caption = (<figcaption>{image[index].caption}</figcaption>)
      }

      galleryItems.push(
        <div className='vce-image-gallery-item' key={`vce-image-gallery-item-${index}-${id}`} {...itemProps}>
          <figure className='vce-image-gallery-item-inner-wrapper'>
            <CustomTag {...customProps} className={classes}>
              <img className={imgClasses} src={src.imgSrc} {...customImageProps} />
            </CustomTag>
            {caption}
          </figure>
        </div>
      )
    })

    const doAll = this.applyDO('all')

    return (
      <div className={containerClasses} {...editor} {...containerProps}>
        <div className={wrapperClasses} id={'el-' + id} {...doAll}>
          <div className='vce-image-gallery-list'>
            {galleryItems}
          </div>
        </div>
      </div>
    )
  }
}
