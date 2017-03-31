import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import vcCake from 'vc-cake'

const cook = vcCake.getService('cook')

export default class Backend extends Representer {
  getUrls (value, cookElement) {
    let urls = []
    let elementPath = cookElement.get('metaElementPath')
    if (typeof value === 'string') {
      urls = [ elementPath + value ]
    } else if (Array.isArray(value)) {
      urls = value.map((file) => {
        return elementPath + file
      })
    } else {
      urls = value.urls
    }

    return urls
  }

  getImages (urls, cookElement) {
    return urls.map((url, i) => {
      let urlData = {
        src: url && url.thumbnail ? url.thumbnail : url,
        alt: url && url.alt ? url.alt : 'Default image',
        id: url && url.id ? url.id : i
      }

      return (
        <img
          className='vcv-wpbackend-attr-representer-attach-image--preview'
          src={urlData.src}
          alt={urlData.alt}
          key={`representer-image-${urlData.id}-${cookElement.get('id')}`}
        />
      )
    })
  }

  render () {
    let { value } = this.state
    let cookElement = cook.get(this.props.element)
    let urls = this.getUrls(value, cookElement)

    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-attach-image': true
    })

    return (
      <div className={classes}>
        <div className='vcv-wpbackend-attr-representer-attach-image--wrapper'>
          {this.getImages(urls)}
        </div>
      </div>
    )
  }
}
