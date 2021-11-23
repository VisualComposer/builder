import React from 'react'

export default class CustomLayoutDropdown extends React.Component {
  constructor (props) {
    super(props)

    this.handleChangeUpdateLayout = this.handleChangeUpdateLayout.bind(this)
    this.getLayoutOptions = this.getLayoutOptions.bind(this)
  }

  handleChangeUpdateLayout (event) {
    const value = event.target.value
    this.props.onTemplateChange(`vc-custom-layout__${value}`)
  }

  getLayoutOptions () {
    // since v41 we merging theme options and layout options
    const allLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()
    const themeLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME && window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME()
    const customLayouts = allLayouts.find(item => item.type === 'vc-custom-layout')

    let options = []
    if (themeLayouts && themeLayouts.values) {
      options = options.concat(themeLayouts.values.map((item) => (
        <option key={`theme-layout-template-${item.value}`} value={item.value}>{item.label}</option>
      )))
    }
    if (customLayouts && customLayouts.values) {
      options = options.concat(customLayouts.values.map((item) => (
        <option key={`custom-layout-template-${item.value}`} value={item.value}>{item.label}</option>
      )))
    }

    return options
  }

  render () {
    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>Choose layout</span>
        <select className='vcv-ui-form-dropdown' value={this.props.current.value} onChange={this.handleChangeUpdateLayout}>
          <option value='default'>
            Default
          </option>
          {this.getLayoutOptions()}
        </select>
      </div>
    )
  }
}
