import React from 'react'
import {setData, getStorage, env} from 'vc-cake'

const settingsStorage = getStorage('settings')
const vcLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()
const themeTemplates = window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME && window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME()
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

export default class TemplateLayout extends React.Component {

  constructor (props) {
    super(props)
    let templateStorageData = settingsStorage.state('pageTemplate').get()
    let templateData = window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT() || {
      type: 'theme', value: 'default'
    }
    let currentTemplate = templateStorageData || templateData
    let showTheme = currentTemplate.type === 'theme'
    this.state = {
      current: currentTemplate,
      showTheme: showTheme
    }
    settingsStorage.state('pageTemplate').set(currentTemplate)
    this.allowedTypes = [ 'vc', 'vc-theme', 'theme' ]
    this.updateTemplate = this.updateTemplate.bind(this)
    this.updateState = this.updateState.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('pageTemplate').onChange(this.updateState)
  }

  componentWillUnmount () {
    settingsStorage.state('pageTemplate').ignoreChange(this.updateState)
  }

  updateState (data) {
    if (data) {
      let showTheme = data.type === 'theme'
      this.setState({
        current: data,
        showTheme: showTheme
      })
    }
  }

  updateTemplate (event) {
    let layoutData = event.target && event.target.value && event.target.value.split('__')
    let data = {
      type: layoutData[ 0 ],
      value: layoutData[ 1 ]
    }
    let showTheme = data.type === 'theme'

    setData('ui:settings:pageTemplate', data)
    this.setState({
      current: data,
      showTheme: showTheme
    })
    if (!env('THEME_EDITOR') && env('REMOVE_SETTINGS_SAVE_BUTTON')) {
      settingsStorage.state('pageTemplate').set(data)

      let lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT()
      let lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

      let lastLoadedHeaderTemplate = window.vcvLastLoadedHeaderTemplate || window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() && window.VCV_HEADER_TEMPLATES().current
      let lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()

      let lastLoadedSidebarTemplate = window.vcvLastLoadedSidebarTemplate || window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() && window.VCV_SIDEBAR_TEMPLATES().current
      let lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()

      let lastLoadedFooterTemplate = window.vcvLastLoadedFooterTemplate || window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() && window.VCV_FOOTER_TEMPLATES().current
      let lastSavedFooterTemplate = settingsStorage.state('footerTemplate').get()

      if (
        lastLoadedPageTemplate && (lastLoadedPageTemplate.value !== lastSavedPageTemplate.value || lastLoadedPageTemplate.type !== lastSavedPageTemplate.type) ||
        lastLoadedHeaderTemplate && lastLoadedHeaderTemplate !== lastSavedHeaderTemplate ||
        lastLoadedSidebarTemplate && lastLoadedSidebarTemplate !== lastSavedSidebarTemplate ||
        lastLoadedFooterTemplate && lastLoadedFooterTemplate !== lastSavedFooterTemplate
      ) {
        this.reloadIframe(
          lastSavedPageTemplate,
          lastSavedHeaderTemplate,
          lastSavedSidebarTemplate,
          lastSavedFooterTemplate
        )
      }
    }
  }

  reloadIframe (lastSavedPageTemplate, lastSavedHeaderTemplate, lastSavedSidebarTemplate, lastSavedFooterTemplate) {
    window.vcvLastLoadedPageTemplate = lastSavedPageTemplate
    window.vcvLastLoadedHeaderTemplate = lastSavedHeaderTemplate
    window.vcvLastLoadedSidebarTemplate = lastSavedSidebarTemplate
    window.vcvLastLoadedFooterTemplate = lastSavedFooterTemplate

    workspaceIFrame.set({
      type: 'reload',
      template: lastSavedPageTemplate,
      header: lastSavedHeaderTemplate,
      sidebar: lastSavedSidebarTemplate,
      footer: lastSavedFooterTemplate
    })
    settingsStorage.state('skipBlank').set(true)
  }

  getTemplateOptions () {
    let optGroups = []
    if (vcLayouts && vcLayouts.length) {
      vcLayouts.forEach((templateList, index) => {
        if (this.allowedTypes.indexOf(templateList.type) < 0) {
          return
        }
        let group = []
        templateList.values.forEach((template, tIndex) => {
          group.push(
            <option value={`${templateList.type}__${template.value}`}
              key={`template-opt-group-vc-${index}-opt-${tIndex}`}>
              {template.label}
            </option>
          )
        })
        group.length && optGroups.push(
          <optgroup label={templateList.title} key={`template-opt-group-vc-${index}`}>
            {group}
          </optgroup>
        )
      })
    }

    optGroups.push(<option key='default' value='theme__default'>Theme Default</option>)

    return (
      <React.Fragment>
        {optGroups}
      </React.Fragment>
    )
  }

  getLayoutsDropdown () {
    let value = `${this.state.current.type}__${this.state.current.value}`
    if (this.state.current.type === 'theme') {
      value = 'theme__default'
    }

    return (
      <select className='vcv-ui-form-dropdown' value={value} onChange={this.updateTemplate}>
        {this.getTemplateOptions()}
      </select>
    )
  }

  getThemeTemplateOptions () {
    let options = []
    if (themeTemplates) {
      themeTemplates.forEach((templateList, index) => {
        if (this.allowedTypes.indexOf(templateList.type) < 0) {
          return
        }
        templateList.values.forEach((template, tIndex) => {
          options.push(
            <option value={`${templateList.type}__${template.value}`}
              key={`template-opt-group-theme-${templateList.type}-${index}-opt-${tIndex}`}>
              {template.label}
            </option>
          )
        })
      })
    }

    return (
      <React.Fragment>
        {options}
      </React.Fragment>
    )
  }

  getThemeTemplateDropdown () {
    if (!this.state.showTheme || !themeTemplates) {
      return ''
    }

    return (
      <div className='vcv-ui-form-group'>
        <select className='vcv-ui-form-dropdown' value={`${this.state.current.type}__${this.state.current.value}`}
          onChange={this.updateTemplate}>
          {this.getThemeTemplateOptions()}
        </select>
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        <div className='vcv-ui-form-group'>
          {this.getLayoutsDropdown()}
        </div>
        {this.getThemeTemplateDropdown()}
      </React.Fragment>
    )
  }
}
