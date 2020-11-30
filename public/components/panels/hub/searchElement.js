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
    applyFirstElement: PropTypes.func
  }

  inputTimeout = 0
  mobileDetect = null

  constructor (props) {
    super(props)
    this.state = {
      inputValue: this.props.inputValue || '',
      input: false
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.getPlaceholder = this.getPlaceholder.bind(this)
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

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps && nextProps.inputValue !== this.state.inputValue) {
      // Update search from props
      this.setState({
        inputValue: nextProps.inputValue
      })
    }
  }

  /* eslint-enable */
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
    this.props.selectEvent && this.props.selectEvent.constructor === Function && this.props.selectEvent('0')
    this.setState({
      inputValue: inputVal
    })

    this.props.changeInput(inputVal)
  }

  getSelectOptions (categories, groupIndex) {
    const options = []
    categories.forEach((item) => {
      options.push(
        <option
          key={`search-select-item-${item.id}-${item.index}`}
          value={`${groupIndex}-${item.index}`}
        >
          {item.title}
        </option>
      )
    })
    return options
  }

  handleInputFocus () {
    this.setState({ input: true })
    this.inputTimeout = setTimeout(() => {
      this.setState({ input: false })
    }, 400)
  }

  getPlaceholder () {
    let result = ''
    const localizations = dataManager.get('localizations')

    switch (this.props.inputPlaceholder) {
      case 'elements':
        result = localizations ? localizations.searchContentElements : 'Search for content elements'
        break
      case 'elements and templates':
        result = localizations ? localizations.searchContentElementsAndTemplates : 'Search for content elements and templates'
        break
      case 'templates':
        result = localizations ? localizations.searchContentTemplates : 'Search for templates'
        break
      default:
        result = localizations ? localizations.searchContentElements : 'Search for content elements'
    }

    return result
  }

  render () {
    const localizations = dataManager.get('localizations')
    const VCHubIsAnOnlineLibrary = localizations ? localizations.VCHubIsAnOnlineLibrary : '<a href="https://visualcomposer.com/help/visual-composer-hub/?utm_source=vcwb&utm_medium=editor&utm_campaign=info&utm_content=helper-point" target="_blank" rel="noopener noreferrer">Visual Composer Hub</a> is an online library where to search and download content elements, templates, add-ons, stock images, and GIFs.'

    const inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
    })
    const autofocus = !this.mobileDetect.mobile()

    return (
      <div className='vcv-ui-editor-search-container'>
        <div className={inputContainerClasses}>
          <label className='vcv-ui-editor-search-icon-container' htmlFor='add-element-search'>
            <i className='vcv-ui-icon vcv-ui-icon-search' />
          </label>
          <input
            className='vcv-ui-form-input vcv-ui-editor-search-field'
            id='add-element-search'
            onChange={this.handleSearch}
            onFocus={this.handleInputFocus}
            type='text'
            ref={this.autoFocusInputRef}
            placeholder={this.getPlaceholder()}
            value={this.state.inputValue}
            autoFocus={typeof this.props.autoFocus !== 'undefined' ? this.props.autoFocus && autofocus : autofocus}
            onKeyPress={this.handleKeyPress}
          />
        </div>
        <Tooltip>
          {VCHubIsAnOnlineLibrary}
        </Tooltip>
      </div>
    )
  }
}
