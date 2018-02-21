import React from 'react'
import {env, setData, getStorage} from 'vc-cake'
import PropTypes from 'prop-types'
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')

const settingsStorage = getStorage('settings')

export default class LayoutDropdown extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    layoutName: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    const layoutName = props.layoutName.toLowerCase()
    const currentLayout = settingsStorage.state(`${layoutName}Template`).get() || props.data.current || 'default'

    this.state = {
      current: currentLayout
    }

    setData(`ui:settings:${layoutName}Template`, currentLayout)

    this.updateLayout = this.updateLayout.bind(this)
    this.getTemplateOptions = this.getTemplateOptions.bind(this)
  }

  updateLayout (event) {
    const layoutName = this.props.layoutName.toLowerCase()
    const layoutNameUppercase = this.props.layoutName.toUpperCase()
    const value = event.target.value
    setData(`ui:settings:${layoutName}Template`, value)
    this.setState({
      current: value
    })

    if (!env('THEME_EDITOR') && env('REMOVE_SETTINGS_SAVE_BUTTON')) {
      if (env('THEME_LAYOUTS')) {
        settingsStorage.state(`${layoutName}Template`).set(value)
      }
      const globalLayoutName = `VCV_${layoutNameUppercase}_TEMPLATES`
      const lastLoadedTemplate = window[`vcvLastLoaded${this.props.layoutName}Template`] || window[globalLayoutName] && window[globalLayoutName]() && window[globalLayoutName]().current
      const lastSavedTemplate = settingsStorage.state(`${layoutName}Template`).get()

      if (lastLoadedTemplate && lastLoadedTemplate !== lastSavedTemplate) {
        this.reloadIframe(lastSavedTemplate)
      }
    }
  }

  getTemplateOptions () {
    const { data } = this.props
    return Object.keys(data.all).map((key, index) => (
      <option key={index} value={key}>{data.all[ key ]}</option>
    ))
  }

  reloadIframe (lastSavedTemplate) {
    const layoutName = this.props.layoutName.toLowerCase()
    window[`vcvLastLoaded${this.props.layoutName}Template`] = lastSavedTemplate

    workspaceIFrame.set({
      type: 'reload',
      [layoutName]: settingsStorage.state(`${layoutName}Template`).get()
    })
    settingsStorage.state('skipBlank').set(true)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const chooseHFSText = localizations ? localizations.chooseHFS : 'Choose {name} template from the list or <a href="{link}" target="_blank">create new</a>.'
    const selectHFSText = localizations ? localizations.selectHFS : 'Select {name} template'
    const globalUrl = `vcvCreate${this.props.layoutName}`
    const createNewUrl = window[ globalUrl ] ? window[ globalUrl ] : ''

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>{this.props.layoutName}</span>
        <select className='vcv-ui-form-dropdown' value={this.state.current} onChange={this.updateLayout}>
          <option value='default'>
            {selectHFSText.replace('{name}', this.props.layoutName.toLocaleLowerCase())}
          </option>
          {this.getTemplateOptions()}
        </select>
        <p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{__html: chooseHFSText.replace('{name}', this.props.layoutName.toLocaleLowerCase()).replace('{link}', createNewUrl)}} />
      </div>
    )
  }
}
