import React from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

export default class Search extends React.Component {
  static propTypes = {
    searchValue: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    searchPlaceholder: PropTypes.string
  }

  mobileDetect = null

  constructor (props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
    this.mobileDetect = new MobileDetect(window.navigator.userAgent)
  }

  handleSearch (e) {
    this.props.onSearchChange(e.currentTarget.value)
  }

  render () {
    const inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true
    })

    const autofocus = !this.mobileDetect.mobile()
    return (
      <div className='vcv-ui-editor-search-container'>
        <div className={inputContainerClasses}>
          <label className='vcv-ui-editor-search-icon-container' htmlFor='add-content-search'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
          <input
            className='vcv-ui-form-input vcv-ui-editor-search-field'
            id='add-content-search'
            onChange={this.handleSearch}
            type='text'
            value={this.props.searchValue}
            placeholder={this.props.searchPlaceholder}
            autoFocus={autofocus}
          />
        </div>
      </div>
    )
  }
}
