/*eslint jsx-no-bind: 0 */
import React from 'react'
import Attribute from '../attribute'
import './css/data.less'
import lodash from 'lodash'

export default class Component extends Attribute {
  constructor (props) {
    super(props)
    this.mediaUploader = null
    if (!lodash.isObject(props.value)) {
      this.state.value = { ids: [], urls: [] }
    }
  }

  openLibrary () {
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
    this.mediaUploader.on('select', this.onMediaSelect.bind(this))
    this.mediaUploader.on('open', this.onMediaOpen.bind(this))
  }

  onMediaSelect () {
    var selection
    selection = this.mediaUploader.state().get('selection')
    this.setState({ value: { ids: [], urls: [] } })
    selection.map(this.mediaAttachmentParse.bind(this))
  }

  mediaAttachmentParse (attachment) {
    attachment = attachment.toJSON()
    var ids = lodash.compact(this.state.value.ids)
    var urls = lodash.compact(this.state.value.urls)
    ids.push(attachment.id)
    urls.push(attachment.sizes.full.url)
    this.setFieldValue({
      ids: ids,
      urls: urls
    })
  }

  onMediaOpen () {
    var selection = this.mediaUploader.state().get('selection')
    var ids = this.state.value.ids
    ids.forEach(function (id) {
      var attachment = window.wp.media.attachment(id)
      attachment.fetch()
      if (attachment) {
        selection.add([ attachment ])
      }
    })
  }

  render () {
    let { value } = this.state
    let { fieldKey } = this.props
    var images = []
    value.urls.forEach(function (url) {
      images.push(<img key={fieldKey + ':' + url} src={url} className='thumbnail' />)
    })

    return <div className='vcv-attach-image'>
      <div className='vcv-image-preview'>{images}</div>
      <a onClick={this.openLibrary.bind(this)}>
        <i className='vcv-ui-icon vcv-ui-icon-add' />
      </a>
    </div>
  }
}
