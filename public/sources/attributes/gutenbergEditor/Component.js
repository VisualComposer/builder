import React from 'react'
import classnames from 'classnames'
import Attribute from '../attribute'
import GutenbergModal from './gutenbergModal'
/* Working prototype */
export default class Component extends Attribute {
  constructor (props) {
    super(props)
    this.openEditor = this.openEditor.bind(this)
    this.iframeLoaded = this.iframeLoaded.bind(this)
    this.updateValueFromIframe = this.updateValueFromIframe.bind(this)
    this.closeEditor = this.closeEditor.bind(this)

    this.state = {
      showEditor: false,
      loadingEditor: false
    }
  }

  openEditor (e) {
    e.preventDefault()
    this.setState({
      showEditor: true,
      loadingEditor: true
    })
  }

  closeEditor () {
    this.updateValueFromIframe()

    this.setState({
      showEditor: false,
      loadingEditor: false
    })
  }

  iframeLoaded () {
    const { value } = this.state
    const window = this.iframe.contentWindow
    const wpData = window.wp ? window.wp.data : false
    if (!wpData) {
      const localizations = window.VCV_I18N && window.VCV_I18N()

      const alertNotice = localizations ? localizations.gutenbergDoesntWorkProperly : "Gutenberg plugin doesn't work properly. Please check Gutenberg plugin."
      window.alert(alertNotice)
      this.closeEditor()
    }
    // Set current content
    // Editor settings
    const newPost = {
      id: '',
      guid: { raw: '/?', rendered: '/?' },
      title: { raw: '' },
      content: { raw: value, rendered: value },
      type: 'post',
      slug: '',
      status: 'auto-draft',
      link: '/?',
      format: 'standard',
      categories: []
    }
    const editor = wpData.dispatch('core/editor')
    const selectEditor = wpData.select('core/edit-post')
    selectEditor.isPublishSidebarOpened = () => { return true }
    if (!!editor.autosave && typeof editor.autosave === 'function') {
      editor.autosave = () => {}
    }
    editor.setupEditor(newPost)
    const postTitle = window.document.querySelector('.editor-post-title')
    postTitle.classList.add('hidden')
    this.setState({ loadingEditor: false })
  }

  updateValueFromIframe () {
    if (!this.iframe || !this.iframe.contentWindow || !this.iframe.contentWindow.wp) {
      return
    }
    const wpData = this.iframe.contentWindow.wp.data
    if (wpData) {
      const value = wpData.select('core/editor').getEditedPostContent()
      this.setFieldValue(value)
    }
  }

  render () {
    let { showEditor, loadingEditor } = this.state
    let loadingOverlay = null
    if (loadingEditor) {
      loadingOverlay = (
        <div className='vcv-loading-overlay'>
          <div className='vcv-loading-dots-container'>
            <div className='vcv-loading-dot vcv-loading-dot-1' />
            <div className='vcv-loading-dot vcv-loading-dot-2' />
          </div>
        </div>
      )
    }

    const editor = () => {
      if (showEditor) {
        const closeClasses = classnames({
          'vcv-ui-icon': true,
          'vcv-ui-icon-close-thin': true
        })
        const iframeURL = window.vcvGutenbergEditorUrl ? window.vcvGutenbergEditorUrl : '/wp-admin/post-new.php?post_type=vcv_gutenberg_attr' // change with vcv action
        return (
          <GutenbergModal>
            {loadingOverlay}
            <div className='vcv-gutenberg-modal-inner'>
              <iframe id='vcv-gutenberg-attribute-modal-iframe' ref={(iframe) => { this.iframe = iframe }} src={iframeURL} onLoad={this.iframeLoaded} />
            </div>
            <button className='vcv-gutenberg-modal-close-button' onClick={this.closeEditor}>
              <i className={closeClasses} />
            </button>
          </GutenbergModal>
        )
      }
    }
    return (
      <React.Fragment>
        <button className='vcv-ui-form-button vcv-ui-form-button--default' onClick={this.openEditor}>
          Open Gutenberg
        </button>
        {editor()}
      </React.Fragment>
    )
  }
}
