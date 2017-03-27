/* global setUserSetting */
import {env, getService, getStorage} from 'vc-cake'
import React from 'react'

const PostData = getService('wordpress-post-data')
const wordpressDataStorage = getStorage('wordpressData')

export default class WordPressAdminControl extends React.Component {
  constructor (props) {
    super(props)
    this.setBackendEditor = this.setBackendEditor.bind(this)
  }

  componentDidMount () {
    wordpressDataStorage.trigger('save')
    /*
    this.props.api.reply('wordpress:data:saved', (data) => {
      // Call the forceUpdate when saved
      this.forceUpdate()
    })
    */
  }

  setBackendEditor (e) {
    e && e.preventDefault && e.preventDefault()
    if (env('FEATURE_WPBACKEND')) {
      setUserSetting('vcvEditorsBackendLayoutSwitcher', '1') // Enable backend editor
    }
    window.location.href = e.currentTarget.href
  }

  saveDraft = (e) => {
    e && e.preventDefault && e.preventDefault()
    wordpressDataStorage.trigger('save', {draft: true}, 'wordpressAdminControl')
    // this.props.api.request('wordpress:data:saving', { draft: true })
  }

  render () {
    let saveDraftButton = ''
    if (PostData.isDraft()) {
      saveDraftButton = (
        <a
          className='vcv-ui-navbar-control'
          href={PostData.permalink()}
          title='Save Draft'
          onClick={this.saveDraft}
        ><span
          className='vcv-ui-navbar-control-content'>Save Draft</span></a>
      )
    }

    let viewButton = ''
    if (PostData.isPublished()) {
      viewButton = (
        <a className='vcv-ui-navbar-control' href={PostData.permalink()} title='View Page' target='_blank'><span
          className='vcv-ui-navbar-control-content'>View Page</span></a>
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
        onClick={this.setBackendEditor}
        title='Edit in Backend Editor'
      ><span className='vcv-ui-navbar-control-content'>Backend Editor</span></a>
    )

    let wordpressDashboardButton = (
      <a className='vcv-ui-navbar-control' href={PostData.adminDashboardUrl()} title='WordPress Dashboard'><span
        className='vcv-ui-navbar-control-content'>WordPress Dashboard</span></a>
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
