import React from 'react'
import Attribute from '../attribute'
import lodash from 'lodash'
import Url from '../url/Component'

class AttachImage extends Attribute {

  constructor (props) {
    super(props)
    this.mediaUploader = null
    this.handleRemove = this.handleRemove.bind(this)
    this.handleUrlChange = this.handleUrlChange.bind(this)
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

  openLibrary = () => {
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
      multiple: !!this.props.options.multiple
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
    let fieldValue = ids.length ? {
      ids: ids,
      urls: urls
    } : this.props.defaultValue ? this.props.defaultValue : { ids: [], urls: [] }
    this.setFieldValue(fieldValue)
  }

  onMediaSelect = () => {
    let selection
    selection = this.mediaUploader.state().get('selection')
    this.setFieldValue({ ids: [], urls: [] })
    selection.map(this.mediaAttachmentParse)
  }

  mediaAttachmentParse = (attachment) => {
    attachment = attachment.toJSON()
    let ids = lodash.compact(this.state.value.ids)
    let urls = lodash.compact(this.state.value.urls)
    let defaultLinkValue = {
      relNofollow: false,
      targetBlank: true,
      title: '',
      url: ''
    }
    ids.push(attachment.id)
    let srcUrl = {}
    for (let size in attachment.sizes) {
      srcUrl[ size ] = attachment.sizes[ size ].url
    }
    srcUrl.id = attachment.id
    srcUrl.link = defaultLinkValue
    srcUrl.title = attachment.title
    srcUrl.alt = attachment.alt
    urls.push(srcUrl)
    this.setFieldValue({
      ids: ids,
      urls: urls
    })
  }

  handleUrlChange (key, fieldKey, urlValue) {
    this.state.value.urls[ key ].link = urlValue
    this.updateFieldValue()
  }

  updateFieldValue (value) {
    let mergedValue = lodash.merge(this.state.value, value)
    this.setFieldValue(mergedValue)
  }

  onMediaOpen = () => {
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

    let imageUrl = () => ''
    if (this.props.options.url) {
      imageUrl = (key) => (
        <Url
          value={this.state.value.urls[ key ].link}
          updater={this.handleUrlChange.bind(this, key)}
          api={this.props.api}
          fieldKey={`${this.props.fieldKey}.linkUrl`}
        />
      )
    }

    value && value.urls && value.urls.forEach((url, key) => {
      value.ids[ key ] && images.push(
        <li className='vcv-ui-form-attach-image-item' key={fieldKey + '-li-:' + url.full}>
          <div className='vcv-ui-form-attach-image-item-inner'>
            <figure className='vcv-ui-form-attach-image-thumbnail'>
              <img key={fieldKey + '-li-img-:' + url.full} src={url.thumbnail || url.full} />
            </figure>
            <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
              {oneMoreControl}
              <a className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
                onClick={this.handleRemove.bind(this, key)}>
                <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
              </a>
            </div>
          </div>
          {imageUrl(key)}
        </li>
      )
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
