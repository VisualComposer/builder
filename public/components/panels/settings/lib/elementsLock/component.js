import React from 'react'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspace')

export default class ElementsLock extends React.Component {
  constructor (props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick (e) {
    workspaceStorage.trigger(e.target.dataset.action)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const elementsLock = localizations ? localizations.elementsLock : 'Element Lock'
    const lockAllText = localizations ? localizations.lockAllText : 'Lock All Elements'
    const unlockAllText = localizations ? localizations.unlockAllText : 'Unlock All Elements'
    const lockAllDescriptionText = localizations ? localizations.lockAllDescriptionText : 'Lock or unlock all elements on your page. Your user roles with Administrator access will be able to edit elements.'
    const lockSpecificDescriptionText = localizations ? localizations.lockSpecificDescriptionText : 'You can lock/unlock specific elements under the element Edit window.'

    return (
      <div className='vcv-ui-element-lock-container'>
        <h2 className="vcv-ui-section-heading">{elementsLock}</h2>
        <p className='vcv-ui-section-description'>{lockAllDescriptionText}</p>
        <p className='vcv-ui-section-description'>{lockSpecificDescriptionText}</p>
        <div className='vcv-ui-lock-control-container'>
          <button
            className='vcv-ui-form-button vcv-ui-form-button--action'
            data-action='lockAll'
            onClick={this.handleClick}
          >
            {lockAllText}
          </button>
          <button
            className='vcv-ui-form-button vcv-ui-form-button--default'
            data-action='unlockAll'
            onClick={this.handleClick}
          >
            {unlockAllText}
          </button>
        </div>
      </div>
    )
  }
}
