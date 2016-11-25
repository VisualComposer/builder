import React from 'react'

export default class Categories extends React.Component {
  static propTypes = {
    allCategories: React.PropTypes.array.isRequired,
    index: React.PropTypes.any.isRequired,
    elements: React.PropTypes.array.isRequired,
    changeActive: React.PropTypes.func.isRequired,
    changeTerm: React.PropTypes.func.isRequired,
    changeInput: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      activeIndex: this.props.index
    }
    this.searchElements = this.searchElements.bind(this)
    this.handleCategorySelect = this.handleCategorySelect.bind(this)
  }

  searchElements (e) {
    let inputVal = e.currentTarget.value.toLowerCase()
    this.setState({
      inputValue: e.currentTarget.value,
      activeIndex: 0
    })
    this.props.changeActive(0)
    this.props.changeTerm('term')
    if (inputVal.trim()) {
      this.props.changeInput(inputVal)
    }
  }

  handleCategorySelect (e) {
    this.setState({
      inputValue: '',
      activeIndex: e.currentTarget.value
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

  render () {
    return <div className='vcv-ui-editor-search-container'>
      {this.getCategorySelect()}
      <label className='vcv-ui-editor-search-icon-container'>
        <i className='vcv-ui-icon vcv-ui-icon-search' />
      </label>
      <input
        className='vcv-ui-editor-search-field'
        onChange={this.searchElements}
        type='text'
        value={this.state.inputValue}
        placeholder='Search content elements by name, category and description'
      />
    </div>
  }
}
