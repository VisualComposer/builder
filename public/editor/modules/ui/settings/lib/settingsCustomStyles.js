import React from 'react'
import StyleControl from './styleControl'
import StyleEditor from './styleEditor'
import {getService, setData} from 'vc-cake'

const assetManager = getService('assets-manager')

export default class SettingsCustomStyles extends React.Component {
  static propTypes = {
    styleData: React.PropTypes.array,
    customStyles: React.PropTypes.any
  }
  static defaultProps = {
    styleData: [
      {
        buttonTitle: 'Local CSS',
        editorLabel: 'Local CSS will be applied to this particular page only',
        index: 0,
        name: 'local',
        value: null
      },
      {
        buttonTitle: 'Global CSS',
        editorLabel: 'Global CSS will be applied site wide',
        index: 1,
        name: 'global',
        value: null
      }
    ]
  }
  constructor (props) {
    super(props)
    this.props.styleData[0].value = assetManager.getCustomCss()
    this.props.styleData[1].value = assetManager.getGlobalCss()
    setData('ui:settings:customStyles:local', this.props.styleData[0].value)
    setData('ui:settings:customStyles:global', this.props.styleData[1].value)
    this.state = {
      isActiveIndex: 0
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
  updateSettings (key, name, value) {
    setData('ui:settings:customStyles:' + name, value)
    this.props.styleData[key].value = value
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
            value={styleData[i].value}
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
