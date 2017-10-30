import React from 'react'
import {setData, getStorage, env} from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class PageSettings extends React.Component {

  constructor (props) {
    super(props)
    let title = null
    let titleData = null
    if (env('PAGE_TITLE_FE')) {
      titleData = window.VCV_PAGE_TITLE && window.VCV_PAGE_TITLE() || { current: '', disabled: false }
      title = {
        current: settingsStorage.state('pageTitle').get() || titleData.current,
        disabled: settingsStorage.state('pageTitleDisabled').get() || titleData.disabled
      }
      setData('ui:settings:pageTitle', title.current)
      setData('ui:settings:pageTitleDisabled', title.disabled)
    }
    let template = null
    let templateData = null
    if (env('PAGE_TEMPLATES_FE')) {
      templateData = window.VCV_PAGE_TEMPLATES()
      template = {
        current: settingsStorage.state('pageTemplate').get() || templateData.current,
        all: templateData.all
      }
      setData('ui:settings:pageTemplate', template.current)
    }
    this.state = {
      title,
      template
    }
    this.updateTitle = this.updateTitle.bind(this)
    this.updateTitleToggle = this.updateTitleToggle.bind(this)
    this.updateTemplate = this.updateTemplate.bind(this)
    this.getTemplateOptions = this.getTemplateOptions.bind(this)
  }

  updateTitle (event) {
    setData('ui:settings:pageTitle', event.target.value)
    this.setState({
      title: {
        ...this.state.title,
        current: event.target.value
      }
    })
  }

  updateTitleToggle (event) {
    setData('ui:settings:pageTitleDisabled', event.target.checked)
    this.setState({
      title: {
        ...this.state.title,
        disabled: event.target.checked
      }
    })
  }

  getTitleSettings () {
    if (!env('PAGE_TITLE_FE')) {
      return null
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()
    const settingName = localizations ? localizations.title : 'Title'
    const pageTitleDescription = localizations ? localizations.pageTitleDescription : 'To apply title changes you will need to save changes and reload the page.'
    const pageTitleDisableDescription = localizations ? localizations.pageTitleDisableDescription : 'Disable page title.'

    let checked = (this.state.title.disabled) ? 'checked' : ''

    return (
      <div>
        <span className='vcv-ui-form-group-heading'>{settingName}</span>
        <input type='text' className='vcv-ui-form-input' value={this.state.title.current} onChange={this.updateTitle} />
        <p className='vcv-ui-form-helper'>{pageTitleDescription}</p>
        <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
          <div className='vcv-ui-form-switch-container'>
            <label className='vcv-ui-form-switch'>
              <input type='checkbox' onChange={this.updateTitleToggle} id='vcv-page-title-disable' checked={checked} />
              <span className='vcv-ui-form-switch-indicator' />
              <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
              <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
            </label>
            <label htmlFor='vcv-page-title-disable' className='vcv-ui-form-switch-trigger-label'>{pageTitleDisableDescription}</label>
          </div>
        </div>
      </div>
    )
  }

  updateTemplate (event) {
    setData('ui:settings:pageTemplate', event.target.value)
    this.setState({
      template: {
        ...this.state.template,
        current: event.target.value
      }
    })
  }

  getTemplateOptions () {
    return Object.keys(this.state.template.all).map((key, index) => (
      <option key={index} value={this.state.template.all[ key ]}>{key}</option>
    ))
  }

  getTemplateSettings () {
    if (!env('PAGE_TEMPLATES_FE')) {
      return null
    }

    const localizations = window.VCV_I18N && window.VCV_I18N()
    const settingName = localizations ? localizations.template : 'Template'
    const defaultTemplate = localizations ? localizations.defaultTemplate : 'Default template'
    const pageTemplateDescription = localizations ? localizations.pageTemplateDescription : 'To apply a template you will need to save changes and reload the page.'

    return (
      <div>
        <span className='vcv-ui-form-group-heading'>{settingName}</span>
        <select className='vcv-ui-form-dropdown' value={this.state.template.current} onChange={this.updateTemplate}>
          <option key='default' value='default'>{defaultTemplate}</option>
          {this.getTemplateOptions()}
        </select>
        <p className='vcv-ui-form-helper'>{pageTemplateDescription}</p>
      </div>
    )
  }

  render () {
    return (
      <div>
        {this.getTitleSettings()}
        {this.getTemplateSettings()}
      </div>
    )
  }
}
