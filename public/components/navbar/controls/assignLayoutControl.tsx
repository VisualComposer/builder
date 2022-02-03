import React from 'react'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

declare const window: any

const AssignLayoutControl: React.FC = () => {
  const assignLayoutTitle = localizations ? localizations.assignLayout : 'Assign Layout to...'
  const adminLink = window.vcvWpAdminUrl || ''
  const assignUrl = adminLink + 'admin.php?page=vcv-headers-footers'

  return (
      <div className='vcv-ui-navbar-controls-set'>
          <a
            className='vcv-ui-navbar-control'
            href={assignUrl}
            title={assignLayoutTitle}
          >
            {assignLayoutTitle}
          </a>
      </div>
  )
}

export default AssignLayoutControl
