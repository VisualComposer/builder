/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  currentImg = 0
  loadingIndex = 0
  data = []

  constructor (props) {
    super(props)
    this.loadImage = this.loadImage.bind(this)
  }

  componentDidMount () {
    this.prepareImages(this.props.atts)
  }

  componentWillReceiveProps (nextProps) {
    this.currentImg = 0
    this.data = []
    this.loadingIndex++
    this.prepareImages(nextProps.atts, true)
  }

  prepareImages (atts, clearColumns = false) {
    let { image } = atts
    let imgSources = this.getImageUrl(image)
    let columnCount = atts.columns <= 0 ? 1 : atts.columns
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
    let img = new window.Image()
    img.loadingIndex = this.loadingIndex
    img.onload = this.imgLoadHandler.bind(this, imgSources, cols, img)
    img.src = imgSources[ this.currentImg ]
  }

  imgLoadHandler (imgSources, cols, img) {
    if (img.loadingIndex === this.loadingIndex) {
      let height = this.getImageHeight(img.width, img.height)
      let smallestCol = this.getSmallestFromArray(cols)
      cols[ smallestCol ] += height
      this.data[ smallestCol ].push(this.props.atts.image[ this.currentImg ])
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
    let newWidth = 50
    let proportion = width / newWidth
    return height / proportion
  }

  getSmallestFromArray (arr) {
    let smallestIndex = 0
    let smallest = arr[ 0 ]
    arr.forEach((height, index) => {
      if (height < smallest) {
        smallest = arr[ index ]
        smallestIndex = index
      }
    })
    return smallestIndex
  }

  getPublicImage (filename) {
    let { tag } = this.props.atts

    let assetsManager = vcCake.getService('assetsManager')

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
    let { image, shape, customClass, columns, metaCustomId, clickableOptions } = atts
    let containerClasses = [ 'vce-image-masonry-gallery' ]
    let wrapperClasses = [ 'vce-image-masonry-gallery-wrapper vce' ]
    let containerProps = {}

    let CustomTag = 'div'
    let columnData = this.state && this.state.columnData
    let columnHtml = []
    if (columnData) {
      columnData.forEach((col, index) => {
        let galleryItems = []
        col && col.forEach((src, index) => {
          let imgSrc = this.getImageUrl(src)
          let customProps = {}
          let classes = 'vce-image-masonry-gallery-item'
          let imgClasses = 'vce-image-masonry-gallery-img'
          let customImageProps = {
            'alt': src && src.alt ? src.alt : '',
            'title': src && src.title ? src.title : ''
          }

          if (clickableOptions === 'url' && image[ index ].link && image[ index ].link.url) {
            CustomTag = 'a'
            let { url, title, targetBlank, relNofollow } = image[ index ].link
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

          galleryItems.push(
            <CustomTag {...customProps} className={classes} key={`vce-image-masonry-gallery-item-${index}-${id}`}>
              <img className={imgClasses} src={this.getImageUrl(src)} {...customImageProps} />
            </CustomTag>
          )
        })
        columnHtml.push(
          <div className='vce-image-masonry-gallery-column' key={`vce-image-masonry-gallery-col-${index}-${id}`}>
            {galleryItems}
          </div>
        )
      })
    }

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

    if (metaCustomId) {
      containerProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

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
