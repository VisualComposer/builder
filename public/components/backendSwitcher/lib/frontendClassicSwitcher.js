import React from 'react'

export default class FrontendClassicSwitcher extends React.Component {
  constructor (props) {
    super(props)
    const gutenberg = window.VCV_GUTENBERG && window.VCV_GUTENBERG()
    this.handleClickEnableClassicEditor = this.handleClickEnableClassicEditor.bind(this)
    this.handleClickOpenFrontendEditor = this.handleClickOpenFrontendEditor.bind(this)
    if (gutenberg) {
      this.handleClickEnableGutenbergEditor = this.handleClickEnableGutenbergEditor.bind(this)
    }

    const beEditorInput = document.getElementById('vcv-be-editor')
    const url = window.location.href
    if (url.indexOf('classic-editor') !== -1) {
      beEditorInput.value = 'classic'
    }
    let editor = beEditorInput.value

    if (editor === 'gutenberg' && !gutenberg) {
      editor = 'be'
      this.hideClassicEditor()
    }

    this.state = {
      editor: editor
    }

    this.wpb = (typeof window.vc !== 'undefined')
  }

  handleClickEnableClassicEditor (e) {
    e.preventDefault()
    const editor = 'classic'
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const confirmMessage = localizations && localizations.enableClassicEditorConfirmMessage ? localizations.enableClassicEditorConfirmMessage : 'Visual Composer will overwrite your content created in WordPress Classic editor with the latest version of content created in Visual Composer Website Builder. Do you want to continue?'
    if (window.confirm(confirmMessage)) {
      this.setState({ editor: editor })
      this.showClassicEditor()
    }
  }

  handleClickEnableGutenbergEditor (e) {
    e.preventDefault()
    const editor = 'gutenberg'
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const confirmMessage = localizations && localizations.enableGutenbergEditorConfirmMessage ? localizations.enableGutenbergEditorConfirmMessage : 'Gutenberg will overwrite your content created in Visual Composer Website Builder. Do you want to continue?'
    if (window.confirm(confirmMessage)) {
      this.setState({ editor: editor })
      let url = window.location.href
      url += (url.match(/[?]/g) ? '&' : '?') + 'vcv-set-editor=gutenberg'
      window.location = url
    }
  }

  handleClickOpenFrontendEditor (e) {
    e.preventDefault()
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const confirmMessage = localizations && localizations.openFrontendEditorFromClassic ? localizations.openFrontendEditorFromClassic : 'Visual Composer will overwrite your content created in WordPress Classic editor with the latest version of content created in Visual Composer Website Builder. Do you want to continue?'
    if (this.state.editor === 'be' || window.confirm(confirmMessage)) {
      window.location.href = e.currentTarget.dataset.href
    }
  }

  hideClassicEditor () {
    if (document.getElementById('postdivrich') !== null) {
      document.getElementById('postdivrich').classList.add('vcv-hidden')
    }
  }

  showClassicEditor () {
    var url = window.location.href
    if (url.indexOf('?') > -1) {
      url += '&classic-editor=1'
    } else {
      url += '?classic-editor=1'
    }

    window.location.href = url
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const buttonClassictext = localizations && localizations.classicEditor ? localizations.classicEditor : 'Classic Editor'
    const buttonGutenbergtext = localizations && localizations.gutenbergEditor ? localizations.gutenbergEditor : 'Gutenberg Editor'
    const { editor } = this.state
    const gutenberg = window.VCV_GUTENBERG && window.VCV_GUTENBERG()

    let gutenbergButton = null
    if (!this.props.isGutenbergEditor && gutenberg && editor !== 'gutenberg') {
      gutenbergButton = (
        <div className='vcv-wpbackend-switcher--type-gutenberg'>
          <button className='vcv-wpbackend-switcher-option' onClick={this.handleClickEnableGutenbergEditor}>{buttonGutenbergtext}</button>
        </div>
      )
    }
    let vcButton = <button className='vcv-wpbackend-switcher-option vcv-wpbackend-switcher-option--vceditor' data-href={window.vcvFrontendEditorLink} onClick={this.handleClickOpenFrontendEditor} />
    const isWooCommercePage = window.VCV_IS_WOOCOMMERCE_LAYOUT && window.VCV_IS_WOOCOMMERCE_LAYOUT()
    if (isWooCommercePage) {
      vcButton = null
    }

    return (
      <div className='vcv-wpbackend-switcher-wrapper'>
        <div className='vcv-wpbackend-switcher'>
          {vcButton}
        </div>
        {editor !== 'classic' && this.wpb === false && !gutenberg && !this.props.isGutenbergEditor ? (() => {
          return (
            <div className='vcv-wpbackend-switcher--type-classic'>
              <button className='vcv-wpbackend-switcher-option' onClick={this.handleClickEnableClassicEditor}>{buttonClassictext}</button>
            </div>
          )
        })() : ''}
        {gutenbergButton}
      </div>
    )
  }
}
