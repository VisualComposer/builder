import React from 'react'
import {setData, getStorage} from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class TitleSettings extends React.Component {

  constructor (props) {
    super(props)
    let titleData = window.VCV_PAGE_TITLE && window.VCV_PAGE_TITLE() || {}
    this.state = {
      current: settingsStorage.state('pageTitle').get() || titleData.current,
      disabled: settingsStorage.state('pageTitleDisabled').get() || titleData.disabled
    }
    setData('ui:settings:pageTitle', titleData.current)
    setData('ui:settings:pageTitleDisabled', titleData.disabled)
    this.updateTitle = this.updateTitle.bind(this)
    this.updateTitleToggle = this.updateTitleToggle.bind(this)
  }

  updateTitle (event) {
    setData('ui:settings:pageTitle', event.target.value)
    this.setState({
      current: event.target.value
    })
  }

  updateTitleToggle (event) {
    setData('ui:settings:pageTitleDisabled', event.target.checked)
    this.setState({
      disabled: event.target.checked
    })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const settingName = localizations ? localizations.title : 'Title'
    const pageTitleDescription = localizations ? localizations.pageTitleDescription : 'To apply title changes you will need to save changes and reload the page.'
    const pageTitleDisableDescription = localizations ? localizations.pageTitleDisableDescription : 'Disable page title.'

    let checked = (this.state.disabled) ? 'checked' : ''

    return (
      <div>
        <span className='vcv-ui-form-group-heading'>{settingName}</span>
        <input type='text' className='vcv-ui-form-input' value={this.state.current} onChange={this.updateTitle} />
        <p className='vcv-ui-form-helper'>{pageTitleDescription}</p>
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <div className='vcv-ui-form-switch-container'>
            <label className='vcv-ui-form-switch'>
              <input type='checkbox' onChange={this.updateTitleToggle} id='vcv-page-title-disable' checked={checked} />
              <span className='vcv-ui-form-switch-indicator' />
              <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
              <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
            </label>
            <label htmlFor='vcv-page-title-disable' className='vcv-ui-form-switch-trigger-label'>{pageTitleDisableDescription}</label>
          </div>
        </div>
      </div>
    )
  }
}
