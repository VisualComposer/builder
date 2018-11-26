import React from 'react'
import { getStorage } from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class PreviewToggle extends React.Component {
  constructor (props) {
    super(props)

    let itemPreviewDisabled = settingsStorage.state('itemPreviewDisabled').get()

    this.state = {
      disabled: itemPreviewDisabled
    }

    this.updateTitleToggle = this.updateTitleToggle.bind(this)
  }

  updateTitleToggle (event) {
    const checked = event.target.checked
    this.setState({
      disabled: checked
    })

    settingsStorage.state('itemPreviewDisabled').set(checked)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const disablePreviewDescription = localizations ? localizations.disablePreviewDescription : 'Disable element and template preview popup in Add Element and Add Template windows'
    const disablePreviewText = localizations ? localizations.disablePreview : 'Disable preview'
    const checked = (this.state.disabled) ? 'checked' : ''

    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <div className='vcv-ui-form-switch-container'>
          <label className='vcv-ui-form-switch'>
            <input type='checkbox' onChange={this.updateTitleToggle} id='vcv-page-element-preview-disable' checked={checked} />
            <span className='vcv-ui-form-switch-indicator' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
          </label>
          <label htmlFor='vcv-page-element-preview-disable'
            className='vcv-ui-form-switch-trigger-label'>{disablePreviewText}</label>
        </div>
        <p className='vcv-ui-form-helper'>{disablePreviewDescription}</p>
      </div>
    )
  }
}
