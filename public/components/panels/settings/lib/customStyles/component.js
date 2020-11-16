import React from 'react'
import StyleControl from './control'
import StyleEditor from './editor'
import { setData, getStorage, getService } from 'vc-cake'
import Tooltip from '../../../../tooltip/tooltip'
const settingsStorage = getStorage('settings')
const dataManager = getService('dataManager')

export default class CustomStyles extends React.Component {
  static localizations = dataManager.get('localizations')
  styleData = [
    {
      buttonTitle: CustomStyles.localizations ? CustomStyles.localizations.localCSS : 'Local CSS',
      index: 1,
      name: 'local',
      settingsStorageState: 'customCss'
    }
  ]

  constructor (props) {
    super(props)
    if (dataManager.get('vcvManageOptions')) {
      this.styleData.push(
        {
          buttonTitle: CustomStyles.localizations ? CustomStyles.localizations.globalCSS : 'Global CSS',
          index: 2,
          name: 'global',
          settingsStorageState: 'globalCss'
        })
    }
    const customStyles = {
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
    const allButtons = []
    const { styleData } = this
    const { isActiveIndex } = this.state
    for (const i in styleData) {
      if (Object.prototype.hasOwnProperty.call(styleData, i)) {
        const { ...buttonProps } = this.getButtonProps(styleData[i], isActiveIndex)
        allButtons.push(
          <StyleControl {...buttonProps} />
        )
      }
    }
    return allButtons
  }

  updateSettings (key, value) {
    setData('ui:settings:customStyles:' + key, value)
    this.setState({ [key]: value })
  }

  getEditor () {
    const allEditors = []
    const { styleData } = this
    for (const i in styleData) {
      if (Object.prototype.hasOwnProperty.call(styleData, i)) {
        allEditors.push(
          <StyleEditor
            key={'styleEditor' + styleData[i].index}
            editorLabel={styleData[i].editorLabel}
            index={styleData[i].index}
            activeIndex={this.state.isActiveIndex}
            value={this.state[styleData[i].name]}
            name={styleData[i].name}
            settingsStorageState={styleData[i].settingsStorageState}
            updater={this.updateSettings}
          />
        )
      }
    }
    return allEditors
  }

  render () {
    const applyCustomCSSCode = CustomStyles.localizations ? CustomStyles.localizations.applyCustomCSSCode : 'Apply custom CSS code to the whole site or to this particular page only.'
    const button = this.getButtons()
    const editor = this.getEditor()

    return (
      <div className='vcv-ui-custom-styles'>
        <div className='vcv-ui-style-control-container'>
          <div className='vcv-ui-form-buttons-group vcv-ui-form-button-group--large'>
            {button}
          </div>
          <Tooltip>
            {applyCustomCSSCode}
          </Tooltip>
        </div>
        <div className='vcv-ui-style-editor-container'>
          {editor}
        </div>
      </div>
    )
  }
}
