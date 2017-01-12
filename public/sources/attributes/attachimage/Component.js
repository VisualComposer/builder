import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Url from '../url/Component'
import AttachImageItem from './attachImageItem'
import {sortable} from 'react-sortable'

let SortableImageItem = sortable(AttachImageItem)

class AttachImage extends Attribute {

  constructor (props) {
    super(props)
    this.mediaUploader = null
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
    this.updateSortable = this.updateSortable.bind(this)
    this.onMediaSelect = this.onMediaSelect.bind(this)
    this.onMediaOpen = this.onMediaOpen.bind(this)
    this.openLibrary = this.openLibrary.bind(this)
    this.getUrlHtml = this.getUrlHtml.bind(this)
    this.state.value.draggingIndex = null
  }

  updateSortable (obj) {
    let sortedValue = {
      draggingIndex: obj.draggingIndex
    }
    if (obj.items) {
      sortedValue.ids = []
      sortedValue.urls = obj.items
      obj.items.forEach((item) => {
        sortedValue.ids.push(item.id)
      })
    }
    this.updateFieldValue(sortedValue)
  }

  updateState (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = value ? { ids: [ null ], urls: [ { full: value } ] } : { ids: [], urls: [] }
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

  render () {
    let { value } = this.state
    let { fieldKey } = this.props
    let images = []

    let oneMoreControl = ''
    if (this.props.options.multiple) {
      oneMoreControl = (
        <a className='vcv-ui-form-attach-image-item-control'>
          <i className='vcv-ui-icon vcv-ui-icon-move' />
        </a>
      )
    } else {
      oneMoreControl = (
        <a className='vcv-ui-form-attach-image-item-control' onClick={this.openLibrary}>
          <i className='vcv-ui-icon vcv-ui-icon-edit' />
        </a>
      )
    }

    value && value.urls && value.urls.forEach((url, key) => {
      let innerChildProps = {
        key: key,
        fieldKey: fieldKey,
        url: url,
        oneMoreControl: oneMoreControl,
        handleRemove: this.handleRemove,
        getUrlHtml: this.getUrlHtml
      }

      if (this.props.options.multiple) {
        let childProps = {
          childProps: innerChildProps
        }

        value.ids[ key ] && images.push(
          <SortableImageItem
            key={`sortable-attach-image-item-${fieldKey}-${key}`}
            updateState={this.updateSortable}
            items={value.urls}
            draggingIndex={this.state.value.draggingIndex}
            sortId={key}
            outline='grid'
            childProps={childProps}
          />
        )
      } else {
        value.ids[ key ] && images.push(
          <AttachImageItem
            key={key}
            childProps={innerChildProps}
          />
        )
      }
    })

    let addControl = (
      <li className='vcv-ui-form-attach-image-item'>
        <a className='vcv-ui-form-attach-image-control' onClick={this.openLibrary}>
          <i className='vcv-ui-icon vcv-ui-icon-add' />
        </a>
      </li>
    )

    if (!this.props.options.multiple && value.urls && value.urls.length && value.ids[ 0 ]) {
      addControl = ''
    }

    return (
      <div className='vcv-ui-form-attach-image'>
        <ul className='vcv-ui-form-attach-image-items'>
          {images}
          {addControl}
        </ul>
      </div>
    )
  }
}
AttachImage.propTypes = {
  value: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.object, React.PropTypes.array ]).isRequired,
  fieldKey: React.PropTypes.string.isRequired
}

export default AttachImage
