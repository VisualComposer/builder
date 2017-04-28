import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')
const cook = vcCake.getService("cook")

export default class PostsGridItemPostDescription extends vcvAPI.elementComponent {
  render () {
    const classNames = require('classnames')
    let { padding, background, animation } = this.props.atts
    let postDescriptionClasses = classNames({
      'vce-post-description': true,
      'vce-post-description--full': !padding,
      'vce-post-description--animation': animation,
      'vce-post-description--has-background': padding && background
    })
    let backgroundStyle = {}
    if (padding && background) {
      backgroundStyle.backgroundColor = background
    }

    return (
      <article className='vce-posts-grid-item' itemScope='true' itemType='http://schema.org/Article'>
        <div className={postDescriptionClasses} style={backgroundStyle}>
          <a href='{{post_permalink}}' className='vce-post-description-link' itemProp='sameAs' />
          {`{{custom_post_description_featured_image}}`}
          {`{{custom_post_description_content}}`}
        </div>
      </article>
    )
  }
}
