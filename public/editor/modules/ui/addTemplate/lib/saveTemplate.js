import React from 'react'

export default class SaveTemplate extends React.Component {
  static propTypes = {
    changeTemplateName: React.PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      inputValue: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (e) {
    this.setState({inputValue: e.currentTarget.value})
    this.props.changeTemplateName(e.currentTarget.value)
  }

  render () {
    return (
      <div className='vcv-ui-form-dependency'>
        <div className='vcv-ui-form-group'>
          <span className='vcv-ui-form-group-heading'>Template name</span>
          <input
            className='vcv-ui-form-input'
            type='text'
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />
        </div>
      </div>
    )
  }
}
