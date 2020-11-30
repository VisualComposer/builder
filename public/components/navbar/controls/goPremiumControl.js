import React from 'react'
import NavbarContent from '../navbarContent'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

export default class GoPremiumControl extends NavbarContent {
  static handleClickGoPremium (e) {
    e && e.preventDefault && e.preventDefault()
    const target = e.currentTarget
    window.open(target.dataset.href)
  }

  render () {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    if (typeof isPremiumActivated !== 'undefined' && !isPremiumActivated) {
      const localizations = dataManager.get('localizations')
      const goPremium = localizations ? localizations.activationButtonTitle : dataManager.get('isFreeActivated') ? 'Go Premium' : 'Activate Hub'
      const goPremiumUrl = `${dataManager.get('goPremiumUrl')}&vcv-ref=editor`
      return (
        <span
          className='vcv-ui-navbar-control vcv-go-premium'
          onClick={GoPremiumControl.handleClickGoPremium}
          title={goPremium}
          data-href={goPremiumUrl}
        >
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-star' />
          <span className='vcv-ui-navbar-control-content'>{goPremium}</span>
        </span>
      )
    } else {
      return null
    }
  }
}
