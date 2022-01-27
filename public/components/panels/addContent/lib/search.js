import React from 'react'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'

const roleManager = getService('roleManager')

export default class Search extends React.Component {
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
    this.autoFocusInputRef = React.createRef()
  }

  componentDidMount () {
    this.focusInput()
  }

  componentDidUpdate () {
    this.focusInput()
  }

  focusInput () {
    const autofocus = !this.mobileDetect.mobile()
    if (typeof this.props.autoFocus !== 'undefined' ? this.props.autoFocus && autofocus : autofocus) {
      this.autoFocusInputRef && this.autoFocusInputRef.current && this.autoFocusInputRef.current.focus()
    }
  }

  handleSearch (e) {
    this.props.onSearchChange(e.currentTarget.value)
  }

  handleKeyPress (e) {
    const isAbleToAdd = roleManager.can('editor_content_element_add', roleManager.defaultTrue())
    if (e.key === 'Enter' && isAbleToAdd) {
      e.preventDefault()
      this.props.setFirstElement()
    }
  }

  render () {
    const autofocus = !this.mobileDetect.mobile()

    return (
      <div className='vcv-ui-editor-search-container'>
        <div className='vcv-ui-editor-search-field-container'>
          <label className='vcv-ui-editor-search-icon-container' htmlFor='add-content-search'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
          <input
            className='vcv-ui-form-input vcv-ui-editor-search-field'
            autoComplete='off'
            id='add-content-search'
            onChange={this.handleSearch}
            onKeyPress={this.handleKeyPress}
            type='text'
            ref={this.autoFocusInputRef}
            value={this.props.searchValue}
            placeholder={this.props.searchPlaceholder}
            autoFocus={typeof this.props.autoFocus !== 'undefined' ? this.props.autoFocus && autofocus : autofocus}
          />
        </div>
      </div>
    )
  }
}
