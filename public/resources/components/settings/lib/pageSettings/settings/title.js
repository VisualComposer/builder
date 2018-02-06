import React from 'react'
import {setData, getStorage, env} from 'vc-cake'

const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

export default class TitleSettings extends React.Component {

  constructor (props) {
    super(props)
    this.title = null
    let titleData = window.VCV_PAGE_TITLE && window.VCV_PAGE_TITLE() || {}
    let pageTitle = settingsStorage.state('pageTitle').get()
    let pageTitleDisabled = settingsStorage.state('pageTitleDisabled').get()
    this.state = {
      current: pageTitle !== undefined ? pageTitle : titleData.current,
      disabled: pageTitleDisabled !== undefined ? pageTitleDisabled : titleData.disabled
    }
    setData('ui:settings:pageTitle', this.state.current)
    setData('ui:settings:pageTitleDisabled', this.state.disabled)
    this.updateTitle = this.updateTitle.bind(this)
    this.updateTitleToggle = this.updateTitleToggle.bind(this)
    this.findPageTitle = this.findPageTitle.bind(this)
    this.findPageTitle()

    workspaceIFrame.onChange(this.findPageTitle)
  }

  componentDidUpdate () {
    this.setTitle()
  }

  componentWillUnmount () {
    workspaceIFrame.ignoreChange(this.findPageTitle)
    this.findPageTitle({}, 'storage')
  }

  findPageTitle (data = {}, from = '') {
    let { type = 'loaded' } = data
    if (type === 'loaded') {
      let iframe = document.getElementById('vcv-editor-iframe')
      if (iframe) {
        this.title = [].slice.call(iframe.contentDocument.querySelectorAll('vcvtitle'))
        this.setTitle(from)
      }
    }
  }

  setTitle (from) {
    if (!this.title) {
      return
    }
    let { current, disabled } = this.state
    if (from === 'storage') {
      current = settingsStorage.state('pageTitle').get()
    }
    this.title.forEach(title => {
      title.innerText = current
      title.style.display = disabled ? 'none' : ''
    })
  }

  updateTitle (event) {
    setData('ui:settings:pageTitle', event.target.value)
    let { disabled } = this.state
    if (event.target.value) {
      if (!this.state.current) {
        disabled = false
      }
    } else {
      disabled = true
    }

    this.setState({
      current: event.target.value,
      disabled
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
    const pageTitleDisableDescription = localizations ? localizations.pageTitleDisableDescription : 'Disable page title'

    let reloadNotification = this.title ? '' : (<p className='vcv-ui-form-helper'>{pageTitleDescription}</p>)
    let checked = (this.state.disabled) ? 'checked' : ''
    const disableTitleToggleControl = !env('THEME_EDITOR') ? <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
      <div className='vcv-ui-form-switch-container'>
        <label className='vcv-ui-form-switch'>
          <input type='checkbox' onChange={this.updateTitleToggle} id='vcv-page-title-disable' checked={checked} />
          <span className='vcv-ui-form-switch-indicator' />
          <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
          <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
        </label>
        <label htmlFor='vcv-page-title-disable'
          className='vcv-ui-form-switch-trigger-label'>{pageTitleDisableDescription}</label>
      </div>
    </div> : ''
    return (
      <div>
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <span className='vcv-ui-form-group-heading'>{settingName}</span>
          <input type='text' className='vcv-ui-form-input' value={this.state.current} onChange={this.updateTitle} />
          {reloadNotification}
        </div>
        {disableTitleToggleControl}
      </div>
    )
  }
}
