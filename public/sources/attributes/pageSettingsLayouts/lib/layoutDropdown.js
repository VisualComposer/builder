import React from 'react'
import { env, getStorage, getService } from 'vc-cake'
import PropTypes from 'prop-types'
import { getResponse } from 'public/tools/response'

const Utils = getService('utils')
const workspaceStorage = getStorage('workspace')
const workspaceIFrame = workspaceStorage.state('iframe')
const settingsStorage = getStorage('settings')
const dataManager = getService('dataManager')
const roleManager = getService('roleManager')

export default class LayoutDropdown extends React.Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    layoutName: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    const layoutName = props.layoutName.toLowerCase()
    const currentLayout = settingsStorage.state(`${layoutName}Template`).get() || props.data.current || (this.getDefaultOptions() ? 'default' : 'none')

    this.state = {
      data: props.data,
      isListLoading: false,
      current: currentLayout
    }

    settingsStorage.state(`${layoutName}Template`).set(currentLayout)

    this.handleChangeUpdateLayout = this.handleChangeUpdateLayout.bind(this)
    this.handleUpdateList = this.handleUpdateList.bind(this)
    this.getTemplateOptions = this.getTemplateOptions.bind(this)
  }

  static getDerivedStateFromProps (props, state) {
    const layoutName = props.layoutName.toLowerCase()
    const storageStateLayout = settingsStorage.state(`${layoutName}Template`).get()
    if (storageStateLayout !== state.current) {
      return {
        current: storageStateLayout
      }
    }
    return null
  }

  handleUpdateList () {
    const layoutName = this.props.layoutName.toLowerCase()
    this.setState({ isListLoading: true })

    const ajax = Utils.ajax
    if (this.serverRequest) {
      this.serverRequest.abort()
    }

    this.serverRequest = ajax({
      'vcv-action': 'layoutDropdown:' + layoutName + ':updateList:adminNonce',
      'vcv-nonce': dataManager.get('nonce')
    }, (request) => {
      const response = getResponse(request.response)
      if (response && response.status) {
        this.setState({ data: response.data, isListLoading: false })
      } else {
        this.setState({ isListLoading: false })
      }
    })
  }

  handleChangeUpdateLayout (event) {
    const layoutName = this.props.layoutName.toLowerCase()
    let value = event.target.value
    const defaultValues = ['default', 'defaultGlobal', 'defaultLayout']
    if (value !== 'none' && !defaultValues.includes(value)) {
      value = parseInt(value)
    }
    this.setState({
      current: value
    })

    if (!env('VCV_JS_THEME_EDITOR')) {
      if (env('VCV_JS_THEME_LAYOUTS')) {
        settingsStorage.state(`${layoutName}Template`).set(value)
      }
      const editorType = dataManager.get('editorType')
      if (editorType === 'vcv_layouts') {
        return
      }
      const lastSavedTemplate = settingsStorage.state(`${layoutName}Template`).get()
      const lastSavedPageTemplate = settingsStorage.state('pageTemplate').get()
      const lastSavedHeaderTemplate = settingsStorage.state('headerTemplate').get()
      const lastSavedSidebarTemplate = settingsStorage.state('sidebarTemplate').get()
      const lastSavedFooterTemplate = settingsStorage.state('footerTemplate').get()

      this.reloadIframe(
        lastSavedPageTemplate,
        lastSavedHeaderTemplate,
        lastSavedSidebarTemplate,
        lastSavedFooterTemplate,
        lastSavedTemplate
      )
    }
  }

  getTemplateOptions () {
    const { data } = this.state
    return Object.keys(data.all).map((key, index) => (
      <option key={index} value={key}>{data.all[key]}</option>
    ))
  }

  getSelectedValue () {
    const { data, current } = this.state
    const defaultValues = ['default', 'defaultGlobal', 'defaultLayout']
    if (defaultValues.includes(current) || Object.prototype.hasOwnProperty.call(data.all, current)) {
      return current
    }
    return 'none'
  }

  reloadIframe (lastSavedPageTemplate, lastSavedHeaderTemplate, lastSavedSidebarTemplate, lastSavedFooterTemplate, lastSavedTemplate) {
    window.vcvLastLoadedPageTemplate = lastSavedPageTemplate
    window.vcvLastLoadedHeaderTemplate = lastSavedHeaderTemplate
    window.vcvLastLoadedSidebarTemplate = lastSavedSidebarTemplate
    window.vcvLastLoadedFooterTemplate = lastSavedFooterTemplate
    const layoutName = this.props.layoutName.toLowerCase()
    window[`vcvLastLoaded${layoutName}Template`] = lastSavedTemplate

    workspaceIFrame.set({
      type: 'reload',
      template: lastSavedPageTemplate,
      header: lastSavedHeaderTemplate,
      sidebar: lastSavedSidebarTemplate,
      footer: lastSavedFooterTemplate,
      [layoutName]: lastSavedTemplate
    })
    settingsStorage.state('skipBlank').set(true)
  }

  getDefaultOptions () {
    if (this.props.layoutName === 'Sidebar') {
      return null
    }
    const localizations = dataManager.get('localizations')
    const selectHFSText = localizations ? localizations.selectHFS : 'Default'

    return <option value='default'>{selectHFSText}</option>
  }

  getHFSText () {
    const selectedValue = this.getSelectedValue()
    const layoutName = this.props.layoutName
    const localizations = dataManager.get('localizations')
    const globalUrl = `vcvCreate${this.props.layoutName}`
    const createNewUrl = window[globalUrl] ? window[globalUrl] : ''
    const noneText = localizations ? localizations.createHFS : '<a href="{link}" target="_blank">Create</a> a new {name} template.'
    const chooseHFSText = localizations ? localizations.editHFSTemplate : '<a href="{editLink}" target="_blank">Edit</a> this {name} template or <a href="{createLink}" target="_blank">create</a> a new one.'
    let text = ''

    if (typeof selectedValue !== 'number') {
      text = noneText.replace('{name}', layoutName.toLocaleLowerCase()).replace('{link}', createNewUrl)
    } else {
      let editLink = window && window.vcvWpAdminUrl ? window.vcvWpAdminUrl : ''
      editLink += `post.php?post=${selectedValue}&action=edit`
      text = chooseHFSText.replace('{name}', layoutName.toLocaleLowerCase()).replace('{editLink}', editLink).replace('{createLink}', createNewUrl)
    }

    return text
  }

  render () {
    const localizations = dataManager.get('localizations')
    const chooseHFSText = roleManager.can('dashboard_addon_theme_builder', roleManager.defaultTrue()) ? this.getHFSText() : ''
    const noneText = localizations ? localizations.none : 'None'

    let spinnerHtml = null
    if (this.state.isListLoading) {
      spinnerHtml = (
        <span className='vcv-ui-wp-spinner' />
      )
    }

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading-wrapper'>
          {this.props.layoutName}
          {spinnerHtml}
        </span>
        <select className='vcv-ui-form-dropdown' value={this.getSelectedValue()} onChange={this.handleChangeUpdateLayout} onClick={this.handleUpdateList}>
          {this.getDefaultOptions()}
          <option value='none'>{noneText}</option>
          {this.getTemplateOptions()}
        </select>
        <p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: chooseHFSText }} />
      </div>
    )
  }
}
