import React from 'react'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class Logo extends React.Component {
  render () {
    let output = (
      <a href={`${dataManager.get('editorLogoUrl')}`} target='_blank' rel='noopener noreferrer' className='vcv-ui-navbar-logo' title='Visual Composer Website Builder'>
        <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
      </a>
    )

    if (dataManager.get('isPremiumActivated')) {
      output = (
        <span className='vcv-ui-navbar-logo vcv-ui-navbar-logo--no-click' title='Visual Composer Website Builder'>
          <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
        </span>
      )
    }

    return output
  }
}
