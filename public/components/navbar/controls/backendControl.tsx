import React from 'react'
import { getService } from 'vc-cake'

const BackendControl: React.FC = () => {
  const PostData = getService('wordpress-post-data')
  const dataManager = getService('dataManager')
  const editorType = dataManager.get('editorType')
  const localizations = dataManager.get('localizations')
  const { backToWordpress, wordPressDashboard } = localizations

  const backendEditorButton = (
    <a
      className='vcv-ui-navbar-control'
      title={backToWordpress}
      href={PostData.backendEditorUrl()}
      data-vcv-controls='backToWP'
    >
      <span className='vcv-ui-navbar-control-content'>{backToWordpress}</span>
    </a>
  )

  let dataHref = PostData.vcvCustomPostType() ? PostData.adminDashboardPostTypeListUrl() : PostData.adminDashboardUrl()
  if (editorType === 'vcv_tutorials') {
    dataHref = dataManager.get('gettingStartedUrl')
  }

  const wordpressDashboardButton = !PostData.vcvCustomPostType() ? null : (
    <a
      className='vcv-ui-navbar-control'
      title={wordPressDashboard}
      href={dataHref}
      data-vcv-control='backToWP'
    >
      <span className='vcv-ui-navbar-control-content'>{wordPressDashboard}</span>
    </a>
  )

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
