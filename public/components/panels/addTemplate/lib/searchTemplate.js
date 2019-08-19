import React from 'react'
import classNames from 'classnames'
import MobileDetect from 'mobile-detect'
import PropTypes from 'prop-types'

export default class SearchTemplate extends React.Component {
  static propTypes = {
    inputValue: PropTypes.string.isRequired,
    changeSearchState: PropTypes.func.isRequired,
    changeSearchInput: PropTypes.func.isRequired,
    allCategories: PropTypes.array.isRequired,
    index: PropTypes.any.isRequired,
    changeActiveCategory: PropTypes.func.isRequired
  }
  mobileDetect = null

  constructor (props) {
    super(props)
    this.state = {
      activeIndex: this.props.index,
      dropdown: false,
      content: this.props.allCategories[this.props.index].title
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.getCategorySelect = this.getCategorySelect.bind(this)
    this.handleCategorySelect = this.handleCategorySelect.bind(this)

    this.mobileDetect = new MobileDetect(window.navigator.userAgent)
  }

  UNSAFE_componentWillReceiveProps (nextProps) {
    if (nextProps.index !== this.state.activeIndex) {
      this.setState({
        activeIndex: nextProps.index,
        content: this.props.allCategories[ nextProps.index ].title
      })
    }
  }

  // Get HTML elements

  getCategorySelect () {
    let options = []
    this.props.allCategories.forEach((item) => {
      if (item.visible) {
        options.push(<option key={item.id} value={item.index}>{item.title}</option>)
      }
    })
    return <select
      className='vcv-ui-form-dropdown'
      onChange={this.handleCategorySelect}
      value={this.state.activeIndex}
    >
      {options}
    </select>
  }

  // Event handlers

  handleSearch (e) {
    this.setState({
      content: this.props.allCategories[0].title
    })
    this.props.changeSearchInput(e.currentTarget.value)
    this.props.changeSearchState(true)
    this.props.changeActiveCategory(0)
  }

  handleCategorySelect (e) {
    this.setState({
      content: this.props.allCategories[e.currentTarget.value].title
    })
    this.props.changeActiveCategory(e.currentTarget.value)
    this.props.changeSearchState(false)
    this.props.changeSearchInput('')
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const searchPlaceholder = localizations ? localizations.searchTemplates : 'Search templates by name and description'

    let inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true
    })
    let dropdownContainerClasses = classNames({
      'vcv-ui-editor-search-dropdown-container': true
    })

    let autofocus = !this.mobileDetect.mobile()
    return <div className='vcv-ui-editor-search-container'>
      <div
        className={dropdownContainerClasses}
        data-content={this.state.content}
      >
        {this.getCategorySelect()}
      </div>
      <div className={inputContainerClasses}>
        <label className='vcv-ui-editor-search-icon-container' htmlFor='add-template-search'>
          <i className='vcv-ui-icon vcv-ui-icon-search' />
        </label>
        <input
          className='vcv-ui-form-input vcv-ui-editor-search-field'
          id='add-template-search'
          onChange={this.handleSearch}
          type='text'
          value={this.props.inputValue}
          placeholder={searchPlaceholder}
          autoFocus={autofocus}
        />
      </div>
    </div>
  }
}
