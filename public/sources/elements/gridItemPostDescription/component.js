/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  render () {
    return (
      <article className='vce-post-description vce-post-description--full'>
        <div className='vce-post-description--background-wrapper-box'>
          <div className='vce-post-description--background-wrapper'>
            <div className='vce-post-description--background' />
          </div>
        </div>
        <div className='vce-post-description--content'>
          <div className='vce-post-description--title'>{`{{post_title}}`}</div>
          <div className='vce-post-description--excerpt'>{`{{the_excerpt}}`}</div>
        </div>
      </article>
    )
  }
}
