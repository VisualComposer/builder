import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Url from '../url/Component'
import AttachVideoList from './attachVideoList'
import { SortableContainer, arrayMove } from 'react-sortable-hoc'
import PropTypes from 'prop-types'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspace')
const SortableList = SortableContainer((props) => {
  return (
    <AttachVideoList {...props} />
  )
})

export default class AttachVideo extends Attribute {
  static defaultProps = {
    fieldType: 'attachvideo'
  }

  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]).isRequired,
    fieldKey: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.mediaUploader = null
    this.uploadFileList = []
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.onMediaSelect = this.onMediaSelect.bind(this)
    this.onMediaOpen = this.onMediaOpen.bind(this)
    this.onMediaClose = this.onMediaClose.bind(this)
    this.closeMediaPopup = this.closeMediaPopup.bind(this)
    this.openLibrary = this.openLibrary.bind(this)
    this.getUrlHtml = this.getUrlHtml.bind(this)
    this.handleSortEnd = this.handleSortEnd.bind(this)
    this.handleDrop = this.handleDrop.bind(this)
    this.handleUploadFiles = this.handleUploadFiles.bind(this)

    this.initMediaGlobals()
  }

  componentDidMount () {
    // Create the media uploader.
    if (typeof window.wp === 'undefined') {
      return false
    }
    this.mediaUploader = window.wp.media({
      title: 'Add video',
      // Tell the modal to show only videos.
      library: {
        type: 'video',
        query: false
      },
      multiple: this.props.options.multiple ? 'add' : false
    })
    // Create a callback when the uploader is called
    this.mediaUploader.on('select', this.onMediaSelect)
    this.mediaUploader.on('open', this.onMediaOpen)
    this.mediaUploader.on('close', this.onMediaClose)
    document.addEventListener('keyup', this.closeMediaPopup)
  }

  componentWillUnmount () {
    document.removeEventListener('keyup', this.closeMediaPopup)
  }

  updateState (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = value ? { ids: [null], urls: [{ full: value }] } : { ids: [], urls: [] }
    } else if (lodash.isArray(value)) {
      if (value.length > 0) {
        const ids = []
        const urls = []
        value.forEach((url) => {
          ids.push(url.id)
          if (url.full) {
            urls.push(url)
          } else {
            urls.push({ full: url })
          }
        })
        value = { ids: ids, urls: urls }
      } else {
        value = { ids: [], urls: [] }
      }
    } else {
      if (!value.ids && !value.urls && value.id) {
        value = {
          ids: [value.id],
          urls: [value]
        }
      }
    }

    return {
      value: value
    }
  }

  openLibrary () {
    if (!this.mediaUploader) {
      throw new Error('Media uploader not found. Make sure you are running this on WordPress.')
    }
    this.mediaUploaderOpen = this.mediaUploader.open()
  }

  handleRemove (key) {
    const ids = this.state.value.ids
    const urls = this.state.value.urls
    ids.splice(key, 1)
    urls.splice(key, 1)
    let fieldValue = { ids: [], urls: [] }
    if (ids.length) {
      fieldValue = {
        ids: ids,
        urls: urls
      }
    } else if (this.props.defaultValue) {
      fieldValue = this.props.defaultValue
    }

    this.setFieldValue(fieldValue)
  }

  onMediaSelect () {
    const selection = this.mediaUploader.state().get('selection')
    this.setFieldValue(this.parseSelection(selection))
  }

  parseSelection (selection) {
    const ids = []
    const urls = []
    const icons = []
    selection.models.forEach((attachment, index) => {
      const attachmentData = this.mediaAttachmentParse(attachment)
      // let url = Object.assign({}, attachmentData.url)
      ids.push(attachmentData.id)
      urls.push(attachmentData.url)
      icons.push(attachmentData.icon)
    })

    return {
      ids: ids,
      urls: urls,
      icons: icons
    }
  }

  mediaAttachmentParse (attachment) {
    attachment = attachment.toJSON()
    const srcUrl = {}
    srcUrl.id = attachment.id
    srcUrl.title = attachment.title
    srcUrl.alt = attachment.alt
    srcUrl.url = attachment.url

    return {
      id: attachment.id,
      url: srcUrl,
      icon: attachment.icon
    }
  }

  handleUrlChange (key, fieldKey, urlValue) {
    const stateValue = this.state.value
    stateValue.urls[key].link = urlValue
    this.updateFieldValue(stateValue)
  }

  updateFieldValue (value) {
    const mergedValue = lodash.merge(this.state.value, value)
    this.setFieldValue(mergedValue)
  }

  onMediaOpen () {
    const selection = this.mediaUploader.state().get('selection')
    const ids = this.state.value.ids
    ids && ids.forEach(function (id) {
      if (id) {
        const attachment = window.wp.media.attachment(id)
        attachment.fetch()
        if (attachment) {
          selection.add([attachment])
        }
      }
    })
    workspaceStorage.state('hasModal').set(true)
  }

  onMediaClose () {
    setTimeout(() =>
      workspaceStorage.state('hasModal').set(false)
    , 100)
  }

  closeMediaPopup (e) {
    if (e?.which === 27) {
      this.mediaUploader.close()
    }
  }

  getUrlHtml (key) {
    let urlHtml = ''
    if (this.props.options.url) {
      urlHtml = (
        <Url
          value={this.state.value.urls[key].link}
          updater={this.handleUrlChange.bind(this, key)}
          api={this.props.api}
          fieldKey={`${this.props.fieldKey}.linkUrl`}
        />
      )
    }
    return urlHtml
  }

  handleSortEnd ({ oldIndex, newIndex }) {
    const prevState = Object.assign({}, this.state.value)
    const sortedValue = {}
    sortedValue.urls = arrayMove(prevState.urls, oldIndex, newIndex)
    sortedValue.ids = arrayMove(prevState.ids, oldIndex, newIndex)
    sortedValue.icons = arrayMove(prevState.icons, oldIndex, newIndex)
    this.setFieldValue(sortedValue)
  }

  handleDrop (event) {
    event.stopPropagation()
    event.preventDefault()
    this.uploadFileList = event.dataTransfer.files
    this.mediaUploader.on('open', this.handleUploadFiles)
    this.openLibrary()
  }

  handleUploadFiles () {
    window.setTimeout(() => {
      if (this.mediaUploaderOpen && this.mediaUploaderOpen.uploader && this.mediaUploaderOpen.uploader.uploader) {
        this.mediaUploaderOpen.uploader.uploader.uploader.addFile(lodash.toArray(this.uploadFileList))
      }
      this.uploadFileList = []
      this.mediaUploader.off('open', this.handleUploadFiles)
    }, 200)
  }

  render () {
    const useDragHandle = true
    const dragClass = 'vcv-ui-form-attach-image-item--dragging'

    return (
      <div className='vcv-ui-form-attach-image'>
        <SortableList
          {...this.props}
          helperClass={dragClass}
          useDragHandle={useDragHandle}
          onSortEnd={this.handleSortEnd}
          axis='xy'
          value={this.state.value}
          openLibrary={this.openLibrary}
          onRemove={this.handleRemove}
          getUrlHtml={this.getUrlHtml}
          mediaLibrary={this.mediaUploader}
          onHandleDrop={this.handleDrop}
        />
      </div>
    )
  }
}
