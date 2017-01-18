/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    // TODO: Style
    const classNames = require('classnames')
    let { padding, background, animation } = this.props.atts
    let postDescriptionClasses = classNames({
      'vce-post-description': true,
      'vce-post-description--full': !padding,
      'vce-post-description--animation': animation
    })
    let backgroundStyle = {}
    if (background) {
      backgroundStyle.backgroundColor = background
    }
    return (
      <article className='vce-posts-grid-item'>
        <div className={postDescriptionClasses} style={backgroundStyle}>
          <div className='vce-post-description--background-wrapper-box'>
            <div className='vce-post-description--background-wrapper'>
              {`{{custom_post_description_featured_image}}`}
            </div>
          </div>
          <div className='vce-post-description--content'>
            <div className='vce-post-description--title'>{`{{post_title}}`}</div>
            <div className='vce-post-description--excerpt'>{`{{post_teaser}}`}</div>
          </div>
        </div>
      </article>
    )
  }
}
