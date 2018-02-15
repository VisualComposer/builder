import React from 'react'
import {setData, getStorage} from 'vc-cake'
import PropTypes from 'prop-types'

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
    setData(`ui:settings:${layoutName}Template`, event.target.value)
    this.setState({
      current: event.target.value
    })
  }

  getTemplateOptions () {
    const { data } = this.props
    return Object.keys(data.all).map((key, index) => (
      <option key={index} value={key}>{data.all[ key ]}</option>
    ))
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
