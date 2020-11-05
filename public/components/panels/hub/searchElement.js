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
      inputValue: '',
      input: false
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)

    this.mobileDetect = new MobileDetect(window.navigator.userAgent)
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

  render () {
    const localizations = dataManager.get('localizations')
    const VCHubIsAnOnlineLibrary = localizations ? localizations.VCHubIsAnOnlineLibrary : '<a href="https://visualcomposer.com/help/visual-composer-hub/">Visual Composer Hub</a> is an online library where to search and download content elements, templates, add-ons, stock images, and GIFs.'

    const inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
    })
    const autoFocus = !this.mobileDetect.mobile()

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
            value={this.state.inputValue}
            autoFocus={autoFocus}
            onKeyPress={this.handleKeyPress}
          />
          <Tooltip>
            {VCHubIsAnOnlineLibrary}
          </Tooltip>
        </div>
      </div>
    )
  }
}
