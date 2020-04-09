import React from 'react'

export default class Timeline extends React.Component {
  render () {
    const licenseType = window.VCV_LICENSE_TYPE && window.VCV_LICENSE_TYPE()
    const activePage = window.VCV_SLUG && window.VCV_SLUG()

    let goPremiumStepClasses = 'vcv-timeline-item'
    if (licenseType === 'premium') {
      goPremiumStepClasses += ' vcv-step-done'
    }

    let goPremiumStep = (
      <li className={goPremiumStepClasses}>
        <span className='vcv-timeline-item-helper'>4</span>
        <span className='vcv-timeline-item-text'>Go Premium</span>
      </li>
    )

    let activateStepClasses = 'vcv-timeline-item'

    if (activePage === 'vcv-getting-started' && !licenseType) {
      goPremiumStep = null
    } else if (licenseType !== 'theme') {
      activateStepClasses += ' vcv-step-done'
    }

    return (
      <ul className='vcv-timeline'>
        <li className='vcv-timeline-item vcv-step-done'>
          <span className='vcv-timeline-item-helper'>1</span>
          <span className='vcv-timeline-item-text'>Download</span>
        </li>
        <li className='vcv-timeline-item vcv-step-done'>
          <span className='vcv-timeline-item-helper'>2</span>
          <span className='vcv-timeline-item-text'>Install</span>
        </li>
        <li className={activateStepClasses}>
          <span className='vcv-timeline-item-helper'>3</span>
          <span className='vcv-timeline-item-text'>Activate</span>
        </li>
      </ul>
    )
  }
}
