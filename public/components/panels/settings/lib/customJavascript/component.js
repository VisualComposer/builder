import React from 'react'
import ScriptControl from './control'
import HtmlEditor from './htmlEditor'
import { getStorage } from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class CustomJavascript extends React.Component {
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
    if (window.vcvManageOptions) {
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
    settingsStorage.state(key).set(value)
    this.setState({ [key]: value })
  }

  getEditor (type) {
    const allEditors = []

    const name = `${this.state.activeIndex}${type}`
    allEditors.push(
      <HtmlEditor
        key={`vcv-settings-scriptEditor${type}-${name}`}
        name={name}
        value={this.state[name]}
        updater={this.updateSettings}
      />
    )

    return allEditors
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    return (
      <div className='vcv-ui-custom-scripts vcv-ui-custom-scripts-areas'>
        <div className='vcv-ui-script-control-container'>
          <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
            {this.getButtons()}
          </div>
        </div>
        <p className='vcv-ui-form-helper'>
          {this.state.activeIndex === 'localJs' ? localizations.settingsCustomJsLocal : localizations.settingsCustomJsGlobal}
        </p>
        <div className='vcv-ui-script-editor-container'>
          <div className='vcv-ui-script-editor-container-type'>
            <span className='vcv-ui-script-editor-tag'>&lt;head&gt;</span>
            {this.getEditor('Head')}
            <span className='vcv-ui-script-editor-tag'>&lt;/head&gt;</span>
          </div>
          <div className='vcv-ui-script-editor-container-type'>
            <span className='vcv-ui-script-editor-tag'>&lt;footer&gt;</span>
            {this.getEditor('Footer')}
            <span className='vcv-ui-script-editor-tag'>&lt;/footer&gt;</span>
          </div>
        </div>
      </div>
    )
  }
}
