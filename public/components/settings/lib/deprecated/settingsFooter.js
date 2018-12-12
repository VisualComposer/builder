import React from 'react'
import classNames from 'classnames'
import { getData, getStorage, env } from 'vc-cake'

const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
export default class SettingsFooter extends React.Component {
  startEffectTimeout = null
  stopEffectTimeout = null

  constructor (props) {
    super(props)
    this.state = {
      saving: false,
      saved: false
    }

    this.startEffect = this.startEffect.bind(this)
    this.stopEffect = this.stopEffect.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  componentWillUnmount () {
    if (this.startEffectTimeout) {
      window.clearTimeout(this.startEffectTimeout)
      this.startEffectTimeout = null
    }
    if (this.stopEffectTimeout) {
      window.clearTimeout(this.stopEffectTimeout)
      this.stopEffectTimeout = null
    }
  }

  onSave () {
    let { actions } = this.props
    actions.forEach(action => {
      settingsStorage.state(action.state).set(getData(action.getData))
    })
    if (!env('THEME_EDITOR')) {
      let lastLoadedPageTemplate = window.vcvLastLoadedPageTemplate || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT())
      let lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()

      let lastLoadedHeaderTemplate = window.vcvLastLoadedHeaderTemplate || (window.VCV_HEADER_TEMPLATES && window.VCV_HEADER_TEMPLATES() && window.VCV_HEADER_TEMPLATES().current)
      let lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()

      let lastLoadedSidebarTemplate = window.vcvLastLoadedSidebarTemplate || (window.VCV_SIDEBAR_TEMPLATES && window.VCV_SIDEBAR_TEMPLATES() && window.VCV_SIDEBAR_TEMPLATES().current)
      let lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()

      let lastLoadedFooterTemplate = window.vcvLastLoadedFooterTemplate || (window.VCV_FOOTER_TEMPLATES && window.VCV_FOOTER_TEMPLATES() && window.VCV_FOOTER_TEMPLATES().current)
      let lastSavedFooterTemplate = settingsStorage.state('footerTemplate').get()

      if (
        (lastLoadedPageTemplate && (lastLoadedPageTemplate.value !== lastSavedPageTemplate.value || lastLoadedPageTemplate.type !== lastSavedPageTemplate.type)) ||
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
    this.effect()
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

  effect () {
    this.setState({ 'saving': true })
    if (this.startEffectTimeout) {
      window.clearTimeout(this.startEffectTimeout)
      this.startEffectTimeout = null
    }
    this.startEffectTimeout = setTimeout(this.startEffect, 500)
  }

  startEffect () {
    this.setState({ 'saving': false })
    this.setState({ 'saved': true })

    if (this.stopEffectTimeout) {
      window.clearTimeout(this.stopEffectTimeout)
      this.stopEffectTimeout = null
    }
    this.stopEffectTimeout = setTimeout(this.stopEffect, 1000)
  }

  stopEffect () {
    this.setState({ 'saved': false })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const saveText = localizations ? localizations.save : 'Save'

    let saveButtonClasses = classNames({
      'vcv-ui-settings-action': true,
      'vcv-ui-state--success': this.state.saved
    })
    let saveIconClasses = classNames({
      'vcv-ui-settings-action-icon': true,
      'vcv-ui-wp-spinner': this.state.saving,
      'vcv-ui-icon': !this.state.saving,
      'vcv-ui-icon-save': !this.state.saving
    })

    return (
      <div className='vcv-ui-settings-content-footer'>
        <div className='vcv-ui-settings-actions'>
          <span className={saveButtonClasses} title={saveText} onClick={this.onSave}>
            <span className='vcv-ui-settings-action-content'>
              <i className={saveIconClasses} />
              <span>{saveText}</span>
            </span>
          </span>
        </div>
      </div>
    )
  }
}
