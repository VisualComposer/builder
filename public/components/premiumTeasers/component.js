import React from 'react'

export default function PremiumTeaser (props) {
  const handleClick = (e) => {
    console.log('Download addon')
  }

  let button = null
  let header = null

  if (props.headingText) {
    header = (
      <header className='vcv-premium-teaser-header'>
        <h2 className='vcv-premium-teaser-heading'>{props.headingText}</h2>
      </header>
    )
  }

  if (props.isPremiumActivated) {
    button = <button className='vcv-premium-teaser-btn' onClick={handleClick}>{props.buttonText}</button>
  } else {
    button = <a className='vcv-premium-teaser-btn' href={props.url} target='_blank' rel='noopener norefferer'>{props.buttonText}</a>
  }

  return (
    <div className='vcv-premium-teaser'>
      <div className='vcv-premium-teaser-badge' />
      {header}
      <div className='vcv-premium-teaser-content'>
        <p className='vcv-premium-teaser-text'>{props.description}</p>
      </div>
      {button}
    </div>
  )
}
