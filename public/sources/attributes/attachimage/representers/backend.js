import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'

export default class Backend extends Representer {
  getUrls (value, assetsPath) {
    let urls = []
    if (typeof value === 'string') {
      urls = [ assetsPath + value ]
    } else if (Array.isArray(value)) {
      urls = value.map((file) => {
        return assetsPath + file
      })
    } else {
      urls = value.urls
    }

    return urls
  }

  getImages (urls, elementId) {
    return urls.map((url, i) => {
      let urlData = {
        src: url && url.thumbnail ? url.thumbnail : (url && url.full ? url.full : url),
        alt: url && url.alt ? url.alt : (typeof url === 'string' ? 'Default image' : ''),
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

  render () {
    let { value } = this.state
    let urls = this.getUrls(value, this.props.element.metaAssetsPath)

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
