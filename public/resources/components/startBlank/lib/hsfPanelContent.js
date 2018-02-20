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
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit (e) {
    e && e.preventDefault()
    this.props.addClick(this.state.inputValue.trim())
  }

  handleChange (e) {
    e && e.preventDefault()
    this.setState({ inputValue: e.currentTarget.value })
  }

  render () {
    const { inputValue } = this.state
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const btnText = localizations ? localizations.startBuildingHFSButton : 'Start Building'
    const placeholder = localizations ? localizations.startPageHFSInputPlaceholder : '{name} Name'

    return <div className='vcv-hfs-start-blank-container'>
      <form className='vcv-hfs-start-blank-form' onSubmit={this.handleSubmit}>
        <input
          className='vcv-hfs-start-blank-name-input'
          type='text'
          placeholder={placeholder.replace('{name}', this.props.type)}
          onChange={this.handleChange}
          value={inputValue || ''}
          autoFocus
        />
        <button className='vcv-hfs-start-blank-start-button' type='submit'>
          {btnText}
        </button>
      </form>
    </div>
  }
}
