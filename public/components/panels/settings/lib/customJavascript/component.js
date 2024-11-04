import React from 'react'
import ScriptControl from './control'
import HtmlEditor from './htmlEditor'
import { getStorage, getService } from 'vc-cake'
import Tooltip from '../../../../tooltip/tooltip'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const dataManager = getService('dataManager')
const roleManager = getService('roleManager')
const settingsStorage = getStorage('settings')

export default class CustomJavascript extends React.Component {
  static localizations = dataManager.get('localizations')

  constructor (props) {
    super(props)

    this.state = {
      activeIndex: 'localJs',
      localJsHead: settingsStorage.state('localJsHead').get(),
      localJsFooter: settingsStorage.state('localJsFooter').get(),
      globalJsHead: settingsStorage.state('globalJsHead').get(),
      globalJsFooter: settingsStorage.state('globalJsFooter').get()
    }
    this.updateSettings = this.updateSettings.bind(this)
    this.changeActiveButton = this.changeActiveButton.bind(this)
  }

  changeActiveButton (buttonIndex) {
    this.setState({
      activeIndex: buttonIndex
    })
  }

  getButtons () {
    const allButtons = []

    allButtons.push(
      <ScriptControl
        key='vcv-settings-custom-js-local'
        title='Local JavaScript'
        index='localJs'
        active={this.state.activeIndex === 'localJs'}
        changeActive={this.changeActiveButton}
      />
    )

    if (roleManager.can('dashboard_settings_custom_html', roleManager.defaultAdmin())) {
      allButtons.push(
        <ScriptControl
          key='vcv-settings-custom-js-global'
          title='Global JavaScript'
          index='globalJs'
          active={this.state.activeIndex === 'globalJs'}
          changeActive={this.changeActiveButton}
        />
      )
    }

    return allButtons
  }

  updateSettings (key, value) {
    const regex = /document\.write\s*\(/
    if (regex.test(value)) {
      store.dispatch(notificationAdded({
        text: CustomJavascript.localizations.documentWriteWarning,
        html: true,
        time: 15000
      }))
      return false
    }
    settingsStorage.state(key).set(value)
    this.setState({ [key]: value })
  }

  getEditor (type) {
    const allEditors = []

    if (dataManager.get('editorType') === 'template' &&
      type === 'Head' &&
      this.state.activeIndex === 'localJs') {
      return
    }

    const name = `${this.state.activeIndex}${type}`
    const tagName = type.toLowerCase()

    allEditors.push(
      <div
        key={`vcv-settings-scriptEditor${type}-${name}`}
        className='vcv-ui-script-editor-container-type'
      >
        <span className='vcv-ui-script-editor-tag'>&lt;{tagName}&gt;</span>
        <HtmlEditor
          name={name}
          value={this.state[name]}
          updater={this.updateSettings}
        />
        <span className='vcv-ui-script-editor-tag'>&lt;/{tagName}&gt;</span>
      </div>
    )

    return allEditors
  }

  getHelperText () {
    if (this.state.activeIndex === 'localJs') {
      if (dataManager.get('editorType') === 'template') {
        return CustomJavascript.localizations.settingsGlobalTemplateCustomJsLocal
      } else {
        return CustomJavascript.localizations.settingsCustomJsLocal
      }
    } else {
      return CustomJavascript.localizations.settingsCustomJsGlobal
    }
  }

  render () {
    const insertCustomJSCodeSnippets = CustomJavascript.localizations ? CustomJavascript.localizations.insertCustomJSCodeSnippets : 'Add custom JavaScript code to insert it locally or globally on every page in header or footer. Insert Google Analytics, Tag Manager, Kissmetrics, or other JavaScript code snippets.'

    return (
      <div className='vcv-ui-tree-content-section-inner'>
        <div className='vcv-ui-custom-scripts vcv-ui-custom-scripts-areas'>
          <div className='vcv-ui-script-control-container'>
            <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
              {this.getButtons()}
            </div>
            <Tooltip>
              {insertCustomJSCodeSnippets}
            </Tooltip>
          </div>
          <div className='vcv-ui-script-editor-container'>
            {this.getEditor('Head')}
            {this.getEditor('Footer')}
          </div>
        </div>
      </div>
    )
  }
}
