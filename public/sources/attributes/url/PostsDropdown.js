import React from 'react'
import PropTypes from 'prop-types'

export default class PostsDropdown extends React.Component {
  static propTypes = {
    posts: PropTypes.object.isRequired,
    onPostSelection: PropTypes.func.isRequired,
    shouldRenderExistingPosts: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
    isRequestInProcess: PropTypes.bool.isRequired
  }

  getSelectedValue () {
    if (this.props.value.url === '') {
      return 'default'
    }
    const activeIndex = this.props.posts.data.findIndex(item => `#vcv-popup-${item.id}` === this.props.value.url)
    if (activeIndex > -1) {
      return this.props.value.url
    } else {
      return 'default'
    }
  }

  renderExistingPosts () {
    const noExistingContentFound = this.localizations ? this.localizations.noExistingContentFound : 'Nothing found'
    const selectPopupTemplate = this.localizations ? this.localizations.selectPopupTemplate : 'Select popup template'
    const items = []
    const { posts } = this.props

    if (!posts.get().length) {
      return (
        <div className='vcv-ui-form-message'>
          {noExistingContentFound}
        </div>
      )
    }
    posts.get().forEach((post) => {
      items.push(
        <option
          key={'vcv-selectable-post-url-' + post.id}
          value={`#vcv-popup-${post.id}`}
        >
          {post.title}
        </option>
      )
    })

    return (
      <select
        className='vcv-ui-form-dropdown'
        value={this.getSelectedValue()}
        onChange={(e) => this.props.onPostSelection(e, null, e.target.value)}
      >
        <option value='default' disabled>{selectPopupTemplate}</option>
        {items}
      </select>
    )
  }

  render () {
    if (!this.props.shouldRenderExistingPosts) {
      return null
    }

    return (
      <div>
        {this.props.isRequestInProcess ? <span className='vcv-ui-wp-spinner' /> : this.renderExistingPosts()}
      </div>
    )
  }
}
