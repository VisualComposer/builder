import React from 'react'
import classNames from 'classnames'
import Representer from '../../representer'
import vcCake from 'vc-cake'

const AssetsManager = vcCake.env('FEATURE_ASSETS_MANAGER') ? vcCake.getService('assets-manager') : vcCake.getService('wipAssetsManager')

export default class Backend extends Representer {
  getDefaultPlaceHolder (url) {
    return <img
      className='vcv-wpbackend-attr-representer-attach-image--preview'
      src={url}
      alt='Default image'
      key={`representer-image-default`}
    />
  }

  getImages (urls) {
    return urls.map((url) => {
      return <img
        className='vcv-wpbackend-attr-representer-attach-image--preview'
        src={url.thumbnail}
        alt={url.alt}
        key={`representer-image-${url.id}`}
      />
    })
  }

  render () {
    let { value } = this.state
    let output
    if (typeof value === 'string') {
      let url = AssetsManager.getPublicPath(this.props.element.tag, value)
      output = this.getDefaultPlaceHolder(url)
    } else {
      output = this.getImages(value.urls)
    }

    let classes = classNames({
      'vcv-wpbackend-attributes-content': true,
      'vcv-wpbackend-attributes-content-block': true,
      'vcv-wpbackend-attr-representer-attach-image': true
    })

    return <div className={classes}>
      <div className='vcv-wpbackend-attr-representer-attach-image--wrapper'>
        {output}
      </div>
    </div>
  }
}
