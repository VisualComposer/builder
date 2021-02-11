import React from 'react'
import AttachImageItem from './attachImageItem'
import { SortableElement, SortableHandle } from 'react-sortable-hoc'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

const SortableHandler = SortableHandle(({ title }) => {
  return (
    <a className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control--drag' title={title}>
      <i className='vcv-ui-icon vcv-ui-icon-drag-dots' />
    </a>
  )
})

const SortableItem = SortableElement((props) => {
  return (
    <AttachImageItem {...props} />
  )
})

export default class AttachImageList extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]).isRequired,
    fieldKey: PropTypes.string.isRequired
  }

  constructor (props) {
    super(props)
    this.handleOpenLibrary = this.handleOpenLibrary.bind(this)
  }

  handleOpenLibrary () {
    this.props.openLibrary()
  }

  getPublicImage (filename) {
    const { metaAssetsPath } = this.props
    if (!filename) {
      return ''
    }
    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const localizations = dataManager.get('localizations')
    const addImage = localizations ? localizations.addImage : 'Add an image'
    const editReplaceImage = localizations ? localizations.editReplaceImage : 'Edit or replace the image'
    const moveImage = localizations ? localizations.moveImage : 'Move the image'
    const { fieldKey, value } = this.props
    const images = []

    let sortableControl = ''
    if (this.props.options.multiple) {
      sortableControl = (
        <SortableHandler title={moveImage} />
      )
    }
    const editControl = (
      <a
        className='vcv-ui-form-attach-image-item-control' onClick={this.handleOpenLibrary.bind(this)}
        title={editReplaceImage}
      >
        <i className='vcv-ui-icon vcv-ui-icon-pencil-modern' />
      </a>
    )

    value && value.urls && value.urls.forEach((url, index) => {
      let imgUrl = ''
      if (value.ids[index]) {
        imgUrl = url && url.thumbnail ? url.thumbnail : url.full
      } else {
        imgUrl = this.getPublicImage(url.full)
      }

      const childProps = {
        url: url,
        imgUrl: imgUrl,
        sortableControl: sortableControl,
        editControl: editControl,
        onRemove: this.props.onRemove,
        getUrlHtml: this.props.getUrlHtml,
        imgId: value.ids[index],
        metaAssetsPath: this.props.metaElementPath,
        indexValue: index,
        index: index
      }

      if (this.props.options.multiple) {
        images.push(
          <SortableItem
            key={`sortable-attach-image-item-${fieldKey}-${index}`}
            {...childProps}
          />
        )
      } else {
        childProps.dynamicApi = this.props.dynamicApi
        images.push(
          <AttachImageItem
            key={index}
            {...childProps}
          />
        )
      }
    })

    let controlClasses = 'vcv-ui-form-attach-image-item vcv-ui-form-attach-image-item-add-control'

    let dynamicControl = null
    if (this.props.dynamicApi) {
      controlClasses += ' vcv-ui-form-attach-image-item-has-dynamic'
      dynamicControl = this.props.dynamicApi.renderOpenButton()
    }

    let addControl = (
      <li className={controlClasses}>
        <a className='vcv-ui-form-attach-image-control' onClick={this.handleOpenLibrary.bind(this)} title={addImage}>
          <i className='vcv-ui-icon vcv-ui-icon-add' />
        </a>
        {dynamicControl}
      </li>
    )

    if (!this.props.options.multiple && value.urls && value.urls.length) {
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
