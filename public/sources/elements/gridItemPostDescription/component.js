/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    // TODO: Style
    return (
      <article className='vce-posts-grid-item'>
        <div className='vce-post-description vce-post-description--with-background'>
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
