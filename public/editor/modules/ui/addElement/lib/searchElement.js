import React from 'react'
import classNames from 'classnames'

export default class SearchElement extends React.Component {
  static propTypes = {
    allCategories: React.PropTypes.array.isRequired,
    index: React.PropTypes.any.isRequired,
    changeActive: React.PropTypes.func.isRequired,
    changeTerm: React.PropTypes.func.isRequired,
    changeInput: React.PropTypes.func.isRequired
  }
  inputTimeout = 0
  dropdownTimeout = 0

  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      activeIndex: this.props.index,
      content: this.props.allCategories[this.props.index].title,
      dropdown: false,
      input: false
    }
    this.handleSearch = this.handleSearch.bind(this)
    this.handleCategorySelect = this.handleCategorySelect.bind(this)
    this.handleCategoryClick = this.handleCategoryClick.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
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

  handleSearch (e) {
    let inputVal = e.currentTarget.value.toLowerCase()
    this.setState({
      inputValue: e.currentTarget.value,
      activeIndex: 0,
      content: this.props.allCategories[0].title
    })
    this.props.changeActive(0)
    this.props.changeTerm('search')
    this.props.changeInput(inputVal)
  }

  handleCategorySelect (e) {
    this.setState({
      inputValue: '',
      activeIndex: e.currentTarget.value,
      content: this.props.allCategories[e.currentTarget.value].title
    })
    this.props.changeActive(e.currentTarget.value)
    this.props.changeTerm('')
  }

  getCategorySelect () {
    let options = []
    this.props.allCategories.forEach((item) => {
      options.push(<option key={item.id} value={item.index}>{item.title}</option>)
    })
    return <select
      className='vcv-ui-form-dropdown'
      onChange={this.handleCategorySelect}
      value={this.state.activeIndex}
    >
      {options}
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
    let dropdownContainerClasses = classNames({
      'vcv-ui-editor-search-dropdown-container': true,
      'vcv-ui-editor-field-highlight': this.state.dropdown
    })
    let inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
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
          placeholder='Search content elements'
          autoFocus='true'
        />
      </div>
    </div>
  }
}
