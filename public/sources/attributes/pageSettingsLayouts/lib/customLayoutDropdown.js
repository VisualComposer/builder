import React from 'react'
import { getService, env } from 'vc-cake'
import { getResponse } from 'public/tools/response'

const dataManager = getService('dataManager')
const roleManager = getService('roleManager')
const utils = getService('utils')
const localizations = dataManager.get('localizations')
const themeBuilder = env('VCV_FT_JS_THEME_BUILDER_CUSTOM_LAYOUTS')

export default class CustomLayoutDropdown extends React.Component {
  constructor (props) {
    super(props)
    // since v41 we merging theme options and layout options
    const allLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS && window.VCV_PAGE_TEMPLATES_LAYOUTS()
    const themeLayouts = window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME && window.VCV_PAGE_TEMPLATES_LAYOUTS_THEME()
    const customLayouts = allLayouts.find(item => item.type === 'vc-custom-layout')
    this.state = {
      isListLoading: false,
      themeLayouts: themeLayouts,
      customLayouts: customLayouts
    }

    this.handleChangeUpdateLayout = this.handleChangeUpdateLayout.bind(this)
    this.getLayoutOptions = this.getLayoutOptions.bind(this)
    this.handleUpdateList = this.handleUpdateList.bind(this)
  }

  handleChangeUpdateLayout (event) {
    const value = event.target.value
    const prefix = this.props?.options?.find(item => item.value === value)?.prefix || 'vc-custom-layout__'
    this.props.onTemplateChange(`${prefix}${value}`)
  }

  getLayoutOptions () {
    let options = []
    if (this.state.themeLayouts && this.state.themeLayouts.values) {
      options = options.concat(this.state.themeLayouts.values.map((item) => (
        <option key={`theme-layout-template-${item.value}`} value={item.value}>{item.label}</option>
      )))
    }
    if (this.state.customLayouts && this.state.customLayouts.values) {
      options = options.concat(this.state.customLayouts.values.map((item) => (
        <option key={`custom-layout-template-${item.value}`} value={item.value}>{item.label}</option>
      )))
    }
    if (this.props?.options?.length) {
      const hfsLayouts = this.props.options.map((item) => {
        return <option key={`hfs-layout-template-${item.value}`} value={item.value}>{item.label}</option>
      })
      options = (<>
        <optgroup label='Header, Footer, Sidebar'>{hfsLayouts}</optgroup>
        <optgroup label='Layouts'>{options}</optgroup>
      </>)
    }

    return options
  }

  handleUpdateList () {
    if (!themeBuilder) {
      return null
    }
    this.setState({ isListLoading: true })

    const ajax = utils.ajax
    if (this.serverRequest) {
      this.serverRequest.abort()
    }

    this.serverRequest = ajax({
      'vcv-action': 'layoutDropdown:vc-custom-layout:updateList:adminNonce',
      'vcv-nonce': dataManager.get('nonce')
    }, (request) => {
      const response = getResponse(request.response)
      if (response && response.status) {
        const currentCustomLayouts = this.state.customLayouts || {}
        currentCustomLayouts.values = response.data
        this.setState({ customLayouts: currentCustomLayouts, isListLoading: false })
      } else {
        this.setState({ isListLoading: false })
      }
    })
  }

  getLayoutText () {
    if (!themeBuilder) {
      return null
    }
    const selectedValue = this.props.current?.value || ''
    const globalUrl = 'vcvCreatevcv_layouts'
    const createNewUrl = window[globalUrl] ? window[globalUrl] : ''
    const createLayoutText = localizations ? localizations.createLayout : '<a href="{link}" target="_blank">Create</a> a new layout.'
    const editLayoutText = localizations ? localizations.editLayout : '<a href="{editLink}" target="_blank">Edit</a> this layout or <a href="{createLink}" target="_blank">create</a> a new one.'

    let text
    if (typeof selectedValue !== 'number') {
      text = createLayoutText.replace('{link}', createNewUrl)
    } else {
      let editLink = window && window.vcvWpAdminUrl ? window.vcvWpAdminUrl : ''
      editLink += `post.php?post=${selectedValue}&action=edit`
      text = editLayoutText.replace('{editLink}', editLink).replace('{createLink}', createNewUrl)
    }

    return text
  }

  render () {
    const chooseLayoutText = roleManager.can('dashboard_addon_theme_builder', roleManager.defaultTrue()) ? this.getLayoutText() : ''
    let spinnerHtml = null
    if (this.state.isListLoading) {
      spinnerHtml = (
        <span className='vcv-ui-wp-spinner' />
      )
    }

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading-wrapper'>
          Choose layout
          {spinnerHtml}
        </span>
        <select
          className='vcv-ui-form-dropdown'
          value={this.props.current.value}
          onChange={this.handleChangeUpdateLayout}
          onClick={this.handleUpdateList}
        >
          <option value='default'>
            Default
          </option>
          {this.getLayoutOptions()}
        </select>
        <p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: chooseLayoutText }} />
      </div>
    )
  }
}
