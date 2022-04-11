import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import SettingsPanel from 'public/components/panels/settings/settingsPanel'
import AssignLayoutControl from './assignLayoutControl'
import BackendControl from './backendControl'

const workspaceStorage = getStorage('workspace')
const workspaceContentState = getStorage('workspace').state('content')
const workspaceSettings = getStorage('workspace').state('settings')
const workspaceSettingControls = getStorage('workspace').state('settingControls')
const workspaceSettingsTabState = workspaceStorage.state('settingsTab')
const dataManager = getService('dataManager')

export default class SettingsButtonControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'settings'
    }
    this.handleClickSettings = this.handleClickSettings.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'settings' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)

    innerAPI.mount('panel:settings', () => <SettingsPanel key='panels-container-settings' />)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
  }

  handleClickSettings (e, type) {
    e && e.preventDefault()
    if (type) {
      workspaceSettingsTabState.set(type)
    } else if (!this.state.isActive) {
      workspaceSettingsTabState.set('pageSettings')
    }
    workspaceContentState.set(!this.state.isActive || type ? 'settings' : false)
    workspaceSettings.set({ action: 'settings' })
    this.handleDropdownVisibility(e)
    this.props.handleOnClick && this.props.handleOnClick(e)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.options : 'Options'
    const title = SettingsButtonControl.isMacLike ? name + ' (⇧S)' : name + ' (Shift + S)'
    const controls = workspaceSettingControls.get()
    const controlsArray = Object.keys(controls).map(key => controls[key])
    const assignLayout = dataManager.get('editorType') === 'vcv_layouts' ? (<AssignLayoutControl key='assign-layout-control' />) : ''

    const settingsControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-settings': true,
      'vcv-ui-pull-end': true
    })

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-dropdown-trigger': true,
      'vcv-ui-state--active': this.state.isActive
    })

    const iconClass = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-cog': true,
      'vcv-ui-badge--warning': false
    })

    const navbarContentClasses = classNames({
      'vcv-ui-navbar-dropdown-content': true,
      'vcv-ui-show-dropdown-content': this.state.showDropdown,
      'vcv-ui-navbar-show-labels': true
    })

    const settings = controlsArray.map((control, i) =>
      <span
        onClick={(e) => this.handleClickSettings(e, control.type)}
        key={`control-${control.title}-${i}`}
        className='vcv-ui-navbar-control'
        title={control.title}
      >
        <span className='vcv-ui-navbar-control-content'>
          <span>{control.title}</span>
        </span>
      </span>
    )

    const settingsControls = (
      <dl className={settingsControlClasses} onMouseLeave={this.handleDropdownVisibility}>
        <dt className={controlClass} title={title} onClick={this.handleClickSettings} onMouseEnter={this.handleDropdownVisibility} data-vcv-guide-helper='settings-control' data-vcv-control='settings'>
          <span className='vcv-ui-navbar-control-content'>
            <i className={iconClass} />
            <span>{name}</span>
          </span>
        </dt>
        <dd className={navbarContentClasses}>
          {settings}
          {assignLayout}
          <BackendControl />
        </dd>
      </dl>
    )

    const settingsControlsInsideDropdown = (
      <div className='vcv-ui-navbar-controls-set'>
        {settings}
        {assignLayout}
        <BackendControl key='backend-control' />
      </div>
    )

    return (
      this.props.insideDropdown ? settingsControlsInsideDropdown : settingsControls
    )
  }
}
