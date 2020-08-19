import React from 'react'
import NavbarContent from '../navbarContent'

export default class GoPremiumControl extends NavbarContent {
  static handleClickGoPremium (e) {
    e && e.preventDefault && e.preventDefault()
    const target = e.currentTarget
    window.open(target.dataset.href)
  }

  render () {
    if (typeof window.vcvIsPremiumActivated !== 'undefined' && !window.vcvIsPremiumActivated) {
      const localizations = window.VCV_I18N && window.VCV_I18N()
      const goPremium = localizations ? localizations.activationButtonTitle : window.vcvIsFreeActivated ? 'Go Premium' : 'Activate Hub'
      const goPremiumUrl = `${window.vcvGoPremiumUrl}&vcv-ref=nav-bar`
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
