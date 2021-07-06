/* global setUserSetting */
import React from 'react'
import { getService } from 'vc-cake'

const BackendEditorButton = () => {
  const PostData = getService('wordpress-post-data')
  const dataManager = getService('dataManager')
  const localizations = dataManager.get('localizations')
  const { backToWordpress } = localizations

  const handleClick = (e) => {
    e && e.preventDefault && e.preventDefault()
    const target = e.currentTarget
    setUserSetting('vcvEditorsBackendLayoutSwitcher', '1') // Enable backend editor
    window.open(
      target.dataset.href,
      target.dataset.target ? target.dataset.target : '_self'
    )
  }
  return (
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
}

export default BackendEditorButton
