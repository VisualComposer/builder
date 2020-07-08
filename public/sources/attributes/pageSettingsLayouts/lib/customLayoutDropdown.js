import React from 'react'
import { getStorage } from 'vc-cake'

const settingsStorage = getStorage('settings')

export default class CustomLayoutDropdown extends React.Component {
  constructor (props) {
    super(props)

    const templateStorageData = settingsStorage.state('pageTemplate').get()
    const templateData = window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT ? window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT() : {
      type: 'vc', value: 'blank'
    }
    const currentTemplate = templateStorageData || templateData

    // TODO get correct current state if page was saved
    this.state = {
      current: currentTemplate.value ? parseInt(currentTemplate.value) : 'default'
    }

    this.handleChangeUpdateLayout = this.handleChangeUpdateLayout.bind(this)
    this.getLayoutOptions = this.getLayoutOptions.bind(this)
  }

  handleChangeUpdateLayout (event) {
    const value = event.target.value
    this.setState({
      current: value
    })
    this.props.onTemplateChange(`vc-custom-layout__${value}`)
  }

  getLayoutOptions () {
    const allLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()
    const customLayouts = allLayouts.find(item => item.type === 'vc-custom-layout')

    if (customLayouts && customLayouts.values) {
      return customLayouts.values.map((item) => (
        <option key={`custom-layout-template-${item.value}`} value={item.value}>{item.label}</option>
      ))
    }
    return null
  }

  render () {
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>Choose layout</span>
        <select className='vcv-ui-form-dropdown' value={this.state.current} onChange={this.handleChangeUpdateLayout}>
          <option value='default'>
            Default
          </option>
          {this.getLayoutOptions()}
        </select>
      </div>
    )
  }
}
