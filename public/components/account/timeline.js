import React from 'react'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class Timeline extends React.Component {
  static localizations = dataManager.get('localizations')

  render () {
    const licenseType = dataManager.get('licenseType')
    const goPremiumText = Timeline.localizations ? Timeline.localizations.goPremium : 'Go Premium'
    const downloadText = Timeline.localizations ? Timeline.localizations.download : 'Download'
    const installText = Timeline.localizations ? Timeline.localizations.install : 'Install'
    const activateText = Timeline.localizations ? Timeline.localizations.activateHub : 'Activate Hub'

    const hasManageOptions = dataManager.get('manageOptions')
    if (!hasManageOptions) {
      return null
    }

    let timelineClasses = 'vcv-timeline vcv-timeline--four-steps'
    let goPremiumStepClasses = 'vcv-timeline-item'
    if (licenseType === 'premium' || licenseType === 'theme') {
      goPremiumStepClasses += ' vcv-step-done'
    }

    const goPremiumStep = (
      <li className={goPremiumStepClasses}>
        <span className='vcv-timeline-item-helper'>4</span>
        <span className='vcv-timeline-item-text'>{goPremiumText}</span>
      </li>
    )

    let activateStepClasses = 'vcv-timeline-item'

    if (!licenseType) {
      timelineClasses = 'vcv-timeline vcv-timeline--three-steps'
    } else {
      activateStepClasses += ' vcv-step-done'
    }

    return (
      <ul className={timelineClasses}>
        <li className='vcv-timeline-item vcv-step-done'>
          <span className='vcv-timeline-item-helper'>1</span>
          <span className='vcv-timeline-item-text'>{downloadText}</span>
        </li>
        <li className='vcv-timeline-item vcv-step-done'>
          <span className='vcv-timeline-item-helper'>2</span>
          <span className='vcv-timeline-item-text'>{installText}</span>
        </li>
        <li className={activateStepClasses}>
          <span className='vcv-timeline-item-helper'>3</span>
          <span className='vcv-timeline-item-text'>{activateText}</span>
        </li>
        {goPremiumStep}
      </ul>
    )
  }
}
