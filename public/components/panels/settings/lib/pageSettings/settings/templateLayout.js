import React from 'react'
import { setData, getStorage, env } from 'vc-cake'
import LayoutIcons from '../../../../../startBlank/lib/layoutIcons'
import lodash from 'lodash'

const settingsStorage = getStorage('settings')
const vcLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()
const themeTemplates = window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME && window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME()
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

export default class TemplateLayout extends React.Component {
  constructor (props) {
    super(props)
    let templateStorageData = settingsStorage.state('pageTemplate').get()
    let templateData = window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT ? window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT() : {
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
    this.handleTemplateChange = this.handleTemplateChange.bind(this)
    this.updateStretchedContentState = this.updateStretchedContentState.bind(this)
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

  handleTemplateChange (selectedTemplate) {
    let layoutData = selectedTemplate.constructor === String ? selectedTemplate.split('__') : selectedTemplate.target && selectedTemplate.target.value && selectedTemplate.target.value.split('__')
    let data = {
      type: layoutData[ 0 ],
      value: layoutData[ 1 ],
      stretchedContent: this.state.current.stretchedContent
    }

    this.updateTemplate(data)
  }

  updateTemplate (data) {
    let showTheme = data.type === 'theme'

    setData('ui:settings:pageTemplate', data)
    this.setState({
      current: data,
      showTheme: showTheme
    })
    if (!env('THEME_EDITOR')) {
      settingsStorage.state('pageTemplate').set(data)

      let lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT())
      let lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

      let lastLoadedHeaderTemplate = window.vcvLastLoadedHeaderTemplate || (window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() && window.VCV_HEADER_TEMPLATES().current)
      let lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()

      let lastLoadedSidebarTemplate = window.vcvLastLoadedSidebarTemplate || (window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() && window.VCV_SIDEBAR_TEMPLATES().current)
      let lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()

      let lastLoadedFooterTemplate = window.vcvLastLoadedFooterTemplate || (window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() && window.VCV_FOOTER_TEMPLATES().current)
      let lastSavedFooterTemplate = settingsStorage.state('footerTemplate').get()

      if (
        (lastLoadedPageTemplate && (lastLoadedPageTemplate.value !== lastSavedPageTemplate.value || lastLoadedPageTemplate.type !== lastSavedPageTemplate.type || (lastLoadedPageTemplate.stretchedContent !== lastSavedPageTemplate.stretchedContent))) ||
        (lastLoadedHeaderTemplate && lastLoadedHeaderTemplate !== lastSavedHeaderTemplate) ||
        (lastLoadedSidebarTemplate && lastLoadedSidebarTemplate !== lastSavedSidebarTemplate) ||
        (lastLoadedFooterTemplate && lastLoadedFooterTemplate !== lastSavedFooterTemplate)
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

  getTemplateLayoutIcons () {
    let icons = []
    if (vcLayouts && vcLayouts.length) {
      vcLayouts.forEach((templateList, index) => {
        if (this.allowedTypes.indexOf(templateList.type) < 0) {
          return
        }
        templateList.values.forEach((template, tIndex) => {
          let templateName = `${templateList.type}__${template.value}`
          let classes = 'vcv-ui-start-layout-list-item vcv-ui-template-options-item-icon'
          let Icon = LayoutIcons[ templateName ] && LayoutIcons[ templateName ].icon.default
          let iconProps = {
            classes: 'vcv-ui-template-options-item vcv-ui-start-layout-list-item-icon'
          }
          if (this.state.current.type === templateList.type && this.state.current.value === template.value) {
            classes += ' vcv-ui-start-layout-list-item-active'
          }
          icons.push(
            <span className={classes}
              title={template.label}
              key={`settings-layout-${index}-${tIndex}`}
              onClick={() => { this.handleTemplateChange(templateName) }}>
              <Icon {...iconProps} />
            </span>
          )
        })
      })
    }

    let classes = 'vcv-ui-start-layout-list-item vcv-ui-template-options-item-icon'
    let Icon = LayoutIcons[ 'theme-default' ] && LayoutIcons[ 'theme-default' ].icon.default
    let iconProps = {
      classes: 'vcv-ui-template-options-item vcv-ui-start-layout-list-item-icon'
    }
    if (this.state.current.type === 'theme') {
      classes += ' vcv-ui-start-layout-list-item-active'
    }
    icons.push(
      <span className={classes}
        title='Theme default'
        key={`settings-layout-theme-default`}
        onClick={() => { this.handleTemplateChange('theme__default') }}>
        <Icon {...iconProps} />
      </span>
    )

    return (
      <div className='vcv-ui-template-options-wrapper'>
        {icons}
      </div>
    )
  }

  getLayoutsDropdown () {
    let value = `${this.state.current.type}__${this.state.current.value}`
    if (this.state.current.type === 'theme') {
      value = 'theme__default'
    }

    return (
      <select className='vcv-ui-form-dropdown' value={value} onChange={this.handleTemplateChange}>
        {this.getTemplateOptions()}
      </select>
    )
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
    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (!this.state.showTheme || !themeTemplates) {
      return ''
    }
    let templateTxt = localizations ? localizations.template : 'Template'

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>{templateTxt}</span>
        <select className='vcv-ui-form-dropdown' value={`${this.state.current.type}__${this.state.current.value}`}
          onChange={this.handleTemplateChange}>
          {this.getThemeTemplateOptions()}
        </select>
      </div>
    )
  }

  updateStretchedContentState (event) {
    const newValue = event.target.checked
    let currentTemplate = lodash.defaultsDeep({}, this.state.current)
    currentTemplate.stretchedContent = newValue
    this.updateTemplate(currentTemplate)
  }

  getStretchedToggle () {
    const { current } = this.state
    if (current.type === 'theme') {
      return null
    }

    let checked = current.stretchedContent
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <div className='vcv-ui-form-switch-container'>
          <label className='vcv-ui-form-switch'>
            <input type='checkbox' onChange={this.updateStretchedContentState} id='vcv-stretch-layout-enable' checked={checked} />
            <span className='vcv-ui-form-switch-indicator' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
          </label>
          <label htmlFor='vcv-stretch-layout-enable'
            className='vcv-ui-form-switch-trigger-label'>Stretch content</label>
        </div>
      </div>
    )
  }

  render () {
    return (
      <React.Fragment>
        <div className='vcv-ui-form-group vcv-ui-template-group-wrapper'>
          {this.getTemplateLayoutIcons()}
        </div>
        {this.getThemeTemplateDropdown()}
        {this.getStretchedToggle()}
      </React.Fragment>
    )
  }
}
