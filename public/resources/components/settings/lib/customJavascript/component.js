import React from 'react'
import ScriptControl from './control'
import ScriptEditor from './editor'
import { setData, getStorage, env } from 'vc-cake'
import PropTypes from 'prop-types'
const settingsStorage = getStorage('settings')

export default class CustomJavascript extends React.Component {
  static propTypes = {
    scriptData: PropTypes.array
  }
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static defaultProps = {
    scriptData: [
      {
        buttonTitle: CustomJavascript.localizations ? CustomJavascript.localizations.localJS : 'Local JavaScript',
        editorLabel: CustomJavascript.localizations ? CustomJavascript.localizations.localJSLabel : 'Local JavaScript will be applied to this particular page only',
        index: 1,
        name: 'local'
      },
      {
        buttonTitle: CustomJavascript.localizations ? CustomJavascript.localizations.globalJS : 'Global JavaScript',
        editorLabel: CustomJavascript.localizations ? CustomJavascript.localizations.globalJSLabel : 'Global JavaScript will be applied site wide',
        index: 2,
        name: 'global'
      }
    ]
  }

  constructor (props) {
    super(props)
    let customJavascript = {
      local: settingsStorage.state('localJs').get(),
      global: settingsStorage.state('globalJs').get()
    }
    setData('ui:settings:customJavascript:global', customJavascript.global)
    setData('ui:settings:customJavascript:local', customJavascript.local)
    this.state = {
      isActiveIndex: 1,
      ...customJavascript
    }
    this.updateSettings = this.updateSettings.bind(this)
    this.changeActiveButton = this.changeActiveButton.bind(this)
  }

  changeActiveButton (buttonIndex) {
    this.setState({
      isActiveIndex: buttonIndex
    })
  }

  getButtonProps (buttonData, isActiveIndex) {
    return {
      key: buttonData.name + buttonData.index,
      title: buttonData.buttonTitle,
      index: buttonData.index,
      active: (isActiveIndex === buttonData.index),
      changeActive: this.changeActiveButton
    }
  }

  getButtons () {
    let allButtons = []
    let { scriptData } = this.props
    let { isActiveIndex } = this.state
    for (let i in scriptData) {
      if (scriptData.hasOwnProperty(i)) {
        let { ...buttonProps } = this.getButtonProps(scriptData[ i ], isActiveIndex)
        allButtons.push(
          <ScriptControl {...buttonProps} />
        )
      }
    }
    return allButtons
  }

  updateSettings (key, value) {
    setData('ui:settings:customJavascript:' + key, value)
    this.setState({ [key]: value })
  }

  getEditor () {
    let allEditors = []
    let { scriptData } = this.props
    for (let i in scriptData) {
      if (scriptData.hasOwnProperty(i)) {
        allEditors.push(
          <ScriptEditor
            key={'scriptEditor' + scriptData[ i ].index}
            editorLabel={scriptData[ i ].editorLabel}
            index={scriptData[ i ].index}
            activeIndex={this.state.isActiveIndex}
            value={this.state[ scriptData[ i ].name ]}
            name={scriptData[ i ].name}
            updater={this.updateSettings}
          />
        )
      }
    }
    return allEditors
  }

  render () {
    let button = this.getButtons()
    let editor = this.getEditor()

    if (env('FT_JS_SETTINGS')) {
      return (
        <div className='vcv-ui-custom-scripts vcv-ui-custom-scripts-areas'>
          <div className='vcv-ui-script-control-container'>
            <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
              {button}
            </div>
          </div>
          <p className='vcv-ui-form-helper'>
            Add custom JavaScript code to insert it globally on every page in &lt;header&gt; or &lt;footer&gt;. Insert Google Analytics, Tag Manager, Kissmetrics or other JavaScript code snippets.
          </p>
          <div className='vcv-ui-script-editor-container'>
            <div className='vcv-ui-script-editor-container-type'>
              <span className='vcv-ui-script-editor-tag'>&lt;head&gt;</span>
              {editor}
              <span className='vcv-ui-script-editor-tag'>&lt;/head&gt;</span>
            </div>
            <div className='vcv-ui-script-editor-container-type'>
              <span className='vcv-ui-script-editor-tag'>&lt;footer&gt;</span>
              {editor}
              <span className='vcv-ui-script-editor-tag'>&lt;/footer&gt;</span>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className='vcv-ui-custom-scripts'>
        <div className='vcv-ui-script-control-container'>
          <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
            {button}
          </div>
        </div>
        <div className='vcv-ui-script-editor-container'>
          {editor}
        </div>
      </div>
    )
  }
}
