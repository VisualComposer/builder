import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Url from '../url/Component'
import AttachVideoList from './attachVideoList'
import { SortableContainer, arrayMove } from 'react-sortable-hoc'
import PropTypes from 'prop-types'

const SortableList = SortableContainer((props) => {
  return (
    <AttachVideoList {...props} />
  )
})

class AttachVideo extends Attribute {
  static defaultProps = {
    fieldType: 'attachvideo'
  }

  constructor (props) {
    super(props)
    this.mediaUploader = null
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.onMediaSelect = this.onMediaSelect.bind(this)
    this.onMediaOpen = this.onMediaOpen.bind(this)
    this.openLibrary = this.openLibrary.bind(this)
    this.getUrlHtml = this.getUrlHtml.bind(this)
    this.onSortEnd = this.onSortEnd.bind(this)
  }

  UNSAFE_componentWillMount () {
    // Create the media uploader.
    if (typeof window.wp === 'undefined') {
      return false
    }
    this.mediaUploader = window.wp.media({
      title: 'Add video',
      // Tell the modal to show only images.
      library: {
        type: 'video',
        query: false
      },
      button: {
        text: 'Add video'
      },
      multiple: this.props.options.multiple ? 'add' : false
    })
    // Create a callback when the uploader is called
    this.mediaUploader.on('select', this.onMediaSelect)
    this.mediaUploader.on('open', this.onMediaOpen)
  }

  updateState (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = value ? { ids: [ null ], urls: [ { full: value } ] } : { ids: [], urls: [] }
    } else if (lodash.isArray(value)) {
      if (value.length > 0) {
        let ids = []
        let urls = []
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
          ids: [ value.id ],
          urls: [ value ]
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
    this.mediaUploader.open()
  }

  handleRemove (key) {
    let ids = this.state.value.ids
    let urls = this.state.value.urls
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
    let selection = this.mediaUploader.state().get('selection')
    this.setFieldValue(this.parseSelection(selection))
  }

  parseSelection (selection) {
    let ids = []
    let urls = []
    let icons = []
    selection.models.forEach((attachment, index) => {
      let attachmentData = this.mediaAttachmentParse(attachment)
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
    let srcUrl = {}
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
    let stateValue = this.state.value
    stateValue.urls[ key ].link = urlValue
    this.updateFieldValue(stateValue)
  }

  updateFieldValue (value) {
    let mergedValue = lodash.merge(this.state.value, value)
    this.setFieldValue(mergedValue)
  }

  onMediaOpen () {
    let selection = this.mediaUploader.state().get('selection')
    let ids = this.state.value.ids
    ids && ids.forEach(function (id) {
      if (id) {
        let attachment = window.wp.media.attachment(id)
        attachment.fetch()
        if (attachment) {
          selection.add([ attachment ])
        }
      }
    })
  }

  getUrlHtml (key) {
    let urlHtml = ''
    if (this.props.options.url) {
      urlHtml = (
        <Url
          value={this.state.value.urls[ key ].link}
          updater={this.handleUrlChange.bind(this, key)}
          api={this.props.api}
          fieldKey={`${this.props.fieldKey}.linkUrl`}
        />
      )
    }
    return urlHtml
  }

  onSortEnd ({ oldIndex, newIndex }) {
    let prevState = Object.assign({}, this.state.value)
    let sortedValue = {}
    sortedValue.urls = arrayMove(prevState.urls, oldIndex, newIndex)
    sortedValue.ids = arrayMove(prevState.ids, oldIndex, newIndex)
    sortedValue.icons = arrayMove(prevState.icons, oldIndex, newIndex)
    this.setFieldValue(sortedValue)
  }

  render () {
    let useDragHandle = true
    let dragClass = 'vcv-ui-form-attach-image-item--dragging'

    return (
      <div className='vcv-ui-form-attach-image'>
        <SortableList {...this.props} helperClass={dragClass} useDragHandle={useDragHandle} onSortEnd={this.onSortEnd}
          axis='xy' value={this.state.value} openLibrary={this.openLibrary} handleRemove={this.handleRemove}
          getUrlHtml={this.getUrlHtml} mediaLibrary={this.mediaUploader} />
      </div>
    )
  }
}

AttachVideo.propTypes = {
  value: PropTypes.oneOfType([ PropTypes.string, PropTypes.object, PropTypes.array ]).isRequired,
  fieldKey: PropTypes.string.isRequired
}

export default AttachVideo
