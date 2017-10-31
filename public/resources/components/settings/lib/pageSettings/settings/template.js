import React from 'react'
import {setData, getStorage} from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class TemplateSettings extends React.Component {

  constructor (props) {
    super(props)
    let templateData = window.VCV_PAGE_TEMPLATES && window.VCV_PAGE_TEMPLATES() || {}
    this.state = {
      current: settingsStorage.state('pageTemplate').get() || templateData.current,
      all: templateData.all
    }
    setData('ui:settings:pageTemplate', templateData.current)
    this.updateTemplate = this.updateTemplate.bind(this)
    this.getTemplateOptions = this.getTemplateOptions.bind(this)
  }

  updateTemplate (event) {
    setData('ui:settings:pageTemplate', event.target.value)
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
    const pageTemplateDescription = localizations ? localizations.pageTemplateDescription : 'To apply a template you will need to save changes and reload the page.'

    return (
      <div>
        <span className='vcv-ui-form-group-heading'>{settingName}</span>
        <select className='vcv-ui-form-dropdown' value={this.state.current} onChange={this.updateTemplate}>
          <option key='default' value='default'>{defaultTemplate}</option>
          {this.getTemplateOptions()}
        </select>
        <p className='vcv-ui-form-helper'>{pageTemplateDescription}</p>
      </div>
    )
  }
}
