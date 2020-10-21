import React from 'react'
import Wave from './../../../../visualcomposer/resources/images/helpers/wave.png'
import vcCake from 'vc-cake'

const dataManager = vcCake.getService('dataManager')

export default class Welcome extends React.Component {
  static localizations = dataManager.get('localizations')

  render () {
    const welcome = Welcome.localizations ? Welcome.localizations.welcome : 'welcome'
    const discoverVC = Welcome.localizations ? Welcome.localizations.discoverVC : 'Discover visual editor that gives everything to create a website you are proud of.'
    return (
      <div className='vcv-helpers-welcome-container'>
        <img src={Wave} />
        <h2 className='vcv-helpers-welcome-container--heading'>{welcome}</h2>
        <p className='vcv-helpers-welcome-container--description'>{discoverVC}</p>
      </div>
    )
  }
}
