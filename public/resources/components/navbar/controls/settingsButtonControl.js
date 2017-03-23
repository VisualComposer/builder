import React from 'react'
import classNames from 'classnames'
import {getStorage} from 'vc-cake'

// const assetsStorage = getService('assetsStorage')
const workspaceContentEndState = getStorage('workspace').state('contentEnd')

export default class SettingsButtonControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isActive: false,
      showWarning: false // !!assetsStorage.getCustomCss()
    }
    this.toggleSettings = this.toggleSettings.bind(this)
    this.checkSettings = this.checkSettings.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'settings' })
  }

  componentDidMount () {
    workspaceContentEndState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    workspaceContentEndState.ignoreChange(this.setActiveState)
  }

  checkSettings () {
    this.setState({ showWarning: false })
    /* !!assetsStorage.getCustomCss() */
  }

  toggleSettings (e) {
    e && e.preventDefault()
    workspaceContentEndState.set(!this.state.isActive ? 'settings' : false)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive
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
