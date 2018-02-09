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
      inputValue: ''
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleClick (e) {
    e && e.preventDefault()
    let data = {
      type: this.props.type,
      value: this.state.inputValue
    }
    this.props.addClick(data)
  }

  handleChange (e) {
    e && e.preventDefault()
    this.setState({ inputValue: e.currentTarget.value })
  }

  render () {
    const placeholder = `Your ${this.props.type} Name Goes Here`

    return <div className='vcv-hfs-start-blank-container'>
      <input
        className='vcv-hfs-start-blank-name-input'
        type='text'
        placeholder={placeholder}
        onChange={this.handleChange}
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
