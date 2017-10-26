import React from 'react'
import {setData, getStorage} from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class PageTemplates extends React.Component {

  constructor (props) {
    super(props)
    let data = window.VCV_PAGE_TEMPLATES()
    this.state = {
      current: settingsStorage.state('pageTemplate').get() || data.current,
      all: data.all
    }
    setData('ui:settings:pageTemplate', this.state.current)
    this.updateTemplate = this.updateTemplate.bind(this)
    this.getOptions = this.getOptions.bind(this)
  }

  updateTemplate (event) {
    setData('ui:settings:pageTemplate', event.target.value)
    this.setState({ current: event.target.value })
  }

  getOptions () {
    let options = []
    for (let item in this.state.all) {
      options.push(<option key={this.state.all[ item ]} value={this.state.all[ item ]}>{item}</option>)
    }
    return options
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
          {this.getOptions()}
        </select>
        <p className='vcv-ui-form-helper'>{pageTemplateDescription}</p>
      </div>
    )
  }
}
