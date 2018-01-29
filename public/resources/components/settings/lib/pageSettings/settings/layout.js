import React from 'react'
import {setData, getStorage, env} from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class LayoutSettings extends React.Component {

  constructor (props) {
    super(props)
    let layouts = {
      all: {
        'Header 1': 3007,
        'Header 2': 3041
      },
      current: 3007
    }
    let layoutStorageData = settingsStorage.state('headerLayout').get()
    // let templateData = window.VCV_PAGE_TEMPLATES && window.VCV_PAGE_TEMPLATES() || {}
    let currentLayout = layoutStorageData || layouts.current || 3007
    this.state = {
      current: currentLayout,
      all: layouts.all
    }
    setData('ui:settings:headerLayout', currentLayout)
    this.updateLayout = this.updateLayout.bind(this)
    this.getTemplateOptions = this.getTemplateOptions.bind(this)
  }

  updateLayout (event) {
    setData('ui:settings:headerLayout', event.target.value)
    this.setState({
      current: event.target.value
    })
  }

  getTemplateOptions () {
    return Object.keys(this.state.all).map((key, index) => (
      <option key={index} value={this.state.all[ key ]}>{key}</option>
    ))
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const settingName = localizations ? localizations.template : 'Template'
    const defaultTemplate = localizations ? localizations.defaultTemplate : 'Default template'
    let pageTemplateDescription = localizations ? localizations.pageTemplateDescription : 'To apply a template save changes and reload the page'
    if (env('IFRAME_RELOAD')) {
      pageTemplateDescription = localizations ? localizations.pageTemplateReloadDescription : 'To apply a template you will need to save changes and content will reload itself.'
    }

    return (
      <div>
        <span className='vcv-ui-form-group-heading'>{settingName}</span>
        <select className='vcv-ui-form-dropdown' value={this.state.current} onChange={this.updateLayout}>
          <option key='default' value='default'>{defaultTemplate}</option>
          {this.getTemplateOptions()}
        </select>
        <p className='vcv-ui-form-helper'>{pageTemplateDescription}</p>
      </div>
    )
  }
}
