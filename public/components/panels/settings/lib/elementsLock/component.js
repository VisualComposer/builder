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
    const lockAllText = localizations ? localizations.lockAllText : 'Lock All Elements'
    const unlockAllText = localizations ? localizations.unlockAllText : 'Unlock All Elements'
    const lockAllDescriptionText = localizations ? localizations.lockAllDescriptionText : 'Lock or unlock all elements on the page. Users with Administrator role access will be able to edit elements.'
    const lockSpecificDescriptionText = localizations ? localizations.lockSpecificDescriptionText : 'Lock or unlock specific elements under the element edit window.'

    return (
      <div className='vcv-ui-element-lock-container'>
        <p className='vcv-ui-form-helper'>{lockAllDescriptionText}</p>
        <p className='vcv-ui-form-helper'>{lockSpecificDescriptionText}</p>
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
