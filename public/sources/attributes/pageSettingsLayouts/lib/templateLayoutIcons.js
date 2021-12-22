import React from 'react'
import { getStorage, getService, env } from 'vc-cake'
import LayoutIcons from './layoutIcons'
import lodash from 'lodash'
import CustomLayoutDropdown from './customLayoutDropdown'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const settingsStorage = getStorage('settings')
const enabledVcLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()
const allAvailableVcLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS_ALL && window.VCV_PAGE_TEMPLATES_LAYOUTS_ALL()
const themeTemplates = window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME && window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME()
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
const editorPopupStorage = getStorage('editorPopup')
const dataManager = getService('dataManager')
const hubAddonsStorage = getStorage('hubAddons')
const themeBuilder = env('VCV_FT_JS_THEME_BUILDER_CUSTOM_LAYOUTS')

export default class TemplateLayoutIcons extends React.Component {
  constructor (props) {
    super(props)
    const templateStorageData = settingsStorage.state('pageTemplate').get()
    if (themeBuilder && templateStorageData.type === 'theme') {
      templateStorageData.type = 'vc-custom-layout'
    }
    this.state = {
      current: templateStorageData
    }
    if (themeBuilder) {
      this.allowedTypes = ['vc', 'vc-theme', 'vc-custom-layout']
    } else {
      this.allowedTypes = ['vc', 'vc-theme']
    }
    this.updateTemplate = this.updateTemplate.bind(this)
    this.updateState = this.updateState.bind(this)
    this.handleTemplateChange = this.handleTemplateChange.bind(this)
    this.handleChangeUpdateStretchedContentState = this.handleChangeUpdateStretchedContentState.bind(this)
    this.getLayoutDropdown = this.getLayoutDropdown.bind(this)
    this.handleLockIconHover = this.handleLockIconHover.bind(this)
    this.handleLockIconHoverLeave = this.handleLockIconHoverLeave.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('pageTemplate').onChange(this.updateState)
  }

  componentWillUnmount () {
    settingsStorage.state('pageTemplate').ignoreChange(this.updateState)
  }

  updateState (data) {
    if (data) {
      if (themeBuilder && data.type === 'theme') {
        data.type = 'vc-custom-layout'
      }
      this.setState({
        current: data
      })
    }
  }

  handleTemplateChange (selectedTemplate, isLocked = false) {
    if (isLocked) {
      const localizations = dataManager.get('localizations')
      const isPremiumActivated = dataManager.get('isPremiumActivated')
      const goPremiumText = localizations ? localizations.goPremium : 'Go Premium'
      const downloadAddonText = localizations ? localizations.downloadTheAddon : 'Download The Addon'
      const fullScreenPopupData = {
        headingText: localizations ? localizations.doMoreWithPremium : 'Do More With Premium',
        buttonText: isPremiumActivated ? downloadAddonText : goPremiumText,
        description: localizations ? localizations.applyLayoutWithHFS : 'Apply a layout with a header, footer, and sidebar with Visual Composer Premium.',
        addonName: 'themeBuilder',
        isPremiumActivated: isPremiumActivated
      }
      if (isPremiumActivated) {
        fullScreenPopupData.clickSettings = {
          action: 'addHub',
          options: {
            filterType: 'addon',
            id: 3,
            bundleType: undefined
          }
        }
      } else {
        const utm = dataManager.get('utm')
        fullScreenPopupData.url = utm['editor-layout-go-premium']
      }
      const allAddons = hubAddonsStorage.state('addons').get()
      if (allAddons.themeEditor && allAddons.themeBuilder) {
        const successMessage = localizations.successAddonDownload || '{name} has been successfully downloaded from the Visual Composer Hub and added to your content library. To finish the installation process reload the page.'
        store.dispatch(notificationAdded({
          type: 'warning',
          text: successMessage.replace('{name}', 'Theme Builder'),
          time: 8000
        }))
      } else {
        editorPopupStorage.state('fullScreenPopupData').set(fullScreenPopupData)
        editorPopupStorage.state('activeFullPopup').set('premium-teaser')
      }
      return
    }
    const layoutData = selectedTemplate.constructor === String ? selectedTemplate.split('__') : selectedTemplate.target && selectedTemplate.target.value && selectedTemplate.target.value.split('__')
    let value = layoutData[1]
    if (value !== 'none' && value !== 'default' && parseInt(value)) {
      value = parseInt(layoutData[1])
    }
    const data = {
      type: layoutData[0],
      value: value,
      stretchedContent: this.state.current.stretchedContent
    }

    this.updateTemplate(data)
  }

  updateTemplate (data) {
    this.setState({
      current: data
    })
    if (!env('VCV_JS_THEME_EDITOR')) {
      settingsStorage.state('pageTemplate').set(data)

      const lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT())
      const lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

      const lastLoadedHeaderTemplate = window.vcvLastLoadedHeaderTemplate || (window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() && window.VCV_HEADER_TEMPLATES().current)
      const lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()

      const lastLoadedSidebarTemplate = window.vcvLastLoadedSidebarTemplate || (window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() && window.VCV_SIDEBAR_TEMPLATES().current)
      const lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()

      const lastLoadedFooterTemplate = window.vcvLastLoadedFooterTemplate || (window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() && window.VCV_FOOTER_TEMPLATES().current)
      const lastSavedFooterTemplate = settingsStorage.state('footerTemplate').get()

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

  getLockControl () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const lockIconTitle = localizations ? localizations.layoutsAvailableInPremium : 'All layouts are available in the Premium version.'
    return (
      <span
        className='vcv-ui-layout-lock-control'
        title={lockIconTitle}
        onMouseEnter={this.handleLockIconHover}
        onMouseLeave={this.handleLockIconHoverLeave}
      >
        <i className='vcv-ui-icon vcv-ui-icon-lock-fill' />
      </span>
    )
  }

  addDefaultIcon () {
    const iconProps = {
      classes: 'vcv-ui-template-options-item vcv-ui-start-layout-list-item-icon'
    }

    let classes = 'vcv-ui-start-layout-list-item vcv-ui-template-options-item-icon'
    const Icon = LayoutIcons['vc-custom-layout'] && LayoutIcons['vc-custom-layout'].icon.default

    // Merge theme and vc-custom-layout
    if (this.state.current.type === 'theme' || this.state.current.type === 'vc-custom-layout') {
      classes += ' vcv-ui-start-layout-list-item-active'
    }

    return (
      <span
        className={classes}
        title='Default'
        key='settings-layout-theme-default'
        onClick={() => { this.handleTemplateChange((themeBuilder ? 'vc-custom-layout' : 'theme') + '__default') }}
      >
        <Icon {...iconProps} />
      </span>
    )
  }

  getTemplateLayoutIcons () {
    const icons = []
    const iconProps = {
      classes: 'vcv-ui-template-options-item vcv-ui-start-layout-list-item-icon'
    }
    icons.push(this.addDefaultIcon())
    if (enabledVcLayouts && allAvailableVcLayouts && enabledVcLayouts.length && allAvailableVcLayouts.length) {
      allAvailableVcLayouts.forEach((templateList, index) => {
        let isLocked = false
        let lockControl = null
        const isLayoutAllowed = enabledVcLayouts.find(item => item.type === templateList.type)
        if (!isLayoutAllowed) {
          lockControl = this.getLockControl()
          isLocked = true
        }
        templateList.values.forEach((template, tIndex) => {
          const templateName = `${templateList.type}__${template.value}`
          let classes = 'vcv-ui-start-layout-list-item vcv-ui-template-options-item-icon'
          if (isLocked) {
            classes += ' vcv-ui-item-template-inactive--locked'
          }
          const Icon = LayoutIcons[templateName] && LayoutIcons[templateName].icon.default
          if (Icon) {
            if (this.state.current.type === templateList.type && this.state.current.value === template.value) {
              classes += ' vcv-ui-start-layout-list-item-active'
            }
            icons.push(
              <span
                className={classes}
                title={template.label}
                key={`settings-layout-${index}-${tIndex}`}
                onClick={() => { this.handleTemplateChange(templateName, isLocked) }}
              >
                {lockControl}
                <Icon {...iconProps} />
              </span>
            )
          }
        })
      })
    }

    return (
      <div className='vcv-ui-template-options-wrapper'>
        {icons}
      </div>
    )
  }

  getThemeTemplateOptions () {
    const options = []
    if (themeTemplates) {
      themeTemplates.values.forEach((template, tIndex) => {
        options.push(
          <option
            value={`${themeTemplates.type}__${template.value}`}
            key={`template-opt-group-theme-${themeTemplates.type}-opt-${tIndex}`}
          >
            {template.label}
          </option>
        )
      })
    }

    return options
  }

  getThemeTemplateDropdown () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    if (this.state.current.type !== 'theme') {
      return null
    }

    if (!themeTemplates) {
      return ''
    }
    const templateTxt = localizations ? localizations.template : 'Template'

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>{templateTxt}</span>
        <select
          className='vcv-ui-form-dropdown' value={`${this.state.current.type}__${this.state.current.value}`}
          onChange={this.handleTemplateChange}
        >
          {this.getThemeTemplateOptions()}
        </select>
      </div>
    )
  }

  handleLockIconHover (event) {
    const icon = event.currentTarget.children[0]
    icon.classList.toggle('vcv-ui-icon-unlock-fill')
    icon.classList.toggle('vcv-ui-icon-lock-fill')
  }

  handleLockIconHoverLeave (event) {
    const icon = event.currentTarget.children[0]
    icon.classList.toggle('vcv-ui-icon-unlock-fill')
    icon.classList.toggle('vcv-ui-icon-lock-fill')
  }

  handleChangeUpdateStretchedContentState (event) {
    const newValue = event.target.checked
    const currentTemplate = lodash.defaultsDeep({}, this.state.current)
    currentTemplate.stretchedContent = newValue
    this.updateTemplate(currentTemplate)
  }

  getStretchedToggle () {
    const { current } = this.state
    if (current.type === 'theme') {
      return null
    }

    const checked = current.stretchedContent || false
    return (
      <div className='vcv-ui-form-group vcv-ui-form-group-style--inline'>
        <div className='vcv-ui-form-switch-container'>
          <label className='vcv-ui-form-switch'>
            <input type='checkbox' onChange={this.handleChangeUpdateStretchedContentState} id='vcv-stretch-layout-enable' checked={checked} />
            <span className='vcv-ui-form-switch-indicator' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-on='on' />
            <span className='vcv-ui-form-switch-label' data-vc-switch-off='off' />
          </label>
          <label
            htmlFor='vcv-stretch-layout-enable'
            className='vcv-ui-form-switch-trigger-label'
          >Stretch content
          </label>
        </div>
      </div>
    )
  }

  getLayoutDropdown () {
    const { current } = this.state
    if (current.type !== 'vc-custom-layout') {
      return null
    }

    return (
      <CustomLayoutDropdown
        onTemplateChange={this.handleTemplateChange}
        current={this.state.current}
      />
    )
  }

  render () {
    return (
      <>
        <div className='vcv-ui-form-group vcv-ui-template-group-wrapper'>
          {this.getTemplateLayoutIcons()}
        </div>
        {this.getThemeTemplateDropdown()}
        {this.getStretchedToggle()}
        {this.getLayoutDropdown()}
      </>
    )
  }
}
