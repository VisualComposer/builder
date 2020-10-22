import React from 'react'

export default class Timeline extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  render () {
    const licenseType = window.VCV_LICENSE_TYPE && window.VCV_LICENSE_TYPE()
    const goPremiumText = Timeline.localizations ? Timeline.localizations.goPremium : 'Go Premium'
    const downloadText = Timeline.localizations ? Timeline.localizations.download : 'Download'
    const installText = Timeline.localizations ? Timeline.localizations.install : 'Install'
    const activateText = Timeline.localizations ? Timeline.localizations.activateHub : 'Activate Visual Composer Hub'

    const hasManageOptions = window.VCV_MANAGE_OPTIONS && window.VCV_MANAGE_OPTIONS()
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
