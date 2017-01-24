/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  currentImg = 0

  constructor (props) {
    super(props)
    this.loadImage = this.loadImage.bind(this)
  }

  componentDidMount () {
    this.prepareImages(this.props.atts)
  }

  componentDidUpdate (prevProps) {
    let isEqual = require('lodash').isEqual
    // if (!isEqual(this.getImageUrl(this.props.atts.image), this.getImageUrl(prevProps.atts.image)) || this.props.atts.columns !== prevProps.atts.columns || this.props.atts.clickableOptions !== prevProps.atts.clickableOptions) {
    this.currentImg = 0
    this.prepareImages(this.props.atts, true)
    // }
  }

  prepareImages (atts, clearColumns = false) {
    let { image } = atts
    let imgSources = this.getImageUrl(image)
    let cols = this.getDomNode().querySelectorAll('.vce-image-masonry-gallery-column')

    if (clearColumns) {
      cols.forEach((col) => {
        while (col.firstChild) {
          col.removeChild(col.firstChild)
        }
      })
    }

    this.loadImage(imgSources, cols)
  }

  loadImage (imgSources, cols) {
    let img = new window.Image()
    img.src = imgSources[ this.currentImg ]
    this.insertImage(cols, img)
    img.onload = this.imgLoadHandler.bind(this, imgSources, cols)
  }

  imgLoadHandler (imgSources, cols) {
    this.currentImg++
    if (this.currentImg < imgSources.length) {
      this.loadImage(imgSources, cols)
    }
  }

  insertImage (cols, imgElement) {
    let { image, clickableOptions } = this.props.atts
    let img = image[ this.currentImg ]
    imgElement.className = 'vce-image-masonry-gallery-img'
    let customImageProps = {
      'alt': img && img.alt ? img.alt : '',
      'title': img && img.title ? img.title : ''
    }
    this.setAttributes(imgElement, customImageProps)

    let imgContainer = this.createImgContainer(clickableOptions, img, imgElement)

    imgContainer.appendChild(imgElement)

    let smallestColIndex = this.getSmallestColumn(cols)
    cols[ smallestColIndex ].appendChild(imgContainer)
  }

  createImgContainer (clickableOptions, img, imgElement) {
    let customProps = {}
    let CustomTag = 'div'
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
        'href': imgElement.src,
        'target': '_blank'
      }
    } else if (clickableOptions === 'lightbox') {
      CustomTag = 'a'
      customProps = {
        'href': imgElement.src,
        'data-lightbox': `lightbox-${this.props.id}`
      }
    }

    let imgContainer = document.createElement(CustomTag)
    imgContainer.className = 'vce-image-masonry-gallery-item'
    this.setAttributes(imgContainer, customProps)

    return imgContainer
  }

  setAttributes (el, attrs) {
    for (let key in attrs) {
      el.setAttribute(key, attrs[ key ])
    }
  }

  getSmallestColumn (cols) {
    let colHeight = []
    cols.forEach((col) => {
      colHeight.push(col.offsetHeight)
    })
    return this.getSmallestFromArray(colHeight)
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
    let { image, designOptions, shape, customClass, columns } = atts
    let containerClasses = [ 'vce-image-masonry-gallery' ]
    let wrapperClasses = [ 'vce-image-masonry-gallery-wrapper vce' ]
    let containerProps = {}

    let columnHtml = []

    columns <= 0 ? columns = 1 : ''
    for (let i = 0; i < columns; i++) {
      columnHtml.push(
        <div className='vce-image-masonry-gallery-column' key={`vce-image-masonry-gallery-col-${i}-${id}`}/>
      )
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

    return (
      <div className={containerClasses.join(' ')} {...editor} {...containerProps}>
        <div className={wrapperClasses.join(' ')} id={'el-' + id}>
          <div className='vce-image-masonry-gallery-list'>
            {columnHtml}
          </div>
        </div>
      </div>
    )
  }
}
