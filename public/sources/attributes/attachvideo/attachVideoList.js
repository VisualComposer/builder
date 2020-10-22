import React from 'react'
import AttachVideoItem from './attachVideoItem'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import PropTypes from 'prop-types'

const SortableHandler = SortableHandle(({ title }) => {
  return (
    <a className='vcv-ui-form-attach-image-item-control' title={title}>
      <i className='vcv-ui-icon vcv-ui-icon-move' />
    </a>
  )
})

const SortableItem = SortableElement((props) => {
  return (
    <AttachVideoItem {...props} />
  )
})

export default class AttachVideoList extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]).isRequired,
    fieldKey: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      ...props,
      value: {
        icons: [],
        ...props.value
      }
    }
    this.handleOpenLibrary = this.handleOpenLibrary.bind(this)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.setState({
      ...nextProps
    })
  }
  /* eslint-enable */

  handleAttachmentData (index, data) {
    const icons = this.state.value.icons || []
    icons[index] = data && data.icon
    this.setState({
      value: {
        ...this.state.value,
        icons
      }
    })
  }

  handleOpenLibrary () {
    this.props.openLibrary()
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const addImage = localizations ? localizations.addImage : 'Add an image'
    const editReplaceImage = localizations ? localizations.editReplaceImage : 'Edit or replace the image'
    const moveImage = localizations ? localizations.moveImage : 'Move the image'
    const { fieldKey, value } = this.state
    const images = []

    let oneMoreControl = ''
    if (this.props.options.multiple) {
      oneMoreControl = (
        <SortableHandler title={moveImage} />
      )
    } else {
      oneMoreControl = (
        <a
          className='vcv-ui-form-attach-image-item-control' onClick={this.handleOpenLibrary.bind(this)}
          title={editReplaceImage}
        >
          <i className='vcv-ui-icon vcv-ui-icon-edit' />
        </a>
      )
    }

    value && value.urls && value.urls.forEach((url, index) => {
      const id = value.ids[index]
      if ((!value.icons || (value.icons && !value.icons[index])) && !this[`attachment-${id}`]) {
        const attachment = id && window.wp.media.attachment(id)
        const request = this[`attachment-${id}`] = attachment.sync('read')
        request.then((data) => {
          this.handleAttachmentData(index, data)
        })
      }
      const childProps = {
        key: index,
        fieldKey: fieldKey,
        url: url,
        icon: value.icons && value.icons[index],
        oneMoreControl: oneMoreControl,
        onRemove: this.props.onRemove,
        getUrlHtml: this.props.getUrlHtml
      }

      if (this.props.options.multiple) {
        value.ids[index] && images.push(
          <SortableItem
            key={`sortable-attach-image-item-${fieldKey}-${index}`}
            childProps={childProps}
            index={index}
          />
        )
      } else {
        value.ids[index] && images.push(
          <AttachVideoItem
            key={index}
            childProps={childProps}
          />
        )
      }
    })

    let addControl = (
      <li className='vcv-ui-form-attach-image-item'>
        <a className='vcv-ui-form-attach-image-control' onClick={this.handleOpenLibrary.bind(this)} title={addImage}>
          <i className='vcv-ui-icon vcv-ui-icon-add' />
        </a>
      </li>
    )

    if (!this.props.options.multiple && value.urls && value.urls.length && value.ids[0]) {
      addControl = ''
    }

    return (
      <ul className='vcv-ui-form-attach-image-items'>
        {images}
        {addControl}
      </ul>
    )
  }
}
