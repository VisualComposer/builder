import React from 'react'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

export default function PremiumTeaser (props) {
  const handleClick = (e) => {
    // TODO: check if addon name exists
    console.log('Download addon, addon name', props.addonName)
    // TODO: handle pop-up click from props
    // props.onPrimaryButtonClick()
  }

  let button = null
  let closeButton = null

  if (props.isPremiumActivated) {
    button = <button className='vcv-premium-teaser-btn' onClick={handleClick}>{props.buttonText}</button>
  } else {
    button = <a className='vcv-premium-teaser-btn' href={props.url} target='_blank' rel='noopener noreferrer'>{props.buttonText}</a>
  }

  if (props.onClose) {
    const closeButtonText = localizations.close || 'Close'
    closeButton = (
    <button
      className='vcv-premium-teaser-close vcv-ui-icon vcv-ui-icon-close-thin'
      aria-label={closeButtonText}
      onClick={props.onClose}
    />)
  }

  return (
    <div className='vcv-premium-teaser'>
      <div className='vcv-premium-teaser-badge' />
      <header className='vcv-premium-teaser-header'>
        <h2 className='vcv-premium-teaser-heading'>{props.headingText}</h2>
        {closeButton}
      </header>
      <div className='vcv-premium-teaser-content'>
        <p className='vcv-premium-teaser-text' dangerouslySetInnerHTML={{ __html: props.description }}/>
      </div>
      {button}
    </div>
  )
}
