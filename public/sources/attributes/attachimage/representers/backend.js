import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {

  getImageUrl (image, size) {
    let imageUrl
    // Move it to attribute
    if (size && image && image[ size ]) {
      imageUrl = image[ size ]
    } else {
      if (image instanceof Array) {
        let urls = []
        image.forEach((item) => {
          let url = item && item.full && item.id ? item.full : (item && item.full ? this.getPublicImage(item.full) : this.getPublicImage(item))
          urls.push(url)
        })
        imageUrl = urls
      } else {
        imageUrl = image && image.full && image.id ? image.full : (image && image.full ? this.getPublicImage(image.full) : this.getPublicImage(image))
      }
    }

    return imageUrl
  }

  getUrls (value) {
    let urls = []
    if (typeof value === 'string') {
      urls = [ this.getPublicImage(value) ]
    } else if (Array.isArray(value)) {
      urls = value.map((file) => {
        return this.getPublicImage(file)
      })
    } else {
      urls = value.urls
    }

    return urls
  }

  getImages (urls, elementId) {
    return urls.map((url, i) => {
      let urlData = {
        src: this.getImageUrl(url),
        alt: url && url.alt ? url.alt : '',
        id: url && url.id ? url.id : i
      }

      return (
        <img
          className='vcv-wpbackend-attr-representer-attach-image--preview'
          src={urlData.src}
          alt={urlData.alt}
          key={`representer-image-${urlData.id}-${elementId}-${i}`}
        />
      )
    })
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props.element
    if (!filename) {
      return ''
    }

    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    let { value } = this.state
    let urls = this.getUrls(value)

    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-attach-image': true
    })

    return (
      <div className={classes}>
        <div className='vcv-wpbackend-attr-representer-attach-image--wrapper'>
          {this.getImages(urls, this.props.element.id)}
        </div>
      </div>
    )
  }
}
