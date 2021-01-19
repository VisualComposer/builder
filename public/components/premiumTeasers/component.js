import React from 'react'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

export default function PremiumTeaser (props) {
  const handleClick = (e) => {
    console.log(e);
    console.log(props);
    // TODO: check if addon name exists
    // TODO: handle pop-up click from props?
    // props.onPrimaryButtonClick()
  }

  let control = null
  let closeButton = null

  if (props.url && !props.isPremiumActivated) {
    control = <a className='vcv-premium-teaser-btn' href={props.url} target='_blank' rel='noopener noreferrer'>{props.buttonText}</a>
  } else {
    control = <button className='vcv-premium-teaser-btn' onClick={handleClick}>{props.buttonText}</button>
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
      {closeButton}
      <div className='vcv-premium-teaser-badge' />
      <header className='vcv-premium-teaser-header'>
        <h2 className='vcv-premium-teaser-heading'>{props.headingText}</h2>
      </header>
      <div className='vcv-premium-teaser-content'>
        <p className='vcv-premium-teaser-text' dangerouslySetInnerHTML={{ __html: props.description }} />
      </div>
      {control}
    </div>
  )
}
