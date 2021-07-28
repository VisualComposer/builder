/* global setUserSetting */
import React from 'react'
import { getService } from 'vc-cake'

const BackendControl = () => {
  const PostData = getService('wordpress-post-data')
  const dataManager = getService('dataManager')
  const editorType = dataManager.get('editorType')
  const localizations = dataManager.get('localizations')
  const { backToWordpress, wordPressDashboard } = localizations

  const handleClick = (e) => {
    e && e.preventDefault && e.preventDefault()
    const target = e.currentTarget
    const isBackendEditor = target.dataset.backendEditor && target.dataset.backendEditor === 'backendEditor'
    if (isBackendEditor) {
      setUserSetting('vcvEditorsBackendLayoutSwitcher', '1') // Enable backend editor
    }
    window.open(
      target.dataset.href,
      target.dataset.target ? target.dataset.target : '_self'
    )
  }

  const backendEditorButton = (
    <span
      className='vcv-ui-navbar-control'
      onClick={handleClick}
      title={backToWordpress}
      data-href={PostData.backendEditorUrl()}
      data-backend-editor='backendEditor'
      data-vcv-controls='backToWP'
    >
      <span className='vcv-ui-navbar-control-content'>{backToWordpress}</span>
    </span>
  )

  let dataHref = PostData.vcvCustomPostType() ? PostData.adminDashboardPostTypeListUrl() : PostData.adminDashboardUrl()
  if (editorType === 'vcv_tutorials') {
    dataHref = dataManager.get('gettingStartedUrl')
  }

  let wordpressDashboardButton = (
    <span
      className='vcv-ui-navbar-control'
      onClick={handleClick}
      title={wordPressDashboard}
      data-href={dataHref}
      data-vcv-control='backToWP'
    >
      <span className='vcv-ui-navbar-control-content'>{wordPressDashboard}</span>
    </span>
  )
  if (!PostData.vcvCustomPostType()) {
    wordpressDashboardButton = null
  }

  return (
    PostData.vcvCustomPostType() ? (
      <div className='vcv-ui-navbar-controls-set'>
        {wordpressDashboardButton}
      </div>
    ) : (
      <div className='vcv-ui-navbar-controls-set'>
        {backendEditorButton}
        {wordpressDashboardButton}
      </div>
    )
  )
}

export default BackendControl
