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
      target.href,
      target.getAttribute('target') ? target.getAttribute('target') : '_self'
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
        <a
          className='vcv-ui-navbar-control'
          href={PostData.permalink()}
          title={saveDraft}
          onClick={this.saveDraft}
        ><span
          className='vcv-ui-navbar-control-content'>{saveDraft}</span></a>
      )
    }

    let viewButton = ''
    if (PostData.isPublished()) {
      viewButton = (
        <a
          className='vcv-ui-navbar-control'
          href={PostData.permalink()}
          title={viewPage}
          target='_blank'
          onClick={this.handleClick}
        >
          <span className='vcv-ui-navbar-control-content'>{viewPage}</span>
        </a>
      )
    }
    // let previewText = PostData.isPublished() ? 'Preview Changes' : 'Preview'
    // let previewButton = (
    //   <a
    //     className='vcv-ui-navbar-control'
    //     title={previewText}
    //     href={PostData.previewUrl()}
    //     target='_blank'
    //   ><span className='vcv-ui-navbar-control-content'>{previewText}</span></a>
    // )

    let backendEditorButton = (
      <a
        className='vcv-ui-navbar-control'
        href={PostData.backendEditorUrl()}
        onClick={this.handleClick}
        title={editInBackendEditor}
        data-backend-editor='backendEditor'
      >
        <span className='vcv-ui-navbar-control-content'>{backendEditor}</span>
      </a>
    )

    let wordpressDashboardButton = (
      <a
        className='vcv-ui-navbar-control'
        href={PostData.adminDashboardUrl()}
        onClick={this.handleClick}
        title={wordPressDashboard}
      >
        <span className='vcv-ui-navbar-control-content'>{wordPressDashboard}</span>
      </a>
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
