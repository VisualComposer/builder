import React from 'react'
import AttachVideoItem from './attachVideoItem'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'
import lodash from 'lodash'
import classNames from 'classnames'

const dataManager = getService('dataManager')

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
      },
      isDraggingOver: false
    }
    this.handleOpenLibrary = this.handleOpenLibrary.bind(this)
    this.handleDragOver = this.handleDragOver.bind(this)
    this.handleDragLeave = this.handleDragLeave.bind(this)
  }

  componentDidUpdate (prevProps) {
    if (!lodash.isEqual(prevProps, this.props)) {
      this.setState({
        ...this.props
      })
    }
  }

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

  handleDragOver (event) {
    event.stopPropagation()
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
    this.setState({
      isDraggingOver: true
    })
  }

  handleDragLeave (event) {
    event.stopPropagation()
    event.preventDefault()
    this.setState({
      isDraggingOver: false
    })
  }

  render () {
    const localizations = dataManager.get('localizations')
    const addVideo = localizations && localizations.addVideo ? localizations.addVideo : 'Add an image'
    const editReplaceVideo = localizations && localizations.editReplaceVideo ? localizations.editReplaceVideo : 'Edit or replace the video'
    const moveVideo = localizations && localizations.moveVideo ? localizations.moveVideo : 'Move the video'
    const { fieldKey, value } = this.state
    const videos = []

    let oneMoreControl = ''
    if (this.props.options.multiple) {
      oneMoreControl = (
        <SortableHandler title={moveVideo} />
      )
    } else {
      oneMoreControl = (
        <a
          className='vcv-ui-form-attach-image-item-control' onClick={this.handleOpenLibrary.bind(this)}
          title={editReplaceVideo}
        >
          <i className='vcv-ui-icon vcv-ui-icon-pencil-modern' />
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
        handleRemove: this.props.onRemove,
        getUrlHtml: this.props.getUrlHtml
      }

      if (this.props.options.multiple) {
        value.ids[index] && videos.push(
          <SortableItem
            key={`sortable-attach-image-item-${fieldKey}-${index}`}
            childProps={childProps}
            index={index}
          />
        )
      } else {
        value.ids[index] && videos.push(
          <AttachVideoItem
            key={index}
            childProps={childProps}
          />
        )
      }
    })

    const addControlClasses = classNames({
      'vcv-ui-form-attach-image-control': true,
      'vcv-ui-form-attach-image-control--drag-over': this.state.isDraggingOver
    })

    let addControl = (
      <li className='vcv-ui-form-attach-image-item vcv-ui-form-attach-image-item-add-control'>
        <a
          className={addControlClasses}
          onClick={this.handleOpenLibrary.bind(this)}
          title={addVideo}
          onDragOver={this.handleDragOver}
          onDragLeave={this.handleDragLeave}
          onDrop={this.props.onHandleDrop}
        >
          <i className='vcv-ui-icon vcv-ui-icon-add' />
        </a>
      </li>
    )

    if (!this.props.options.multiple && value.urls && value.urls.length && value.ids[0]) {
      addControl = ''
    }

    return (
      <ul className='vcv-ui-form-attach-image-items'>
        {videos}
        {addControl}
      </ul>
    )
  }
}
