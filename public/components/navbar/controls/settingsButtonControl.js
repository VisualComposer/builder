import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage } from 'vc-cake'

const settingsStorage = getStorage('settings')
const workspaceContentState = getStorage('workspace').state('content')
const workspaceSettings = getStorage('workspace').state('settings')

export default class SettingsButtonControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'settings',
      showWarning: false // !!assetsStorage.getCustomCss()
    }
    this.toggleSettings = this.toggleSettings.bind(this)
    this.checkSettings = this.checkSettings.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  UNSAFE_componentWillReceiveProps () {
    this.checkSettings()
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'settings' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)
    settingsStorage.state('customCss').onChange(this.checkSettings)
    settingsStorage.state('globalCss').onChange(this.checkSettings)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
    settingsStorage.state('customCss').ignoreChange(this.checkSettings)
    settingsStorage.state('globalCss').ignoreChange(this.checkSettings)
  }

  checkSettings () {
    const customCss = settingsStorage.state('customCss').get() || ''
    const globalCss = settingsStorage.state('globalCss').get() || ''
    this.setState({ showWarning: customCss.length || globalCss.length })
  }

  toggleSettings (e) {
    e && e.preventDefault()
    workspaceContentState.set(!this.state.isActive ? 'settings' : false)
    workspaceSettings.set({ action: 'settings' })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.settings : 'Settings'

    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive
    })
    let iconClass = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-cog': true,
      'vcv-ui-badge--warning': false
    })

    return (
      <span className={controlClass} title={name} onClick={this.toggleSettings}>
        <span className='vcv-ui-navbar-control-content'>
          <i className={iconClass} />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
