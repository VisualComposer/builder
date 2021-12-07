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
      inputValue: settingsStorage.state('pageTitle').get() || '',
      layoutType: settingsStorage.state('layoutType').get()
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleTitleChange = this.handleTitleChange.bind(this)
    this.handleTemplateChange = this.handleTemplateChange.bind(this)
    this.updatePageTitle = this.updatePageTitle.bind(this)
    this.updateLayoutType = this.updateLayoutType.bind(this)
    this.addLayoutSelect = this.addLayoutSelect.bind(this)
  }

  componentDidMount () {
    // settingsStorage.state('templateType').set(this.state.templateType)
    settingsStorage.state('pageTitle').onChange(this.updatePageTitle)
    settingsStorage.state('layoutType').onChange(this.updateLayoutType)
  }

  componentWillUnmount () {
    settingsStorage.state('pageTitle').ignoreChange(this.updatePageTitle)
    settingsStorage.state('layoutType').ignoreChange(this.updateLayoutType)
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

  handleTemplateChange (e) {
    e && e.preventDefault()
    const value = e.currentTarget.value
    this.setState({ layoutType: value })
    settingsStorage.state('layoutType').set(value)
  }

  updatePageTitle (title) {
    if (title || title === '') {
      this.setState({ inputValue: title })
    }
  }

  updateLayoutType (type) {
    if (type || type === '') {
      this.setState({ layoutType: type })
    }
  }

  addLayoutSelect () {
    const editorType = dataManager.get('editorType')
    const localizations = dataManager.get('localizations')
    const postTemplateText = localizations ? localizations.postTemplateText : 'Singular layout'
    const archiveTemplateText = localizations ? localizations.archiveTemplateText : 'Archive layout'
    let layoutSelect = null

    if (editorType === 'vcv_layouts') {
      layoutSelect = (
        <div className='vcv-start-blank-template-type-wrapper'>
          <select
            className='vcv-start-blank-template-type'
            onChange={this.handleTemplateChange}
            value={this.state.layoutType}
          >
            <option value='postTemplate'>{postTemplateText}</option>
            <option value='archiveTemplate'>{archiveTemplateText}</option>
          </select>
        </div>
      )
    }

    return layoutSelect
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
          {this.addLayoutSelect()}
          <button className='vcv-hfs-start-blank-start-button' type='submit'>
            {btnText}
          </button>
        </form>
      </div>
    )
  }
}
