import React from 'react'
import classNames from 'classnames'

export default class SearchTemplate extends React.Component {
  static propTypes = {
    inputValue: React.PropTypes.string.isRequired,
    changeSearchState: React.PropTypes.func.isRequired,
    changeSearchInput: React.PropTypes.func.isRequired,
    allCategories: React.PropTypes.array.isRequired,
    index: React.PropTypes.any.isRequired,
    changeActiveCategory: React.PropTypes.func.isRequired
  }
  inputTimeout = 0
  dropdownTimeout = 0

  constructor (props) {
    super(props)
    this.state = {
      input: false,
      activeIndex: this.props.index,
      dropdown: false,
      content: this.props.allCategories[this.props.index].title
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.getCategorySelect = this.getCategorySelect.bind(this)
    this.handleCategoryClick = this.handleCategoryClick.bind(this)
    this.handleCategorySelect = this.handleCategorySelect.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.index !== this.state.activeIndex) {
      this.setState({
        activeIndex: nextProps.index,
        content: this.props.allCategories[ nextProps.index ].title
      })
    }
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

  // Get HTML elements

  getCategorySelect () {
    let options = []
    this.props.allCategories.forEach((item) => {
      if (item.visible()) {
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

  handleInputFocus () {
    this.setState({ input: true })
    this.inputTimeout = setTimeout(() => {
      this.setState({ input: false })
    }, 400)
  }

  handleCategorySelect (e) {
    this.setState({
      content: this.props.allCategories[e.currentTarget.value].title
    })
    this.props.changeActiveCategory(e.currentTarget.value)
    this.props.changeSearchState(false)
    this.props.changeSearchInput('')
  }

  handleCategoryClick () {
    this.setState({ dropdown: true })
    this.dropdownTimeout = setTimeout(() => {
      this.setState({ dropdown: false })
    }, 400)
  }

  render () {
    let inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
    })
    let dropdownContainerClasses = classNames({
      'vcv-ui-editor-search-dropdown-container': true,
      'vcv-ui-editor-field-highlight': this.state.dropdown
    })

    return <div className='vcv-ui-editor-search-container'>
      <div
        className={dropdownContainerClasses}
        data-content={this.state.content}
        onClick={this.handleCategoryClick}
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
          onFocus={this.handleInputFocus}
          type='text'
          value={this.props.inputValue}
          placeholder='Search templates by name and description'
          autoFocus='true'
        />
      </div>
    </div>
  }
}
