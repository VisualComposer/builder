/* global setUserSetting */
import React from 'react'
import NavbarContent from '../navbarContent'

import { env, getService, getStorage } from 'vc-cake'

const PostData = getService('wordpress-post-data')
const wordpressDataStorage = getStorage('wordpressData')

export default class WordPressAdminControl extends NavbarContent {
  previewWindow = false
  previewWindowTarget = false

  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount () {
    // wordpressDataStorage.trigger('save')
    /*
     this.props.api.reply('wordpress:data:saved', (data) => {
     // Call the forceUpdate when saved
     this.forceUpdate()
     })
     */
  }

  handleClick (e) {
    e && e.preventDefault && e.preventDefault()
    const target = e.currentTarget
    const isBackendEditor = target.dataset.backendEditor && target.dataset.backendEditor === 'backendEditor'
    if (isBackendEditor && env('FEATURE_WPBACKEND')) {
      setUserSetting('vcvEditorsBackendLayoutSwitcher', '1') // Enable backend editor
    }
    window.open(
      target.dataset.href,
      target.dataset.target ? target.dataset.target : '_self'
    )
  }

  saveDraft = (e) => {
    e && e.preventDefault && e.preventDefault()
    wordpressDataStorage.trigger('save', { draft: true }, 'wordpressAdminControl')
    // this.props.api.request('wordpress:data:saving', { draft: true })
  }

  savePreview = (e) => {
    e && e.preventDefault && e.preventDefault()

    const target = e.currentTarget
    wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
    wordpressDataStorage.state('status').onChange(this.afterSaveChangeUrl)

    if (!this.previewWindow || this.previewWindow.closed) {
      this.previewWindow = window.open(
        window.location.href,
        '_blank'
      )
    }
    this.previewWindowTarget = target.dataset.href

    wordpressDataStorage.trigger('save', { inherit: true }, 'wordpressAdminControl')
  }

  afterSaveChangeUrl = (data) => {
    const { status } = data
    if (status === 'saving' && this.previewOpened && !this.previewWindow.closed) {
      this.previewWindow.location.href = this.previewWindowTarget
      this.previewWindow.blur()
      this.previewWindow.focus()
    } else if (status === 'success') {
      this.previewWindow.location.href = this.previewWindowTarget
      wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
      this.previewOpened = true
    } else if (status === 'failed') {
      wordpressDataStorage.state('status').ignoreChange(this.afterSaveChangeUrl)
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const { saveDraft, backendEditor, wordPressDashboard, editInBackendEditor, preview, previewChanges } = localizations

    let saveDraftButton = ''
    if (PostData.isDraft()) {
      saveDraftButton = (
        <span
          className='vcv-ui-navbar-control'
          title={saveDraft}
          onClick={this.saveDraft}
          data-href={PostData.permalink()}
        >
          <span className='vcv-ui-navbar-control-content'>{saveDraft}</span>
        </span>
      )
    }

    let viewButton = ''
    if (PostData.isViewable()) {
      viewButton = (
        <span
          className='vcv-ui-navbar-control'
          title={PostData.viewText()}
          onClick={this.handleClick}
          data-href={PostData.permalink()}
          data-target='_blank'
        >
          <span className='vcv-ui-navbar-control-content'>{PostData.viewText()}</span>
        </span>
      )
    }

    let previewText = PostData.isPublished() ? previewChanges : preview
    let previewButton = (
      <span
        className='vcv-ui-navbar-control'
        title={previewText}
        onClick={this.savePreview}
        data-href={PostData.previewUrl()}
        data-target='_blank'
      >
        <span className='vcv-ui-navbar-control-content'>{previewText}</span>
      </span>
    )

    let backendEditorButton = (
      <span
        className='vcv-ui-navbar-control'
        onClick={this.handleClick}
        title={editInBackendEditor}
        data-href={PostData.backendEditorUrl()}
        data-backend-editor='backendEditor'
      >
        <span className='vcv-ui-navbar-control-content'>{backendEditor}</span>
      </span>
    )

    let wordpressDashboardButton = (
      <span
        className='vcv-ui-navbar-control'
        onClick={this.handleClick}
        title={wordPressDashboard}
        data-href={PostData.adminDashboardUrl()}
      >
        <span className='vcv-ui-navbar-control-content'>{wordPressDashboard}</span>
      </span>
    )

    return (
      <div className='vcv-ui-navbar-controls-set'>
        {previewButton}
        {saveDraftButton}
        {viewButton}
        {backendEditorButton}
        {wordpressDashboardButton}
      </div>
    )
  }
}
