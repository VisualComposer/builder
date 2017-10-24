import React from 'react'
import ScriptControl from './control'
import ScriptEditor from './editor'
import { setData, getStorage } from 'vc-cake'
const settingsStorage = getStorage('settings')

export default class CustomJavascript extends React.Component {
  static propTypes = {
    scriptData: React.PropTypes.array
  }
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static defaultProps = {
    scriptData: [
      {
        buttonTitle: CustomJavascript.localizations ? CustomJavascript.localizations.localJS : 'Local JavaScript',
        editorLabel: CustomJavascript.localizations ? CustomJavascript.localizations.localJSLabel : 'Local JavaScript will be applied to this particular page only',
        index: 1,
        name: 'localJs'
      },
      {
        buttonTitle: CustomJavascript.localizations ? CustomJavascript.localizations.globalJS : 'Global JavaScript',
        editorLabel: CustomJavascript.localizations ? CustomJavascript.localizations.globalJSLabel : 'Global JavaScript will be applied site wide',
        index: 2,
        name: 'globalJs'
      }
    ]
  }

  constructor (props) {
    super(props)
    let customJavascript = {
      local: settingsStorage.state('localJs').get(),
      global: settingsStorage.state('globalJs').get()
    }
    setData('ui:settings:customJavascript:globalJs', customJavascript.global)
    setData('ui:settings:customJavascript:localJs', customJavascript.local)
    this.state = {
      isActiveIndex: 1,
      ...customJavascript
    }
    this.updateSettings = this.updateSettings.bind(this)
    this.changeActiveButton = this.changeActiveButton.bind(this)
  }

  componentWillUnmount () {
    setData('ui:settings:customJavascript:globalJs', null)
    setData('ui:settings:customJavascript:localJs', null)
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
            aceId={scriptData[ i ].name + 'Editor'}
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
    return (
      <div className='vcv-ui-custom-scripts'>
        <div className='vcv-ui-script-control-container'>
          {button}
        </div>
        <div className='vcv-ui-script-editor-container'>
          {editor}
        </div>
      </div>
    )
  }
}
