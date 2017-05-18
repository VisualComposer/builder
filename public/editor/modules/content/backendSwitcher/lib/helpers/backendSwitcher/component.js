import React from 'react'

export default class BackendSwitcher extends React.Component {
  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const buttonText = localizations ? localizations.frontendEditor : 'Frontend Editor'

    return <div className='vcv-wpbackend-switcher-wrapper'>
      <div className='vcv-wpbackend-switcher'>
        <span className='vcv-wpbackend-switcher-logo' />
        <a className='vcv-wpbackend-switcher-option' href={window.vcvFrontendEditorLink}>
          {buttonText}
        </a>
      </div>
    </div>
  }
}
