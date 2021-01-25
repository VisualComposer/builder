import React from 'react'
import { getStorage, getService } from 'vc-cake'
import PremiumTeaser from 'public/components/premiumTeasers/component'

const workspaceStorage = getStorage('workspace')
const dataManager = getService('dataManager')
const hubStorage = getStorage('hubAddons')
const localizations = dataManager.get('localizations')

export default class ElementsLock extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    workspaceStorage.trigger(e.target.dataset.action)
  }

  getElementLockSetting () {
    const elementsLock = localizations ? localizations.elementsLock : 'Element Lock'
    const lockAllText = localizations ? localizations.lockAllText : 'Lock All Elements'
    const unlockAllText = localizations ? localizations.unlockAllText : 'Unlock All Elements'
    const lockAllDescriptionText = localizations ? localizations.lockAllDescriptionText : 'Lock or unlock all elements on your page. Your user roles with Administrator access will be able to edit elements.'
    const lockSpecificDescriptionText = localizations ? localizations.lockSpecificDescriptionText : 'You can lock/unlock specific elements under the element Edit window.'

    return (
      <div className='vcv-ui-tree-content-section-inner'>
        <div className='vcv-ui-element-lock-container'>
          <h2 className='vcv-ui-section-heading'>{elementsLock}</h2>
          <p className='vcv-ui-section-description'>{lockAllDescriptionText}</p>
          <p className='vcv-ui-section-description'>{lockSpecificDescriptionText}</p>
          <div className='vcv-ui-lock-control-container'>
            <button
              className='vcv-ui-form-button vcv-ui-form-button--action'
              data-action='lockAll'
              onClick={this.handleClick}
            >
              {lockAllText}
            </button>
            <button
              className='vcv-ui-form-button vcv-ui-form-button--default'
              data-action='unlockAll'
              onClick={this.handleClick}
            >
              {unlockAllText}
            </button>
          </div>
        </div>
      </div>
    )
  }

  getPremiumTeaser (isPremiumActivated) {
    const goPremiumText = localizations.goPremium || 'Go Premium'
    const downloadAddonText = localizations.downloadTheAddon || 'Download The Addon'
    const headingText = localizations.elementLockPremiumFeatureHeading || 'Element Lock is a Premium feature'
    const buttonText = isPremiumActivated ? downloadAddonText : goPremiumText
    const descriptionFree = localizations.elementLockPremiumFeatureText || 'With Visual Composer Premium, you can lock or unlock elements to manage who will be able to edit them.'
    const descriptionPremium = localizations.elementLockFeatureActivateAddonText || 'Lock or unlock all elements on your page. Your user roles with Administrator access will be able to edit elements. <br> You can lock/unlock specific elements under the element Edit window. <br> To get access to this feature, download the Role Manager addon from the Visual Composer Hub.'
    const description = isPremiumActivated ? descriptionPremium : descriptionFree
    const utm = dataManager.get('utm')
    const utmUrl = utm['editor-element-lock-settings-go-premium']

    return (
      <PremiumTeaser
        headingText={headingText}
        buttonText={buttonText}
        description={description}
        url={utmUrl}
        isPremiumActivated={isPremiumActivated}
        addonName='roleManager'
      />
    )
  }

  render () {
    const isPremiumActivated = dataManager.get('isPremiumActivated')
    const isAddonAvailable = hubStorage.state('addons').get() && hubStorage.state('addons').get().roleManager
    return isPremiumActivated && isAddonAvailable ? this.getElementLockSetting() : this.getPremiumTeaser(isPremiumActivated)
  }
}
