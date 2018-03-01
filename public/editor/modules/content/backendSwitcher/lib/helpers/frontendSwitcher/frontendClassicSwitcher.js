import React from 'react'

export default class FrontendClassicSwitcher extends React.Component {
  constructor (props) {
    super(props)
    let editor = 'classic'
    this.enableClassicEditor = this.enableClassicEditor.bind(this)

    const beEditorInput = document.getElementById('vcv-be-editor')
    if (beEditorInput && beEditorInput.value !== 'classic') {
      editor = 'be-disabled'
      this.hideClassicEditor()
    }

    this.state = {
      editor: editor
    }
  }

  enableClassicEditor (e) {
    e.preventDefault()
    const editor = 'classic'
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const confirmMessage = localizations && localizations.enableClassicEditorConfirmMessage ? localizations.enableClassicEditorConfirmMessage : 'Visual Composer will overwrite your content created in WordPress Classic editor with the latest version of content created in Visual Composer Website Builder. Do you want to continue?'
    if (window.confirm(confirmMessage)) {
      this.setState({ editor: editor })
      this.showClassicEditor()
    }
  }

  hideClassicEditor () {
    document.getElementById('postdivrich').classList.add('vcv-hidden')
  }

  showClassicEditor () {
    const beEditorInput = document.getElementById('vcv-be-editor')
    beEditorInput.value = 'classic'

    document.getElementById('postdivrich').classList.remove('vcv-hidden')
    window.setTimeout(() => {
      if (window.editorExpand) {
        window.editorExpand.on()
        window.editorExpand.on() // double call fixes "space" in height from VCPB
      }
    }, 0)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const buttonFEText = localizations ? localizations.frontendEditor : 'Edit with Visual Composer Website Builder'
    const buttonClassictext = localizations && localizations.classicEditor ? localizations.classicEditor : 'Classic Editor'
    const { editor } = this.state
    let output = <div className='vcv-wpbackend-switcher-wrapper'>
      <div className='vcv-wpbackend-switcher'>
        <span className='vcv-wpbackend-switcher-logo' />
        <a className='vcv-wpbackend-switcher-option' href={window.vcvFrontendEditorLink}>
          {buttonFEText}
        </a>
      </div>
      {editor !== 'classic' ? (() => {
        return <div className='vcv-wpbackend-switcher--type-classic'>
          <button className='vcv-wpbackend-switcher-option'
            onClick={this.enableClassicEditor}>{buttonClassictext}</button>
        </div>
      })() : ''}

    </div>
    return output
  }
}

