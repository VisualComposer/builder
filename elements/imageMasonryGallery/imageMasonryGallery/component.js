import React from 'react'
import vcCake from 'vc-cake'
import lodash from 'lodash'

const vcvAPI = vcCake.getService('api')

export default class ImageMasonryGallery extends vcvAPI.elementComponent {
  currentImg = 0
  loadingIndex = 0
  data = []

  constructor (props) {
    super(props)
    this.loadImage = this.loadImage.bind(this)
  }

  componentDidMount () {
    this.prepareImages(JSON.parse(JSON.stringify(this.props.atts)))
  }

  componentDidUpdate (prevProps) {
    if (!lodash.isEqual(prevProps, this.props)) {
      this.currentImg = 0
      this.data = []
      this.loadingIndex++
      this.prepareImages(JSON.parse(JSON.stringify(this.props.atts)), true)
    }
    vcCake.env('iframe') && vcCake.env('iframe').vcv.trigger('ready')
  }

  prepareImages (atts, clearColumns = false) {
    const { image } = atts
    const imgSources = this.getImageUrl(image)
    const columnCount = atts.columns <= 0 ? 1 : atts.columns
    let cols = []
    for (let i = 0; i < columnCount; i++) {
      cols.push(0)
      this.data.push([])
    }

    if (clearColumns) {
      cols = []
      for (let i = 0; i < columnCount; i++) {
        cols.push(0)
      }
    }
    this.loadImage(imgSources, cols)
  }

  loadImage (imgSources, cols) {
    if (!imgSources.length) {
      this.setState({
        columnData: this.data
      })
      return
    }
    const img = new window.Image()
    img.loadingIndex = this.loadingIndex
    img.onload = this.imgLoadHandler.bind(this, imgSources, cols, img)
    img.src = imgSources[this.currentImg]
  }

  imgLoadHandler (imgSources, cols, img) {
    if (img.loadingIndex === this.loadingIndex) {
      const height = this.getImageHeight(img.width, img.height)
      const smallestCol = this.getSmallestFromArray(cols)
      cols[smallestCol] += height
      this.data[smallestCol].push(this.props.atts.image[this.currentImg])
      this.currentImg++
      if (this.currentImg < imgSources.length) {
        this.loadImage(imgSources, cols)
      } else {
        this.setState({
          columnData: this.data
        })
      }
    }
  }

  getImageHeight (width, height) {
    const newWidth = 50
    const proportion = width / newWidth
    return height / proportion
  }

  getSmallestFromArray (arr) {
    let smallestIndex = 0
    let smallest = arr[0]
    arr.forEach((height, index) => {
      if (height < smallest) {
        smallest = arr[index]
        smallestIndex = index
      }
    })
    return smallestIndex
  }

  render () {
    const { id, atts, editor } = this.props
    const { image, shape, customClass, metaCustomId, clickableOptions, showCaption, gap, columns, extraDataAttributes } = atts
    const containerClasses = ['vce-image-masonry-gallery']
    const wrapperClasses = ['vce-image-masonry-gallery-wrapper vce']
    const containerProps = this.getExtraDataAttributes(extraDataAttributes)

    let CustomTag = 'div'
    const columnData = this.state && this.state.columnData
    const columnHtml = []
    if (columnData) {
      let imageIndex = 0
      columnData.forEach((col, colIndex) => {
        const galleryItems = []
        col && col.forEach((src, index) => {
          const imgSrc = this.getImageUrl(src)
          let customProps = {}
          let classes = 'vce-image-masonry-gallery-item'
          const imgClasses = 'vce-image-masonry-gallery-img'
          const customImageProps = {
            alt: src && src.alt ? src.alt : ''
          }

          if (clickableOptions === 'url' && src.link && src.link.url) {
            CustomTag = 'a'
            const { url, title, targetBlank, relNofollow } = src.link
            customProps = {
              href: url,
              title: title,
              target: targetBlank ? '_blank' : undefined,
              rel: relNofollow ? 'nofollow' : undefined
            }
          } else if (clickableOptions === 'imageNewTab') {
            CustomTag = 'a'
            customProps = {
              href: imgSrc,
              target: '_blank'
            }
          } else if (clickableOptions === 'lightbox') {
            CustomTag = 'a'
            customProps = {
              href: imgSrc,
              'data-lightbox': `lightbox-${id}`
            }
          } else if (clickableOptions === 'photoswipe') {
            CustomTag = 'a'
            customProps = {
              href: imgSrc,
              'data-photoswipe-image': id,
              'data-photoswipe-index': imageIndex,
              'data-photoswipe-item': `photoswipe-${id}`
            }
            if (showCaption && src && src.caption) {
              customProps['data-photoswipe-caption'] = src.caption
            }
            containerProps['data-photoswipe-gallery'] = id
            imageIndex++
          }

          if (image[index] && image[index].filter && image[index].filter !== 'normal') {
            classes += ` vce-image-filter--${image[index].filter}`
          }

          galleryItems.push(
            <CustomTag {...customProps} className={classes} key={`vce-image-masonry-gallery-item-${index}-${id}`}>
              <img className={imgClasses} src={this.getImageUrl(src)} {...customImageProps} />
            </CustomTag>
          )
        })
        columnHtml.push(
          <div className='vce-image-masonry-gallery-column' key={`vce-image-masonry-gallery-col-${colIndex}-${id}`}>
            {galleryItems}
          </div>
        )
      })
    }

    if (typeof customClass === 'string' && customClass) {
      containerClasses.push(customClass)
    }

    wrapperClasses.push(`vce-image-masonry-gallery--gap-${gap}`)
    wrapperClasses.push(`vce-image-masonry-gallery--columns-${columns}`)

    if (shape === 'rounded') {
      containerClasses.push('vce-image-masonry-gallery--border-rounded')
    }

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    const doAll = this.applyDO('all')

    return (
      <div className={containerClasses.join(' ')} {...editor} {...containerProps}>
        <div className={wrapperClasses.join(' ')} id={'el-' + id} {...doAll}>
          <div className='vce-image-masonry-gallery-list'>
            {columnHtml}
          </div>
        </div>
      </div>
    )
  }
}
