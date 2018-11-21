import React from 'react'

export default class FrontendClassicSwitcher extends React.Component {
  constructor (props) {
    super(props)
    let editor = 'classic'
    let gutenberg = window.VCV_GUTENBERG()
    this.enableClassicEditor = this.enableClassicEditor.bind(this)
    this.openFrontendEditor = this.openFrontendEditor.bind(this)
    if (gutenberg) {
      this.enableGutenbergEditor = this.enableGutenbergEditor.bind(this)
    }

    const beEditorInput = document.getElementById('vcv-be-editor')
    if (beEditorInput && beEditorInput.value !== 'classic') {
      editor = 'be'
      this.hideClassicEditor()
    }

    this.state = {
      editor: editor
    }

    this.wpb = (typeof window.vc !== 'undefined')
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

  enableGutenbergEditor (e) {
    e.preventDefault()
    const editor = 'gutenberg'
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const confirmMessage = localizations && localizations.enableGutenbergEditorConfirmMessage ? localizations.enableGutenbergEditorConfirmMessage : 'Gutenberg will overwrite your content created in Visual Composer Website Builder. Do you want to continue?'
    if (window.confirm(confirmMessage)) {
      this.setState({ editor: editor })
      let url = window.location.href;
      url += ( url.match( /[\?]/g ) ? '&' : '?' ) + 'vcv-set-editor=gutenberg';
      window.location = url;
    }
  }

  openFrontendEditor (e) {
    e.preventDefault()
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const confirmMessage = localizations && localizations.openFrontendEditorFromClassic ? localizations.openFrontendEditorFromClassic : 'Visual Composer will overwrite your content created in WordPress Classic editor with the latest version of content created in Visual Composer Website Builder. Do you want to continue?'
    if (this.state.editor === 'be' || window.confirm(confirmMessage)) {
      window.location.href = e.currentTarget.dataset.href
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
    const buttonGutenbergtext = localizations && localizations.gutenbergEditor ? localizations.gutenbergEditor : 'Gutenberg Editor'
    const { editor } = this.state
    const gutenberg = window.VCV_GUTENBERG()
    if (this.state.editor === 'be' && this.wpb === true) {
      this.showClassicEditor()
    }
    let output = <div className='vcv-wpbackend-switcher-wrapper'>
      <div className='vcv-wpbackend-switcher'>
        <span className='vcv-wpbackend-switcher-logo' />
        <button className='vcv-wpbackend-switcher-option' data-href={window.vcvFrontendEditorLink} onClick={this.openFrontendEditor}>
          {buttonFEText}
        </button>
      </div>
      {editor !== 'classic' && this.wpb === false ? (() => {
        return <div className='vcv-wpbackend-switcher--type-classic'>
          <button className='vcv-wpbackend-switcher-option'
            onClick={this.enableClassicEditor}>{buttonClassictext}</button>
        </div>
      })() : ''}
      {gutenberg ? (() => {
        return <div className='vcv-wpbackend-switcher--type-gutenberg as'>
          <button className='vcv-wpbackend-switcher-option' onClick={this.enableGutenbergEditor}>{buttonGutenbergtext}</button>
        </div>
      })() : ''}
    </div>
    return output
  }
}
