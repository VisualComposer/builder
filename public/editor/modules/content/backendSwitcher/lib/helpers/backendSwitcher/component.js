import React from 'react'
import '../../../../../../../sources/less/wpbackend-switcher/init.less'

export default class BackendSwitcher extends React.Component {
  constructor (props) {
    super(props)
    this.setEditor = this.setEditor.bind(this)
  }

  setEditor (e) {
    e && e.preventDefault && e.preventDefault()
    if (typeof e.currentTarget.dataset.switch !== 'undefined') {
      window.setUserSetting('vcvEditorsBackendLayoutSwitcher', e.currentTarget.dataset.switch)
    }
    window.location.href = e.currentTarget.dataset.href
  }

  render () {
    let backendEnabled = window.getUserSetting('vcvEditorsBackendLayoutSwitcher') !== '0'
    let output = (
      <div className='vcv-wpbackend-switcher-wrapper'>
        <div className='vcv-wpbackend-switcher'>
          <span className='vcv-wpbackend-switcher-logo' />
          <button
            data-href={window.vcvFrontendEditorLink}
            onClick={this.setEditor}
            className='vcv-wpbackend-switcher-option'>Frontend Editor
          </button>
          <button
            data-href={window.location.href}
            data-switch='1'
            onClick={this.setEditor}
            className='vcv-wpbackend-switcher-option'>Backend Editor
          </button>
        </div>
      </div>
    )

    if (backendEnabled) {
      output = (
        <div className='vcv-wpbackend-switcher-wrapper'>
          <div className='vcv-wpbackend-switcher'>
            <span className='vcv-wpbackend-switcher-logo' />
            <button
              data-href={window.vcvFrontendEditorLink}
              onClick={this.setEditor}
              className='vcv-wpbackend-switcher-option'>Frontend Editor
            </button>
          </div>
          <div className='vcv-wpbackend-switcher--type-classic'>
            <button
              data-href={window.location.href}
              data-switch='0'
              onClick={this.setEditor}
              className='vcv-wpbackend-switcher-option'>Classic Editor
            </button>
          </div>
        </div>
      )
    }

    return output
  }
}
