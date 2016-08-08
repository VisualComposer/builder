import React from 'react'
import Attribute from '../attribute'
import './css/data.less'
import lodash from 'lodash'

class AttachImage extends Attribute {
  mediaUploader = null

  normalizeValue (props) {
    let value = props.value
    if (!lodash.isObject(value)) {
      value = { ids: [], urls: [] }
    }

    return value
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
    ids.push(attachment.id)
    urls.push(attachment.sizes.full.url)
    this.setFieldValue({
      ids: ids,
      urls: urls
    })
  }

  onMediaOpen = () => {
    let selection = this.mediaUploader.state().get('selection')
    let ids = this.state.value.ids
    ids.forEach(function (id) {
      let attachment = window.wp.media.attachment(id)
      attachment.fetch()
      if (attachment) {
        selection.add([ attachment ])
      }
    })
  }

  render () {
    let { value } = this.state
    let { fieldKey } = this.props
    let images = []
    value.urls.forEach(function (url) {
      images.push(<li key={fieldKey + '-li-:' + url}><img key={fieldKey + '-li-img-:' + url} src={url}
        className='thumbnail' /></li>)
    })

    return (
      <div className='vcv-ui-form-attach-image'>
        <ul className='vcv-ui-form-attach-images'>
          {images}
        </ul>
        <a className='vcv-ui-icon vcv-ui-icon-add-thin vcv-ui-form-attach-image-control' onClick={this.openLibrary} />
      </div>
    )
  }
}
AttachImage.propTypes = {
  value: React.PropTypes.oneOfType([ React.PropTypes.string, React.PropTypes.object ]).isRequired,
  fieldKey: React.PropTypes.string.isRequired
}

export default AttachImage
