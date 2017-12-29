import React from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import vcCake from 'vc-cake'
import PropTypes from 'prop-types'

export default class SearchElement extends React.Component {
  static propTypes = {
    allCategories: PropTypes.array.isRequired,
    index: PropTypes.any.isRequired,
    changeActive: PropTypes.func.isRequired,
    changeTerm: PropTypes.func.isRequired,
    changeInput: PropTypes.func.isRequired
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
    this.handleCategorySelect = this.handleCategorySelect.bind(this)
    this.handleCategoryClick = this.handleCategoryClick.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)

    this.mobileDetect = vcCake.env('MOBILE_DETECT') ? new MobileDetect(window.navigator.userAgent) : null
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

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  handleSearch (e) {
    let inputVal = e.currentTarget.value.toLowerCase()
    this.setState({
      inputValue: e.currentTarget.value,
      activeIndex: 0,
      content: this.getContentTitle(0)
    })
    this.props.changeActive(0)
    this.props.changeTerm('search')
    this.props.changeInput(inputVal)
  }

  getContentTitle (index) {
    if (index.indexOf && index.indexOf('-') > -1) {
      index = index.split('-')
      const group = this.props.allCategories[ index[ 0 ] ]
      const category = group && group.categories && group.categories[ index[ 1 ] ]

      return category ? category.title : ''
    }
    return this.props.allCategories[ index ] ? this.props.allCategories[ index ].title : ''
  }

  handleCategorySelect (e) {
    this.setState({
      inputValue: '',
      activeIndex: e.currentTarget.value,
      content: this.getContentTitle(e.currentTarget.value)
    })
    this.props.changeActive(e.currentTarget.value)
    this.props.changeTerm('')
  }

  getSelectOptions (categories, groupIndex) {
    let options = []
    categories.forEach((item) => {
      options.push(<option key={`search-select-item-${item.id}-${item.index}`}
        value={`${groupIndex}-${item.index}`}>{item.title}</option>)
    })
    return options
  }

  getSelectGroups () {
    let optGroup = []
    this.props.allCategories.forEach((item, index) => {
      if (item.categories) {
        optGroup.push(<optgroup key={`search-select-group-item-${item.id}-${item.index}`} label={item.title}>
          {this.getSelectOptions(item.categories, index)}
        </optgroup>)
      } else {
        optGroup.push(<option key={`search-select-item-${item.id}-${item.index}`}
          value={item.index}>{item.title}</option>)
      }
    })

    return optGroup
  }

  getCategorySelect () {
    return <select
      className='vcv-ui-form-dropdown'
      onChange={this.handleCategorySelect}
      value={this.state.activeIndex}
    >
      {this.getSelectGroups()}
    </select>
  }

  handleCategoryClick () {
    this.setState({ dropdown: true })
    this.dropdownTimeout = setTimeout(() => {
      this.setState({ dropdown: false })
    }, 400)
  }

  handleInputFocus () {
    this.setState({ input: true })
    this.inputTimeout = setTimeout(() => {
      this.setState({ input: false })
    }, 400)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const searchPlaceholder = localizations ? localizations.searchContentElements : 'Search content elements'

    let dropdownContainerClasses = classNames({
      'vcv-ui-editor-search-dropdown-container': true,
      'vcv-ui-editor-field-highlight': this.state.dropdown
    })
    let inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
    })
    let autoFocus = vcCake.env('MOBILE_DETECT') ? !this.mobileDetect.mobile() : true

    return <div className='vcv-ui-editor-search-container'>
      <div
        className={dropdownContainerClasses}
        data-content={this.state.content}
        onClick={this.handleCategoryClick}
      >
        {this.getCategorySelect()}
      </div>
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
          placeholder={searchPlaceholder}
          autoFocus={autoFocus}
          onKeyPress={this.handleKeyPress}
        />
      </div>
    </div>
  }
}
