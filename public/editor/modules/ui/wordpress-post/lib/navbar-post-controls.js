/*eslint no-extra-bind: "off"*/

import vcCake from 'vc-cake'
import React from 'react'
let PostData = vcCake.getService('wordpress-post-data')

class WordPressAdminControl extends React.Component {
  constructor (props) {
    super(props)
    this.props.api.reply('wordpress:saved', () => {
      this.forceUpdate()
    })
  }

  render () {
    let saveDraftButton = ''
    if (PostData.isDraft()) {
      saveDraftButton = (
        <a className='vcv-ui-navbar-control' href={PostData.permalink()} title='Save Draft'><span
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
    let previewText = PostData.isPublished() ? 'Preview Changes' : 'Preview'
    let previewButton = (
      <a className='vcv-ui-navbar-control' href={PostData.previewUrl()} title={previewText}><span
        className='vcv-ui-navbar-control-content'>{previewText}</span></a>
    )

    let backendEditorButton = (
      <a className='vcv-ui-navbar-control' href={PostData.backendEditorUrl()} title='Edit in Backend Editor'><span
        className='vcv-ui-navbar-control-content'>Backend Editor</span></a>
    )

    let wordpressDashboardButton = (
      <a className='vcv-ui-navbar-control' href={PostData.adminDashboardUrl()} title='WordPress Dashboard'><span
        className='vcv-ui-navbar-control-content'>WordPress Dashboard</span></a>
    )

    return (
      <div>
        {saveDraftButton}
        {previewButton}
        {viewButton}
        {backendEditorButton}
        {wordpressDashboardButton}
      </div>
    )
  }
}
WordPressAdminControl.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = WordPressAdminControl
