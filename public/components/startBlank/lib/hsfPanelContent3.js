import React from 'react'
import PropTypes from 'prop-types'
import vcCake from 'vc-cake'

const settingsStorage = vcCake.getStorage('settings')
const dataManager = vcCake.getService('dataManager')

export default class HfsPanelContent extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      inputValue: settingsStorage.state('pageTitle').get() || ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.updatePageTitle = this.updatePageTitle.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('pageTitle').onChange(this.updatePageTitle)
  }

  componentWillUnmount () {
    settingsStorage.state('pageTitle').ignoreChange(this.updatePageTitle)
  }

  handleSubmit (e) {
    e && e.preventDefault()
    this.props.onClick(this.state.inputValue.trim())
  }

  handleTitleChange (e) {
    e && e.preventDefault()
    const value = e.currentTarget.value
    this.setState({ inputValue: value })
    settingsStorage.state('pageTitle').set(value)
  }

  updatePageTitle (title) {
    if (title || title === '') {
      this.setState({ inputValue: title })
    }
  }

  render () {
    const { inputValue } = this.state
    const localizations = dataManager.get('localizations')
    const btnText = localizations ? localizations.startBuildingHFSButton : 'Start Building'
    const placeholder = localizations ? localizations.startPageHFSInputPlaceholder : '{name} Name'

    return (
      <div className='vcv-hfs-start-blank-container'>
        <form className='vcv-hfs-start-blank-form' onSubmit={this.handleSubmit}>
          <input
            className='vcv-start-blank-title-input'
            type='text'
            placeholder={placeholder.replace('{name}', this.props.type)}
            onChange={this.handleTitleChange}
            value={inputValue || ''}
            autoFocus
          />
          <button className='vcv-hfs-start-blank-start-button' type='submit'>
            {btnText}
          </button>
        </form>
      </div>
    )
  }
}
