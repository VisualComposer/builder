import React from 'react'
import classNames from 'classnames'

export default class SettingsButtonControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isWindowOpen: false
    }
    this.toggleSettings = this.toggleSettings.bind(this)
  }

  componentWillMount () {
    this.props.api
      .on('show', () => {
        this.setState({ isWindowOpen: true })
      })
      .on('hide', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('app:edit', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('app:add', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('bar-content-end:hide', () => {
        this.setState({ isWindowOpen: false })
      })
  }

  componentWillUnmount () {
    this.props.api
      .off('show', () => {
        this.setState({ isWindowOpen: true })
      })
      .off('hide', () => {
        this.setState({ isWindowOpen: false })
      })
      .forget('app:edit', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('app:add', () => {
        this.setState({ isWindowOpen: false })
      })
      .forget('bar-content-end:hide', () => {
        this.setState({ isWindowOpen: false })
      })
  }

  toggleSettings (e) {
    e && e.preventDefault()
    if (this.state.isWindowOpen) {
      this.props.api.notify('hide')
    } else {
      this.props.api.request('app:settings', true)
    }
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isWindowOpen
    })

    return (
      <a className={controlClass} href='#' title='Settings' onClick={this.toggleSettings}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-cog' />
          <span>Settings</span>
        </span>
      </a>
    )
  }
}
SettingsButtonControl.propTypes = {
  api: React.PropTypes.object.isRequired
}
