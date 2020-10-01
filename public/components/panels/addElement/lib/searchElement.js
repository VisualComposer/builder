import React from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

export default class SearchElement extends React.Component {
  static propTypes = {
    allCategories: PropTypes.array.isRequired,
    index: PropTypes.any.isRequired,
    changeActive: PropTypes.func.isRequired,
    changeTerm: PropTypes.func.isRequired,
    changeInput: PropTypes.func.isRequired,
    applyFirstElement: PropTypes.func
  }

  inputTimeout = 0
  dropdownTimeout = 0
  mobileDetect = null

  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      activeIndex: this.props.index,
      content: this.getContentTitle(this.props.index),
      dropdown: false,
      input: false
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleCategoryChange = this.handleCategoryChange.bind(this)
    this.handleCategorySelect = this.handleCategorySelect.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.getPlaceholder = this.getPlaceholder.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)

    this.mobileDetect = new MobileDetect(window.navigator.userAgent)
  }

  componentWillUnmount () {
    if (this.inputTimeout) {
      window.clearTimeout(this.inputTimeout)
      this.inputTimeout = 0
    }
    if (this.dropdownTimeout) {
      window.clearTimeout(this.dropdownTimeout)
      this.dropdownTimeout = 0
    }
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      activeIndex: nextProps.index,
      content: this.getContentTitle(nextProps.index)
    })
  }

  /* eslint-enable */

  handleKeyPress (e) {
    if (e.key === 'Enter' && this.props.applyFirstElement) {
      e.preventDefault()
      this.props.applyFirstElement()
    }
  }

  handleSearch (e) {
    const inputVal = e.currentTarget.value.toLowerCase()
    this.props.selectEvent && this.props.selectEvent.constructor === Function && this.props.selectEvent('0')
    this.setState({
      inputValue: e.currentTarget.value,
      activeIndex: 0,
      content: this.getContentTitle('0')
    })
    this.props.changeActive('0')
    this.props.changeTerm('search')
    this.props.changeInput(inputVal)
  }

  getContentTitle (index) {
    if (index.indexOf && index.indexOf('-') > -1) {
      index = index.split('-')
      const group = this.props.allCategories[index[0]]
      const category = group && group.categories && group.categories[index[1]]

      return category ? category.title : ''
    }
    return this.props.allCategories[index] ? this.props.allCategories[index].title : ''
  }

  handleCategoryChange (value) {
    this.setState({
      inputValue: '',
      activeIndex: value,
      content: this.getContentTitle(value)
    })
    this.props.changeActive(value)
    this.props.changeTerm('')
  }

  handleCategorySelect (e) {
    this.props.selectEvent && this.props.selectEvent.constructor === Function && this.props.selectEvent(e.currentTarget.value)

    this.setState({
      inputValue: '',
      activeIndex: e.currentTarget.value,
      content: this.getContentTitle(e.currentTarget.value)
    })
    this.props.changeActive(e.currentTarget.value)
    this.props.changeTerm('')
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

  getSelectGroups () {
    const optGroup = []
    this.props.allCategories.forEach((item, index) => {
      if (item.categories) {
        optGroup.push(
          <optgroup key={`search-select-group-item-${item.id}-${item.index}`} label={item.title}>
            {this.getSelectOptions(item.categories, index)}
          </optgroup>
        )
      } else {
        optGroup.push(
          <option
            key={`search-select-item-${item.id}-${item.index}`}
            value={item.index}
          >
            {item.title}
          </option>
        )
      }
    })

    return optGroup
  }

  handleInputFocus () {
    this.setState({ input: true })
    this.inputTimeout = setTimeout(() => {
      this.setState({ input: false })
    }, 400)
  }

  getPlaceholder () {
    let result = ''
    const localizations = window.VCV_I18N && window.VCV_I18N()

    switch (this.props.inputPlaceholder) {
      case 'elements':
        result = localizations ? localizations.searchContentElements : 'Search content elements'
        break
      case 'elements and templates':
        result = localizations ? localizations.searchContentElementsAndTemplates : 'Search content elements and templates'
        break
      case 'templates':
        result = localizations ? localizations.searchContentTemplates : 'Search content templates'
        break
      default:
        result = localizations ? localizations.searchContentElements : 'Search content elements'
    }

    return result
  }

  render () {
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
            placeholder={this.getPlaceholder()}
            autoFocus={autoFocus}
            onKeyPress={this.handleKeyPress}
          />
        </div>
      </div>
    )
  }
}
