import React from 'react'
import classNames from 'classnames'
import vcCake from 'vc-cake'
const { getData, setData } = vcCake

export default class SettingsButtonControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isWindowOpen: getData('settings:isWindowOpen'),
      showWarning: getData('globalAssetsStorage') && !!getData('globalAssetsStorage').getCustomCss()
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
      .reply('data:added', this.checkSettings)
      .reply('wordpress:data:added', this.checkSettings)
    this.checkSettings()
  }

  componentWillUnmount () {
    this.props.api
      .forget('bar-content-end:show', this.updateWindow)
      .forget('bar-content-end:hide', this.updateWindow)
      .forget('settings:update', this.checkSettings)
      .forget('data:added', this.checkSettings)
      .forget('wordpress:data:added', this.checkSettings)
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
    this.setState({ showWarning: getData('globalAssetsStorage') && !!getData('globalAssetsStorage').getCustomCss() })
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': !vcCake.getData('lockActivity') && this.state.isWindowOpen
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
