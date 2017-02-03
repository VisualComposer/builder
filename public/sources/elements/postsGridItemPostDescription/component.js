/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
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
          <div className='vce-post-description--content'>
            <div className='vce-post-description--title'>
              <h3 itemProp='name'>
                <a href='{{post_permalink}}'>{`{{post_title}}`}</a>
              </h3>
            </div>
            <div className='vce-post-description--excerpt' itemProp='description'>{`{{post_teaser}}`}</div>
          </div>
        </div>
      </article>
    )
  }
}
