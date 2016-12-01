import React from 'react'
import classNames from 'classnames'

export default class SearchTemplate extends React.Component {
  static propTypes = {
    changeSearchState: React.PropTypes.func.isRequired,
    changeSearchInput: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      input: false
    }
    this.searchTemplates = this.searchTemplates.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
  }

  searchTemplates (e) {
    this.setState({
      inputValue: e.currentTarget.value
    })
    this.props.changeSearchInput(e.currentTarget.value)
    this.props.changeSearchState('search')
  }

  handleInputFocus () {
    this.setState({input: true})
    setTimeout(() => {
      this.setState({input: false})
    }, 400)
  }

  render () {
    let inputContainerClasses = classNames({
      'vcv-ui-editor-search-field-container': true,
      'vcv-ui-editor-field-highlight': this.state.input
    })
    return <div className='vcv-ui-editor-search-container'>
      <div className={inputContainerClasses}>
        <label className='vcv-ui-editor-search-icon-container' htmlFor='add-template-search'>
          <i className='vcv-ui-icon vcv-ui-icon-search' />
        </label>
        <input
          className='vcv-ui-form-input vcv-ui-editor-search-field'
          id='add-template-search'
          onChange={this.searchTemplates}
          onFocus={this.handleInputFocus}
          type='text'
          value={this.state.inputValue}
          placeholder='Search templates by name and description'
          autoFocus='true'
        />
      </div>
    </div>
  }
}
