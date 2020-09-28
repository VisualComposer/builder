import React from 'react'
import HubElementControl from './hubItems/hubElementControl'
import HubTemplateControl from './hubItems/hubTemplateControl'
import HubAddonControl from './hubItems/hubAddonControl'
import ElementControl from '../addElement/lib/elementControl'
import { getStorage } from 'vc-cake'

const notificationsStorage = getStorage('notifications')
const workspaceStorage = getStorage('workspace')

export default class HubItemController extends ElementControl {
  constructor (props) {
    super(props)

    let isDownloading = false
    const downloadingItems = workspaceStorage.state('downloadingItems').get() || []
    if (downloadingItems.includes(props.tag)) {
      isDownloading = true
    }

    this.state = {
      isDownloading,
      isNew: true,
      isShown: true
    }

    this.downloadingItemOnChange = this.downloadingItemOnChange.bind(this)
    this.handleDownloadItem = this.handleDownloadItem.bind(this)
  }

  componentDidMount () {
    if (this.state.isDownloading) {
      workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    }

    this.ellipsize('.vcv-ui-item-element-name')
    this.ellipsize('.vcv-ui-item-preview-text')
  }

  componentWillUnmount () {
    workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
  }

  downloadingItemOnChange (data) {
    const { tag } = this.props
    let isDownloading = true
    if (!data.includes(tag)) {
      isDownloading = tag && false
      this.setState({ isDownloading })
      workspaceStorage.state('downloadingItems').ignoreChange(this.downloadingItemOnChange)
    }
  }

  handleDownloadItem (errorMessage) {
    const { element } = this.props
    if (!element.allowDownload || !window.vcvIsAnyActivated) {
      return false
    }

    if (element.update) {
      notificationsStorage.trigger('add', {
        type: 'error',
        text: errorMessage,
        showCloseButton: 'true',
        icon: 'vcv-ui-icon vcv-ui-icon-error',
        time: 5000
      })
      return false
    }
    this.setState({ isDownloading: true })
    workspaceStorage.state('downloadingItems').onChange(this.downloadingItemOnChange)
    return true
  }

  render () {
    const { type } = this.props
    const { isNew, isShown } = this.state
    let ControlElement = null
    if (type === 'element') {
      ControlElement = HubElementControl
    } else if (type === 'template') {
      ControlElement = HubTemplateControl
    } else if (type === 'addon') {
      ControlElement = HubAddonControl
    }

    return (
      <ControlElement
        {...this.props}
        isDownloading={this.state.isDownloading}
        onDownloadItem={this.handleDownloadItem}
        isNew={isNew}
        isShown={isShown}
      />
    )
  }
}
