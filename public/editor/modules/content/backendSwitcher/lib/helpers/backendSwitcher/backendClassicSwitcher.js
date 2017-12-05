import React from 'react'
import {getStorage} from 'vc-cake'
const wordpressBackendDataStorage = getStorage('wordpressData')
export default class BackendClassicSwitcher extends React.Component {
  constructor (props) {
    super(props)
    const editor = wordpressBackendDataStorage.state('activeEditor').get()
    this.state = {
      editor: editor
    }
    this.enableClassicEditor = this.enableClassicEditor.bind(this)
    this.enableBackendEditor = this.enableBackendEditor.bind(this)
  }

  enableClassicEditor (e) {
    e.preventDefault()
    const editor = 'classic'
    this.setState({ editor: editor })
    this.showClassicEditor()
  }

  enableBackendEditor (e) {
    e.preventDefault()
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const confirmMessage = localizations && localizations.enableBackendEditorConfirmMessage ? localizations.enableBackendEditorConfirmMessage : 'Visual Composer will overwrite your content created in WordPress Classic editor with the latest version of content created in Visual Composer Website Builder. Do you want to continue?'
    if (window.confirm(confirmMessage)) {
      const editor = 'be'
      this.setState({ editor: editor })
      this.showEditor()
    }
  }

  showEditor () {
    document.getElementById('vcwb_visual_composer').classList.remove('vcv-hidden')
    document.getElementById('postdivrich').classList.add('vcv-hidden')
    wordpressBackendDataStorage.state('activeEditor').set('be')
    window.setTimeout(() => {
      wordpressBackendDataStorage.state('activeEditor').set('be')
    }, 1)
  }

  showClassicEditor () {
    document.getElementById('vcwb_visual_composer').classList.add('vcv-hidden')
    document.getElementById('postdivrich').classList.remove('vcv-hidden')
    wordpressBackendDataStorage.state('activeEditor').set('classic')
    window.setTimeout(() => {
      if (window.editorExpand) {
        window.editorExpand.on()
        window.editorExpand.on() // double call fixes "space" in height from VCPB
      }
    }, 0)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const buttonFEText = localizations ? localizations.frontendEditor : 'Frontend Editor'
    const buttonBEText = localizations && localizations.backendEditor ? localizations.backendEditor : 'Backend Editor'
    const buttonClassictext = localizations && localizations.classicEditor ? localizations.classicEditor : 'Classic Editor'
    const { editor } = this.state
    let output = <div className='vcv-wpbackend-switcher-wrapper'>
      <div className='vcv-wpbackend-switcher'>
        <span className='vcv-wpbackend-switcher-logo' />
        <a className='vcv-wpbackend-switcher-option' href={window.vcvFrontendEditorLink}>
          {buttonFEText}
        </a>
        { editor !== 'be' ? <button className='vcv-wpbackend-switcher-option'
          onClick={this.enableBackendEditor}>{buttonBEText}</button> : '' }
        { editor !== 'classic' ? (() => {
          return <button className='vcv-wpbackend-switcher-option'
            onClick={this.enableClassicEditor}>{buttonClassictext}</button>
        })() : ''}
      </div>

    </div>
    return output
  }
}

