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

  constructor (props) {
    super(props)

    this.handleSelectChange = this.handleSelectChange.bind(this)
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

  getTitle (posts, id) {
    let title = ''
    for (let i = 0; i < posts.length; i++) {
      if (`#vcv-popup-${posts[i].id}` === id) {
        title = posts[i].title
        break
      }
    }
    return title
  }

  handleSelectChange (e) {
    const id = e.target.value
    this.props.onPostSelection(e, null, id, this.getTitle(this.props.posts.data, id))
  }

  renderExistingPosts () {
    const noExistingContentFound = this.localizations ? this.localizations.noExistingContentFound : 'Nothing found'
    const selectPopupTemplate = this.localizations ? this.localizations.selectPopupTemplate : 'Select a popup template'
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
      const postTitle = post.title || post.id
      items.push(
        <option
          key={'vcv-selectable-post-url-' + post.id}
          value={`#vcv-popup-${post.id}`}
        >
          {postTitle}
        </option>
      )
    })

    return (
      <select
        className='vcv-ui-form-dropdown'
        value={this.getSelectedValue()}
        onChange={this.handleSelectChange}
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
