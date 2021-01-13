import React from 'react'

export default function PremiumTeaser (props) {
  const handleClick = (e) => {
    console.log('Download addon', props.addonName)
  }

  let button = null

  if (props.isPremiumActivated) {
    button = <button className='vcv-premium-teaser-btn' onClick={handleClick}>{props.buttonText}</button>
  } else {
    button = <a className='vcv-premium-teaser-btn' href={props.url} target='_blank' rel='noopener noreferrer'>{props.buttonText}</a>
  }

  return (
    <div className='vcv-premium-teaser'>
      <div className='vcv-premium-teaser-badge' />
      <header className='vcv-premium-teaser-header'>
        <h2 className='vcv-premium-teaser-heading'>{props.headingText}</h2>
      </header>
      <div className='vcv-premium-teaser-content'>
        <p className='vcv-premium-teaser-text' dangerouslySetInnerHTML={{ __html: props.description }}/>
      </div>
      {button}
    </div>
  )
}
