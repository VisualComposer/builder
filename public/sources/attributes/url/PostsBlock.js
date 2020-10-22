import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class PostsBlock extends React.Component {
  static propTypes = {
    posts: PropTypes.object.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    onPostSelection: PropTypes.func.isRequired,
    shouldRenderExistingPosts: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
    isRequestInProcess: PropTypes.bool.isRequired
  }

  renderExistingPosts () {
    const noExistingContentFound = this.localizations ? this.localizations.noExistingContentFound : 'Nothing found'
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
      const rowClassName = classNames({
        'vcv-ui-form-table-link-row': true,
        'vcv-ui-state--active': this.props.value.url === post.url
      })
      const title = post.type
      items.push(
        <tr
          key={'vcv-selectable-post-url-' + post.id} className={rowClassName}
          onClick={(e) => this.props.onPostSelection(e, post.url, post.id)}
        >
          <td>
            <a href={post.url} onClick={(e) => { e && e.preventDefault() }}>{post.title}</a>
          </td>
          <td>
            <div className='vcv-ui-form-table-link-type' title={title.toUpperCase()}>
              {title.toUpperCase()}
            </div>
          </td>
        </tr>
      )
    })

    return (
      <table className='vcv-ui-form-table'>
        <tbody>{items}</tbody>
      </table>
    )
  }

  render () {
    const linkToExistingContent = this.localizations ? this.localizations.linkToExistingContent : 'Or link to an existing content'
    const searchExistingContent = this.localizations ? this.localizations.searchExistingContent : 'Search existing content'
    if (!this.props.shouldRenderExistingPosts) {
      return null
    }

    return (
      <div className='vcv-ui-form-group'>
        <p className='vcv-ui-form-helper'>
          {linkToExistingContent}
        </p>
        <div className='vcv-ui-input-search'>
          <input
            type='search'
            className='vcv-ui-form-input'
            onChange={this.props.onSearchChange}
            placeholder={searchExistingContent}
          />
          <label className='vcv-ui-form-input-search-addon'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
        </div>
        {this.props.isRequestInProcess ? <span className='vcv-ui-wp-spinner' /> : this.renderExistingPosts()}
      </div>
    )
  }
}
