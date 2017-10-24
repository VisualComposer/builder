import React from 'react'
import SettingsContent from './lib/settingsContent'
import SettingsFooter from './lib/settingsFooter'
import CustomStyles from './lib/customStyles/component'
import CustomScripts from './lib/customJavascript/component'
import { env } from 'vc-cake'

export default class SettingsPanel extends React.Component {
  constructor (props) {
    super(props)
    let sections = []
    let actions = []

    /**
     * Temporary addition type
     * Add "Custom CSS" to settings
     */
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const customCSSText = localizations ? localizations.customCSS : 'Custom CSS'
    const customJSText = localizations ? localizations.customJS : 'Custom JavaScript'
    sections.push({
      title: customCSSText,
      content: CustomStyles
    })
    if (env('CUSTOM_JS')) {
      sections.push({
        title: customJSText,
        content: CustomScripts
      })
    }

    actions.push({
      state: 'globalCss',
      getData: 'ui:settings:customStyles:global'
    })
    actions.push({
      state: 'customCss',
      getData: 'ui:settings:customStyles:local'
    })
    if (env('CUSTOM_JS')) {
      actions.push({
        state: 'globalJs',
        getData: 'ui:settings:customJavascript:globalJs'
      })
      actions.push({
        state: 'localJs',
        getData: 'ui:settings:customJavascript:localJs'
      })
    }

    this.state = {
      sections,
      actions
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const settingsText = localizations ? localizations.settings : 'Settings'
    const { sections, actions } = this.state

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-add-element-content'>
        <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content-accordion'>
          <div className='vcv-ui-edit-form-header'>
            <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-cog vcv-ui-settings-title-icon' />
            <span className='vcv-ui-edit-form-header-title'>
              {settingsText}
            </span>
          </div>
          <div className='vcv-ui-tree-content'>
            <SettingsContent sections={sections} />
          </div>
          <SettingsFooter actions={actions} />
        </div>
      </div>
    )
  }
}
