/* global setUserSetting */
import React from 'react'
import NavbarContent from '../navbarContent'

import {env, getService, getStorage} from 'vc-cake'

const PostData = getService('wordpress-post-data')
const wordpressDataStorage = getStorage('wordpressData')

export default class WordPressAdminControl extends NavbarContent {
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

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const { saveDraft, viewPage, backendEditor, wordPressDashboard, editInBackendEditor } = localizations

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
    if (PostData.isPublished()) {
      viewButton = (
        <span
          className='vcv-ui-navbar-control'
          title={viewPage}
          onClick={this.handleClick}
          data-href={PostData.permalink()}
          data-target='_blank'
        >
          <span className='vcv-ui-navbar-control-content'>{viewPage}</span>
        </span>
      )
    }
    // let previewText = PostData.isPublished() ? 'Preview Changes' : 'Preview'
    // let previewButton = (
    //   <span
    //     className='vcv-ui-navbar-control'
    //     title={previewText}
    //     data-href={PostData.previewUrl()}
    //     data-target='_blank'
    //   >
    //     <span className='vcv-ui-navbar-control-content'>{previewText}</span>
    //   </span>
    // )

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
        {saveDraftButton}
        {viewButton}
        {backendEditorButton}
        {wordpressDashboardButton}
      </div>
    )
  }
}
