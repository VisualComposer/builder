import React from 'react'
import Wave from './assets/wave.png'

export default class Welcome extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()

  render () {
    const welcome = Welcome.localizations ? Welcome.localizations.welcome : 'welcome'
    const discoverVC = Welcome.localizations ? Welcome.localizations.discoverVC : 'Discover visual editor that gives everything to create a website you are proud of.'
    return (
      <div className='vcv-helper-welcome-container'>
        <img src={Wave} />
        <h2 className='vcv-helper-welcome-container-heading'>{welcome}</h2>
        <p className='vcv-helper-welcome-container-description'>{discoverVC}</p>
      </div>
    )
  }
}
