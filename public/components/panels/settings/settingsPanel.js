import React from 'react'

import CustomStyles from './lib/customStyles/component'
import PageSettings from './lib/pageSettings/component'
import CustomScripts from './lib/customJavascript/component'

import PanelNavigation from '../panelNavigation'
import Scrollbar from '../../scrollbar/scrollbar'

const localizations = window.VCV_I18N && window.VCV_I18N()
const customCSSText = localizations ? localizations.customCSS : 'Custom CSS'
const settingsText = localizations ? localizations.layout : 'Layout'
const customJSText = localizations ? localizations.customJS : 'Custom JavaScript'

const controls = {
  layout: {
    index: 0,
    type: 'layout',
    title: settingsText,
    content: <PageSettings />
  },
  customCss: {
    index: 1,
    type: 'customCss',
    title: customCSSText,
    content: <CustomStyles />
  },
  customJs: {
    index: 2,
    type: 'customJs',
    title: customJSText,
    content: <CustomScripts />
  }
}

export default class SettingsPanel extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activeSection: 'layout'
    }

    this.setActiveSection = this.setActiveSection.bind(this)
  }

  setActiveSection (type) {
    this.setState({ activeSection: type })
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const settingsText = localizations ? localizations.settings : 'Settings'

    return (
      <div className='vcv-ui-tree-view-content vcv-ui-tree-view-content--full-width'>
        <div className='vcv-ui-panel-heading'>
          <i className='vcv-ui-panel-heading-icon vcv-ui-icon vcv-ui-icon-cog' />
          <span className='vcv-ui-panel-heading-text'>
            {settingsText}
          </span>
        </div>
        <PanelNavigation controls={controls} activeSection={this.state.activeSection} setActiveSection={this.setActiveSection} />
        <div className='vcv-ui-tree-content-section'>
          <Scrollbar>
            <div className='vcv-ui-tree-content-section-inner'>
              {controls[this.state.activeSection].content}
            </div>
          </Scrollbar>
        </div>
      </div>
    )
  }
}
