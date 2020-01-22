import React from 'react'
import { env, getStorage } from 'vc-cake'
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

    settingsStorage.state(`${layoutName}Template`).set(currentLayout)

    this.handleChangeUpdateLayout = this.handleChangeUpdateLayout.bind(this)
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

  handleChangeUpdateLayout (event) {
    const layoutName = this.props.layoutName.toLowerCase()
    const value = event.target.value
    this.setState({
      current: value
    })

    if (!env('VCV_JS_THEME_EDITOR')) {
      if (env('VCV_JS_THEME_LAYOUTS')) {
        settingsStorage.state(`${layoutName}Template`).set(value)
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
    const { data } = this.props
    return Object.keys(data.all).map((key, index) => (
      <option key={index} value={key}>{data.all[key]}</option>
    ))
  }

  getSelectedValue () {
    const { data } = this.props
    const current = this.state.current
    if (current === 'default' || Object.prototype.hasOwnProperty.call(data.all, current)) {
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

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const chooseHFSText = localizations ? localizations.chooseHFS : 'Choose {name} template from the list or <a href="{link}" target="_blank">create new</a>.'
    const selectHFSText = localizations ? localizations.selectHFS : 'Default'
    const noneText = localizations ? localizations.none : 'None'
    const globalUrl = `vcvCreate${this.props.layoutName}`
    const createNewUrl = window[globalUrl] ? window[globalUrl] : ''

    return (
      <div className='vcv-ui-form-group'>
        <span className='vcv-ui-form-group-heading'>{this.props.layoutName}</span>
        <select className='vcv-ui-form-dropdown' value={this.getSelectedValue()} onChange={this.handleChangeUpdateLayout}>
          <option value='default'>
            {selectHFSText}
          </option>
          <option value='none'>{noneText}</option>
          {this.getTemplateOptions()}
        </select>
        <p className='vcv-ui-form-helper' dangerouslySetInnerHTML={{ __html: chooseHFSText.replace('{name}', this.props.layoutName.toLocaleLowerCase()).replace('{link}', createNewUrl) }} />
      </div>
    )
  }
}
