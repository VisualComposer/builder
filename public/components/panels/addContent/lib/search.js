import React from 'react'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import Tooltip from '../../../tooltip/tooltip'
import vcCake from 'vc-cake'
const dataManager = vcCake.getService('dataManager')

export default class Search extends React.Component {
  static localizations = dataManager.get('localizations')

  static propTypes = {
    searchValue: PropTypes.string.isRequired,
    onSearchChange: PropTypes.func.isRequired,
    setFirstElement: PropTypes.func.isRequired,
    searchPlaceholder: PropTypes.string
  }

  mobileDetect = null

  constructor (props) {
    super(props)

    this.handleSearch = this.handleSearch.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.mobileDetect = new MobileDetect(window.navigator.userAgent)
  }

  handleSearch (e) {
    this.props.onSearchChange(e.currentTarget.value)
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.props.setFirstElement()
    }
  }

  render () {
    const autofocus = !this.mobileDetect.mobile()
    const searchForContentElementsAndTemplates = Search.localizations ? Search.localizations.searchForContentElementsAndTemplates : 'Search for content elements and templates to add to your layout.'
    return (
      <div className='vcv-ui-editor-search-container'>
        <div className='vcv-ui-editor-search-field-container'>
          <label className='vcv-ui-editor-search-icon-container' htmlFor='add-content-search'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
          <input
            className='vcv-ui-form-input vcv-ui-editor-search-field'
            id='add-content-search'
            onChange={this.handleSearch}
            onKeyPress={this.handleKeyPress}
            type='text'
            value={this.props.searchValue}
            placeholder={this.props.searchPlaceholder}
            autoFocus={autofocus}
          />
        </div>
        <Tooltip>
          {searchForContentElementsAndTemplates}
        </Tooltip>
      </div>
    )
  }
}
