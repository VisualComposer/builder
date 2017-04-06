import React from 'react'
import StyleControl from './styleControl'
import StyleEditor from './styleEditor'
import {setData, getStorage} from 'vc-cake'
const settingsStorage = getStorage('settings')

export default class SettingsCustomStyles extends React.Component {
  static propTypes = {
    styleData: React.PropTypes.array
  }
  static defaultProps = {
    styleData: [
      {
        buttonTitle: 'Local CSS',
        editorLabel: 'Local CSS will be applied to this particular page only',
        index: 1,
        name: 'local'
      },
      {
        buttonTitle: 'Global CSS',
        editorLabel: 'Global CSS will be applied site wide',
        index: 2,
        name: 'global'
      }
    ]
  }
  constructor (props) {
    super(props)
    let customStyles = {
      local: settingsStorage.state('customCss').get(),
      global: settingsStorage.state('globalCss').get()
    }
    setData('ui:settings:customStyles:global', customStyles.global)
    setData('ui:settings:customStyles:local', customStyles.local)
    this.state = {
      isActiveIndex: 1,
      ...customStyles
    }
    this.updateSettings = this.updateSettings.bind(this)
  }
  componentWillUnmount () {
    setData('ui:settings:customStyles:global', null)
    setData('ui:settings:customStyles:local', null)
  }
  changeActiveButton = (buttonIndex) => {
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
    let {styleData} = this.props
    let {isActiveIndex} = this.state
    for (let i in styleData) {
      if (styleData.hasOwnProperty(i)) {
        let {...buttonProps} = this.getButtonProps(styleData[i], isActiveIndex)
        allButtons.push(
          <StyleControl {...buttonProps} />
        )
      }
    }
    return allButtons
  }
  updateSettings (key, value) {
    setData('ui:settings:customStyles:' + key, value)
    this.setState({[key]: value})
  }
  getEditor () {
    let allEditors = []
    let {styleData} = this.props
    for (let i in styleData) {
      if (styleData.hasOwnProperty(i)) {
        allEditors.push(
          <StyleEditor
            key={'styleEditor' + styleData[i].index}
            editorLabel={styleData[i].editorLabel}
            index={styleData[i].index}
            activeIndex={this.state.isActiveIndex}
            aceId={styleData[i].name + 'Editor'}
            value={this.state[styleData[i].name]}
            name={styleData[i].name}
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
      <div className='vcv-ui-custom-styles'>
        <div className='vcv-ui-style-control-container'>
          {button}
        </div>
        <div className='vcv-ui-style-editor-container'>
          {editor}
        </div>
      </div>
    )
  }
}
