import React from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'
import Tooltip from '../../tooltip/tooltip'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

export default class SearchElement extends React.Component {
  static propTypes = {
    changeInput: PropTypes.func.isRequired,
    applyFirstElement: PropTypes.func,
    filterType: PropTypes.string
  }

  inputTimeout = 0
  mobileDetect = null

  constructor (props) {
    super(props)
    this.state = {
      input: false
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
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

  componentWillUnmount () {
    if (this.inputTimeout) {
      window.clearTimeout(this.inputTimeout)
      this.inputTimeout = 0
    }
  }

  handleKeyPress (e) {
    if (e.key === 'Enter' && this.props.applyFirstElement) {
      e.preventDefault()
      this.props.applyFirstElement()
    }
  }

  handleSearch (e) {
    const inputVal = e.currentTarget.value
    this.props.changeInput(inputVal)
  }

  handleInputFocus () {
    this.setState({ input: true })
    this.inputTimeout = setTimeout(() => {
      this.setState({ input: false })
    }, 400)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const VCHubIsAnOnlineLibrary = localizations ? localizations.VCHubIsAnOnlineLibrary : '<a href="https://help.visualcomposer.com/docs/visual-composer-hub/what-is-visual-composer-hub/?utm_source=vcwb&utm_medium=editor&utm_campaign=info&utm_content=helper-point" target="_blank" rel="noopener noreferrer">Visual Composer Hub</a> is an online library where to search and download content elements, templates, add-ons, stock images, and GIFs.'
    const placeholder = localizations ? localizations.searchWithinCategory : 'Search within this category'
    const isDisabled = this.props.filterType === 'giphy' || this.props.filterType === 'unsplash'

    const inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
    })
    const labelClasses = classNames({
      'vcv-ui-editor-search-icon-container': true,
      'vcv-ui-editor-search-icon-container--disabled': isDisabled
    })
    const autofocus = !this.mobileDetect.mobile()

    return (
      <div className='vcv-ui-editor-search-container'>
        <div className={inputContainerClasses}>
          <label className={labelClasses} htmlFor='add-element-search'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
          <input
            className='vcv-ui-form-input vcv-ui-editor-search-field'
            autoComplete='off'
            id='add-element-search'
            onChange={this.handleSearch}
            onFocus={this.handleInputFocus}
            type='text'
            ref={this.autoFocusInputRef}
            placeholder={placeholder}
            value={this.props.inputValue}
            autoFocus={typeof this.props.autoFocus !== 'undefined' ? this.props.autoFocus && autofocus : autofocus}
            onKeyPress={this.handleKeyPress}
            disabled={isDisabled}
          />
        </div>
        <Tooltip>
          {VCHubIsAnOnlineLibrary}
        </Tooltip>
      </div>
    )
  }
}
