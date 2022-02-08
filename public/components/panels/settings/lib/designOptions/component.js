import React from 'react'
import DesignOptions from 'public/sources/attributes/designOptions/Component'
import { getService, getStorage } from 'vc-cake'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const localizations = dataManager.get('localizations')

export default class PageDesignOptions extends React.Component {
  constructor (props) {
    super(props)
    this.selector = 'body.vcwb'
    this.valueChangeHandler = this.valueChangeHandler.bind(this)
  }

  valueChangeHandler (fieldKey, value) {
    value.selector = this.selector
    settingsStorage.state('pageDesignOptions').set(value)
  }

  render () {
    const value = settingsStorage.state('pageDesignOptions').get() || {}
    const designOptionsDescription = localizations ? localizations.pageDesignOptionsDescription : 'The global Design Options might not work with all themes. Use any of the Visual Composer layouts or get the Visual Composer Starter Theme to access this feature.'

    return (
      <div className='vcv-ui-form-group vcv-ui-edit-form-section-content'>
        <p className='vcv-ui-section-description'>{designOptionsDescription}</p>
        <DesignOptions
          key='pageDesignOptions'
          fieldKey='pageDesignOptions'
          updater={this.valueChangeHandler}
          options={{}}
          elementSelector={this.selector}
          value={value}
          isBackgroundDynamic
        />
      </div>
    )
  }
}
