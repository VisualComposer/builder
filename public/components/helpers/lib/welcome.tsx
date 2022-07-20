import React from 'react'
import { getService } from 'vc-cake'
// @ts-ignore
import Wave from 'public/sources/images/helpers/wave.png'

const dataManager = getService('dataManager')
const localizations = dataManager.get('localizations')

const Welcome = () => {
  const welcome = localizations.welcome || 'welcome'
  const discoverVC = localizations.discoverVC || 'Discover visual editor that gives everything to create a website you are proud of.'
  return (
    <div className='vcv-helpers-welcome-container'>
      <img src={Wave} alt={welcome} />
      <h2 className='vcv-helpers-welcome-container--heading'>{welcome}</h2>
      <p className='vcv-helpers-welcome-container--description'>{discoverVC}</p>
    </div>
  )
}

export default Welcome
