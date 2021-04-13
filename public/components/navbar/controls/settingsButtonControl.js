import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import SettingsPanel from 'public/components/panels/settings/settingsPanel'

const settingsStorage = getStorage('settings')
const workspaceContentState = getStorage('workspace').state('content')
const workspaceSettings = getStorage('workspace').state('settings')
const dataManager = getService('dataManager')

export default class SettingsButtonControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'settings',
      showWarning: false // !!assetsStorage.getCustomCss()
    }
    this.handleClickSettings = this.handleClickSettings.bind(this)
    this.checkSettings = this.checkSettings.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'settings' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)
    settingsStorage.state('customCss').onChange(this.checkSettings)
    settingsStorage.state('globalCss').onChange(this.checkSettings)

    innerAPI.mount('panel:settings', () => <SettingsPanel key='panels-container-settings' />)

    this.checkSettings()
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

  handleClickSettings (e) {
    e && e.preventDefault()
    workspaceContentState.set(!this.state.isActive ? 'settings' : false)
    workspaceSettings.set({ action: 'settings' })
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.settings : 'Settings'
    const title = SettingsButtonControl.isMacLike ? name + ' (⇧S)' : name + ' (Shift + S)'

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive
    })
    const iconClass = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-cog': true,
      'vcv-ui-badge--warning': false
    })

    return (
      <span className={controlClass} title={title} onClick={this.handleClickSettings} data-vcv-guide-helper='settings-control'>
        <span className='vcv-ui-navbar-control-content'>
          <i className={iconClass} />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
