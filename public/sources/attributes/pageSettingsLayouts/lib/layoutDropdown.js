import React from 'react'
import { env, getStorage, getService } from 'vc-cake'
import PropTypes from 'prop-types'
import { getResponse } from 'public/tools/response'

const Utils = getService('utils')
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
      'vcv-nonce': window.vcvNonce
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
      if (typeof window.VCV_EDITOR_TYPE !== 'undefined' && window.VCV_EDITOR_TYPE() === 'vcv_layouts') {
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
  }

  getDefaultOptions () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    let selectHFSText = localizations ? localizations.selectHFS : 'Default'
    const templateStorageData = settingsStorage.state('pageTemplate').get() || (window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT && window.VCV_PAGE_TEMPLATES_LAYOUTS_CURRENT()) || {
      type: 'vc', value: 'blank'
    }

    if (templateStorageData.type === 'vc-custom-layout') {
      selectHFSText = localizations ? localizations.selectHFSGlobal : 'Global Default'
      const selectHFSLayoutText = localizations ? localizations.selectHFSLayout : 'Layout Default'

      return ([
        <option value='defaultGlobal' key='defaultGlobal'>{selectHFSText}</option>,
        <option value='defaultLayout' key='defaultLayout'>{selectHFSLayoutText}</option>
      ])
    } else {
      return <option value='default'>{selectHFSText}</option>
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const chooseHFSText = localizations ? localizations.chooseHFS : 'Choose a {name} template from the list or <a href="{link}" target="_blank">create a new one</a>.'
    const noneText = localizations ? localizations.none : 'None'
    const globalUrl = `vcvCreate${this.props.layoutName}`
    const createNewUrl = window[globalUrl] ? window[globalUrl] : ''

    let spinnerHtml = null
    if (this.state.isListLoading) {
      spinnerHtml = (
        <span className='vcv-ui-wp-spinner' />
      )
    }

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>
          {this.props.layoutName}
          {spinnerHtml}
        </span>
        <select className='vcv-ui-form-dropdown' value={this.getSelectedValue()} onChange={this.handleChangeUpdateLayout} onClick={this.handleUpdateList}>
          {this.props.layoutName !== 'Sidebar' ? this.getDefaultOptions() : null}
          <option value='none'>{noneText}</option>
          {this.getTemplateOptions()}
        </select>
        <p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: chooseHFSText.replace('{name}', this.props.layoutName.toLocaleLowerCase()).replace('{link}', createNewUrl) }} />
      </div>
    )
  }
}
