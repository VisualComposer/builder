import React from 'react'
import HubElementControl from './hubItems/hubElementControl'
import HubTemplateControl from './hubItems/hubTemplateControl'
import HubAddonControl from './hubItems/hubAddonControl'
import ElementControl from '../addElement/lib/elementControl'
import { getStorage, getService } from 'vc-cake'
import store from 'public/editor/stores/store'
import { notificationAdded } from 'public/editor/stores/notifications/slice'

const workspaceStorage = getStorage('workspace')
const roleManager = getService('roleManager')

export default class HubItemController extends ElementControl {
  constructor (props) {
    super(props)

    let isDownloading = false
    const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
    if (downloadingItems.includes(props.tag)) {
      isDownloading = true
    }

    this.state = {
      isDownloading
    }

    this.downloadingItemOnChange = this.downloadingItemOnChange.bind(this)
    this.handleDownloadItem = this.handleDownloadItem.bind(this)
  }

  componentDidMount () {
    workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
  }

  componentWillUnmount () {
    workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
  }

  downloadingItemOnChange (data) {
    const { tag } = this.props
    if (this.state.isDownloading && !data.includes(tag)) {
      this.setState({ isDownloading: false })
      workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
    } else if (!this.state.isDownloading && data.includes(tag)) {
      this.setState({ isDownloading: true })
    }
  }

  handleDownloadItem (errorMessage) {
    const { element } = this.props
    if (!element.allowDownload) {
      return false
    }

    if (element.update) {
      store.dispatch(notificationAdded({
        type: 'error',
        text: errorMessage,
        showCloseButton: 'true',
        time: 5000
      }))
      return false
    }
    this.setState({ isDownloading: true })
    workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    return true
  }

  render () {
    const { type, element } = this.props
    let ControlElement = null
    const customProps = {}
    if (type === 'element') {
      ControlElement = HubElementControl
      customProps.isAllowedForThisRole = roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())
    } else if (type === 'template') {
      if (element.templateType === 'hubHeader' || element.templateType === 'hubFooter' || element.templateType === 'hubSidebar') {
        customProps.isAllowedForThisRole = roleManager.can('hub_headers_footers_sidebars', roleManager.defaultTrue())
      } else {
        customProps.isAllowedForThisRole = roleManager.can('hub_elements_templates_blocks', roleManager.defaultTrue())
      }
      ControlElement = HubTemplateControl
    } else if (type === 'addon') {
      ControlElement = HubAddonControl
      customProps.isAllowedForThisRole = roleManager.can('hub_addons', roleManager.defaultTrue())
    }

    return (
      <ControlElement
        {...this.props}
        isDownloading={this.state.isDownloading}
        onDownloadItem={this.handleDownloadItem}
        {...customProps}
      />
    )
  }
}
