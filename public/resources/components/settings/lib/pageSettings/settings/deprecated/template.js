import React from 'react'
import { setData, getStorage, env } from 'vc-cake'

const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

export default class TemplateSettings extends React.Component {
  constructor (props) {
    super(props)
    let templateStorageData = settingsStorage.state('pageTemplate').get()
    let templateData = window.VCV_PAGE_TEMPLATES ? window.VCV_PAGE_TEMPLATES() : {}
    let currentTemplate = templateStorageData || templateData.current || 'default'
    this.state = {
      current: currentTemplate,
      all: templateData.all || []
    }
    setData('ui:settings:pageTemplate', currentTemplate)
    this.updateTemplate = this.updateTemplate.bind(this)
    this.getTemplateOptions = this.getTemplateOptions.bind(this)
  }

  updateTemplate (event) {
    const value = event.target.value
    setData('ui:settings:pageTemplate', value)
    this.setState({
      current: value
    })

    if (!env('THEME_EDITOR')) {
      settingsStorage.state('pageTemplate').set(value)

      const lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || (window.VCV_PAGE_TEMPLATES && window.VCV_PAGE_TEMPLATES() && window.VCV_PAGE_TEMPLATES().current)
      const lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

      if (lastLoadedPageTemplate && lastLoadedPageTemplate !== lastSavedPageTemplate) {
        this.reloadIframe(lastSavedPageTemplate)
      }
    }
  }

  reloadIframe (lastSavedPageTemplate) {
    window.vcvLastLoadedPageTemplate = lastSavedPageTemplate

    workspaceIFrame.set({
      type: 'reload',
      template: lastSavedPageTemplate
    })
    settingsStorage.state('skipBlank').set(true)
  }

  getTemplateOptions () {
    return Object.keys(this.state.all).map((key, index) => (
      <option key={index} value={this.state.all[ key ]}>{key}</option>
    ))
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const settingName = localizations ? localizations.template : 'Template'
    const defaultTemplate = localizations ? localizations.defaultTemplate : 'Theme Default'

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>{settingName}</span>
        <select className='vcv-ui-form-dropdown' value={this.state.current} onChange={this.updateTemplate}>
          <option key='default' value='default'>{defaultTemplate}</option>
          {this.getTemplateOptions()}
        </select>
      </div>
    )
  }
}
