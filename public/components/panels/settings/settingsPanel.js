import React from 'react'
import classNames from 'classnames'
import { getService, getStorage } from 'vc-cake'
import CustomStyles from './lib/customStyles/component'
import PageSettings from './lib/pageSettings/component'
import CustomScripts from './lib/customJavascript/component'
import Popup from './lib/popup/component'
import ElementsLock from './lib/elementsLock/component'

import PanelNavigation from '../panelNavigation'
import Scrollbar from '../../scrollbar/scrollbar'

const dataManager = getService('dataManager')
const roleManager = getService('roleManager')
const localizations = dataManager.get('localizations')
const customCSSText = localizations ? localizations.customCSS : 'Custom CSS'
const settingsText = localizations ? localizations.pageSettings : 'Page Settings'
const customJSText = localizations ? localizations.customJS : 'Custom JavaScript'
const popupText = localizations ? localizations.popup : 'Popup'
const elementsLockText = localizations ? localizations.elementsLock : 'Element Lock'
const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')

const controls = {}
let activeSection = null

if (roleManager.can('editor_settings_page', roleManager.defaultTrue())) {
  activeSection = 'pageSettings'
  controls.pageSettings = {
    index: 0,
    type: 'pageSettings',
    title: settingsText,
    content: <PageSettings />
  }
}

if (roleManager.can('settings_custom_html', roleManager.defaultTrue())) {
  if (!activeSection) {
    activeSection = 'customCss'
  }
  controls.customCss = {
    index: 1,
    type: 'customCss',
    title: customCSSText,
    content: <CustomStyles />
  }
  controls.customJs = {
    index: 2,
    type: 'customJs',
    title: customJSText,
    content: <CustomScripts />
  }
}

const editorType = dataManager.get('editorType')
const allowedPostTypes = ['default', 'vcv_archives', 'vcv_tutorials']
if (allowedPostTypes.indexOf(editorType) > -1 && roleManager.can('editor_settings_popup', roleManager.defaultTrue())) {
  if (!activeSection) {
    activeSection = 'popup'
  }
  controls.popup = {
    index: 3,
    type: 'popup',
    title: popupText,
    content: <Popup />
  }
}

if (roleManager.can('editor_settings_element_lock', roleManager.defaultAdmin())) {
  if (!activeSection) {
    activeSection = 'elementsLock'
  }
  controls.elementsLock = {
    index: 4,
    type: 'elementsLock',
    title: elementsLockText,
    content: <ElementsLock />
  }
}

export default class SettingsPanel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeSection: activeSection,
      isVisible: workspaceContentState.get() === 'settings'
    }

    this.setActiveSection = this.setActiveSection.bind(this)
    this.setVisibility = this.setVisibility.bind(this)
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setVisibility)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setVisibility)
  }

  setVisibility (activePanel) {
    this.setState({
      isVisible: activePanel === 'settings'
    })
  }

  setActiveSection (type) {
    this.setState({ activeSection: type })
  }

  render () {
    const settingsText = localizations ? localizations.settings : 'Settings'

    const settingsPanelClasses = classNames({
      'vcv-ui-tree-view-content': true,
      'vcv-ui-tree-view-content--full-width': true,
      'vcv-ui-state--hidden': !this.state.isVisible
    })

    return (
      <div className={settingsPanelClasses}>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-cog' />
          <span className='vcv-ui-panel-heading-text'>
            {settingsText}
          </span>
        </div>
        <PanelNavigation controls={controls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            {controls[this.state.activeSection].content}
          </Scrollbar>
        </div>
      </div>
    )
  }
}
