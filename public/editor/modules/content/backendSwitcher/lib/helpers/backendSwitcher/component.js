import React from 'react'
import '../../../../../../../sources/less/wpbackend/switcher/init.less'

export default class BackendSwitcher extends React.Component {
  constructor (props) {
    super(props)
    this.setClassicEditor = this.setClassicEditor.bind(this)
    this.setBackendEditor = this.setBackendEditor.bind(this)
  }

  setClassicEditor (e) {
    e && e.preventDefault && e.preventDefault()
    window.setUserSetting('vcvEditorsBackendLayoutSwitcher', '0') // Disable backend editor
    window.location.href = e.currentTarget.href
  }

  setBackendEditor (e) {
    e && e.preventDefault && e.preventDefault()
    window.setUserSetting('vcvEditorsBackendLayoutSwitcher', '1') // Enable backend editor
    window.location.href = e.currentTarget.href
  }

  render () {
    let backendEnabled = window.getUserSetting('vcvEditorsBackendLayoutSwitcher') !== '0'
    let output = (
      <div className='vcv-wpbackend-switcher-wrapper'>
        <div className='vcv-wpbackend-switcher'>
          <span className='vcv-wpbackend-switcher-logo' />
          <a href={window.vcvFrontendEditorLink} className='vcv-wpbackend-switcher-option'>Frontend Editor</a>
          <a href={window.location.href} onClick={this.setBackendEditor} className='vcv-wpbackend-switcher-option'>Backend Editor</a>
        </div>
      </div>
    )

    if (backendEnabled) {
      output = (
        <div className='vcv-wpbackend-switcher-wrapper'>
          <div className='vcv-wpbackend-switcher'>
            <span className='vcv-wpbackend-switcher-logo' />
            <a href={window.vcvFrontendEditorLink} className='vcv-wpbackend-switcher-option'>Frontend Editor</a>
          </div>
          <div className='vcv-wpbackend-switcher--type-classic'>
            <a href={window.location.href} onClick={this.setClassicEditor} className='vcv-wpbackend-switcher-option'>Classic Editor</a>
          </div>
        </div>
      )
    }

    return output
  }
}
