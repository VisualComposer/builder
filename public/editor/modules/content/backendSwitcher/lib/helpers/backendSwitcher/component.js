import React from 'react'
import '../../../../../../../sources/less/wpbackend-switcher/init.less'

export default class BackendSwitcher extends React.Component {
  constructor (props) {
    super(props)
    this.setClassicEditor = this.setClassicEditor.bind(this)
    this.setBackendEditor = this.setBackendEditor.bind(this)
  }

  setClassicEditor (e) {
    e && e.preventDefault && e.preventDefault()
    window.setUserSetting('vcvEditorsBackendLayoutSwitcher', '0') // Disable backend editor
    window.location.href = e.currentTarget.dataset.href
  }

  setBackendEditor (e) {
    e && e.preventDefault && e.preventDefault()
    window.setUserSetting('vcvEditorsBackendLayoutSwitcher', '1') // Enable backend editor
    window.location.href = e.currentTarget.dataset.href
  }

  render () {
    let backendEnabled = window.getUserSetting('vcvEditorsBackendLayoutSwitcher') !== '0'
    let output = (
      <div className='vcv-wpbackend-switcher-wrapper'>
        <div className='vcv-wpbackend-switcher'>
          <span className='vcv-wpbackend-switcher-logo' />
          <button data-href={window.vcvFrontendEditorLink} className='vcv-wpbackend-switcher-option'>Frontend Editor</button>
          <button data-href={window.location.href} onClick={this.setBackendEditor} className='vcv-wpbackend-switcher-option'>Backend Editor</button>
        </div>
      </div>
    )

    if (backendEnabled) {
      output = (
        <div className='vcv-wpbackend-switcher-wrapper'>
          <div className='vcv-wpbackend-switcher'>
            <span className='vcv-wpbackend-switcher-logo' />
            <button data-href={window.vcvFrontendEditorLink} className='vcv-wpbackend-switcher-option'>Frontend Editor</button>
          </div>
          <div className='vcv-wpbackend-switcher--type-classic'>
            <button data-href={window.location.href} onClick={this.setClassicEditor} className='vcv-wpbackend-switcher-option'>Classic Editor</button>
          </div>
        </div>
      )
    }

    return output
  }
}
