import React from 'react'
import NavbarContent from '../navbarContent'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

export default class GoPremiumControl extends NavbarContent {
  render () {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    if (typeof isPremiumActivated !== 'undefined' && !isPremiumActivated) {
      const localizations = dataManager.get('localizations')
      const goPremium = localizations ? localizations.activationButtonTitle : dataManager.get('isFreeActivated') ? 'Go Premium' : 'Activate Hub'
      const utm = dataManager.get('utm')
      const goPremiumUrl = utm['editor-navbar-go-premium']
      return (
        <a
          className='vcv-ui-navbar-control vcv-go-premium'
          title={goPremium}
          target='_blank' rel='noopener noreferrer'
          href={goPremiumUrl}
        >
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-star' />
          <span className='vcv-ui-navbar-control-content'>{goPremium}</span>
        </a>
      )
    } else {
      return null
    }
  }
}
