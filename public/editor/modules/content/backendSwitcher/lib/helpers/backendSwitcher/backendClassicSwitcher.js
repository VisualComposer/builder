import React from 'react'

export default class BackendClassicSwitcher extends React.Component {
  constructor (props) {
    super(props)
    this.beEditorInput = document.getElementById('vcv-be-editor')
    const editor = this.beEditorInput && this.beEditorInput.value ? this.beEditorInput.value : 'be'
    this.state = {
      editor: editor
    }
    this.enableClassicEditor = this.enableClassicEditor.bind(this)
    this.enableBackendEditor = this.enableBackendEditor.bind(this)
  }
  enableClassicEditor () {
    this.showClassicEditor()
    const editor = 'classic'
    this.setState({editor: editor})
    this.beEditorInput.value = editor
  }
  enableBackendEditor () {
    this.showEditor()
    const editor = 'be'
    this.setState({editor: editor})
    this.beEditorInput.value = editor
  }
  showEditor () {
    document.getElementById('vcwb_visual_composer').classList.remove('vcv-hidden')
    document.getElementById('postdivrich').classList.add('vcv-hidden')
    window.vcvRenderBEWorkspace()
  }
  showClassicEditor() {
    document.getElementById('vcwb_visual_composer').classList.add('vcv-hidden')
    document.getElementById('postdivrich').classList.remove('vcv-hidden')
    window.setTimeout(() => {
      if(window.editorExpand) {
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
    const {editor} = this.state
    console.log(editor)
    let output = <div className='vcv-wpbackend-switcher-wrapper'>
      <div className='vcv-wpbackend-switcher'>
        <span className='vcv-wpbackend-switcher-logo' />
        <a className='vcv-wpbackend-switcher-option' href={window.vcvFrontendEditorLink}>
          {buttonFEText}
        </a>
        { editor !== 'be' ? <button className='vcv-wpbackend-switcher-option' onClick={this.enableBackendEditor}>{buttonBEText}</button> : '' }
      </div>
      { editor !== 'classic' ? (() => {
        return <div className='vcv-wpbackend-switcher--type-classic'>
          <button className='vcv-wpbackend-switcher-option' onClick={this.enableClassicEditor}>{buttonClassictext}</button>
        </div>
      })() : ''}

    </div>
    return output
  }
}

