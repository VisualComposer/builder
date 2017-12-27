import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Url from '../url/Component'
import AttachImageList from './attachImageList'
import {SortableContainer, arrayMove} from 'react-sortable-hoc'

const SortableList = SortableContainer((props) => {
  return (
    <AttachImageList {...props} />
  )
})

export default class AttachImage extends Attribute {
  static propTypes = {
    value: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.object, React.PropTypes.array ]).isRequired,
    fieldKey: React.PropTypes.string.isRequired
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

  componentWillMount () {
    // Create the media uploader.
    if (typeof window.wp === 'undefined') {
      return false
    }
    this.mediaUploader = window.wp.media({
      title: 'Add images',
      // Tell the modal to show only images.
      library: {
        type: 'image',
        query: false
      },
      button: {
        text: 'Add image'
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
        let urls = []
        value.forEach((url) => {
          urls.push({ full: url })
        })
        value = { ids: [ null ], urls: urls }
      } else {
        value = { ids: [], urls: [] }
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
    let fieldValue = {
      ids: ids,
      urls: urls
    }
    this.setFieldValue(fieldValue)
  }

  onMediaSelect () {
    let selection = this.mediaUploader.state().get('selection')
    this.setFieldValue(this.parseSelection(selection))
  }

  parseSelection (selection) {
    let defaultLinkValue = {
      relNofollow: false,
      targetBlank: true,
      title: '',
      url: ''
    }
    let ids = []
    let urls = []
    selection.forEach((attachment, index) => {
      let attachmentData = this.mediaAttachmentParse(attachment)
      let url = Object.assign({}, attachmentData.url)
      ids.push(attachmentData.id)

      url.link = defaultLinkValue
      if (this.state.value.urls && typeof this.state.value.urls[ index ] !== 'undefined' && typeof this.state.value.urls[ index ].link !== 'undefined') {
        url.link = this.state.value.urls[ index ].link
      }
      urls.push(url)
    })

    return {
      ids: ids,
      urls: urls
    }
  }

  mediaAttachmentParse (attachment) {
    attachment = attachment.toJSON()
    let srcUrl = {}
    for (let size in attachment.sizes) {
      srcUrl[ size ] = attachment.sizes[ size ].url
    }
    srcUrl.id = attachment.id
    srcUrl.title = attachment.title
    srcUrl.alt = attachment.alt
    srcUrl.caption = attachment.caption

    return {
      id: attachment.id,
      url: srcUrl
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
      let urlValue = this.state.value.urls[ key ].link || ''
      urlHtml = (
        <Url
          value={urlValue}
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
    this.setFieldValue(sortedValue)
  }

  render () {
    let useDragHandle = true
    let dragClass = 'vcv-ui-form-attach-image-item--dragging'
    let metaAssetsPath = this.props.element && this.props.element.data && this.props.element.data.metaAssetsPath
    return (
      <div className='vcv-ui-form-attach-image'>
        <SortableList {...this.props} metaAssetsPath={metaAssetsPath} helperClass={dragClass} useDragHandle={useDragHandle} onSortEnd={this.onSortEnd}
          axis='xy' value={this.state.value} openLibrary={this.openLibrary} handleRemove={this.handleRemove}
          getUrlHtml={this.getUrlHtml} />
      </div>
    )
  }
}
