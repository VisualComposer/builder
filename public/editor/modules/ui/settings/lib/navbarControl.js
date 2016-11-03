import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'
const {getService, getData, setData} = vcCake
const assetManager = getService('assets-manager')
const wipAssetsStorage = vcCake.getService('wip-assets-storage')

export default class SettingsButtonControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isWindowOpen: getData('settings:isWindowOpen'),
      showWarning: vcCake.env('FEATURE_ASSETS_MANAGER') ? !!wipAssetsStorage.getCustomCss() : !!assetManager.getCustomCss()
    }

    this.toggleSettings = this.toggleSettings.bind(this)
    this.checkSettings = this.checkSettings.bind(this)
    this.updateWindow = this.updateWindow.bind(this)
  }

  componentWillMount () {
    this.props.api
      .reply('bar-content-end:show', this.updateWindow)
      .reply('bar-content-end:hide', this.updateWindow)
      .reply('settings:update', this.checkSettings)
    this.checkSettings()
  }

  componentWillUnmount () {
    this.props.api
      .forget('bar-content-end:show', this.updateWindow)
      .forget('bar-content-end:hide', this.updateWindow)
      .forget('settings:update', this.checkSettings)
  }

  toggleSettings (e) {
    e && e.preventDefault()
    if (this.state.isWindowOpen) {
      this.props.api.request('app:settings', false)
    } else {
      this.props.api.request('app:settings', true)
    }
  }

  updateWindow (isOpen = false) {
    setData('settings:isWindowOpen', isOpen === 'settings')
    this.setState({ isWindowOpen: isOpen === 'settings' })
  }

  checkSettings () {
    this.setState({ showWarning: vcCake.env('FEATURE_ASSETS_MANAGER') ? !!wipAssetsStorage.getCustomCss() : !!assetManager.getCustomCss() })
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isWindowOpen
    })
    let iconClass = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-cog': true,
      'vcv-ui-badge--warning': this.state.showWarning
    })

    return (
      <a className={controlClass} href='#' title='Settings' onClick={this.toggleSettings}>
        <span className='vcv-ui-navbar-control-content'>
          <i className={iconClass} />
          <span>Settings</span>
        </span>
      </a>
    )
  }
}
SettingsButtonControl.propTypes = {
  api: React.PropTypes.object.isRequired
}
