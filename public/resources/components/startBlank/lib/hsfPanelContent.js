import React from 'react'
import PropTypes from 'prop-types'

export default class HfsPanelContent extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    addClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      inputValue: props.value || ''
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleClick (e) {
    e && e.preventDefault()
    this.props.addClick(this.state.inputValue)
  }

  handleChange (e) {
    e && e.preventDefault()
    this.setState({ inputValue: e.currentTarget.value })
  }

  render () {
    const { inputValue } = this.state
    const placeholder = `${this.props.type} Name`

    return <div className='vcv-hfs-start-blank-container'>
      <input
        className='vcv-hfs-start-blank-name-input'
        type='text'
        placeholder={placeholder}
        onChange={this.handleChange}
        value={inputValue || ''}
      />
      <button
        className='vcv-hfs-start-blank-start-button'
        onClick={this.handleClick}
      >
        Start Building
      </button>
    </div>
  }
}
