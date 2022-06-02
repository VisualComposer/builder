import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class AttachImageItem extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  static displayName = 'vcv-ui-form-sortable-attach-image-item-inner'

  constructor (props) {
    super(props)
    this.getLinkHtml = this.getLinkHtml.bind(this)
    this.setImageClass = this.setImageClass.bind(this)
    this.setSizeTitle = this.setSizeTitle.bind(this)

    this.state = {
      imgPortrait: true,
      imageSize: {}
    }
    this.imageRef = React.createRef()
  }

  componentDidMount () {
    if (this.props.imgUrl) {
      this.checkImageDimensions(this.props.imgUrl, this.setImageClass)
    }
    const imgUrl = (this.props.url && this.props.url.full && this.props.url.full.split('/').length > 1) ? this.props.url.full : this.props.imgUrl
    if (imgUrl) {
      this.checkImageDimensions(imgUrl, this.setSizeTitle)
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.imgUrl !== this.props.imgUrl) {
      const imgUrl = (this.props.url && this.props.url.full && this.props.url.full.split('/').length > 1) ? this.props.url.full : this.props.imgUrl
      if (imgUrl) {
        this.checkImageDimensions(imgUrl, this.setSizeTitle)
      }
      if (this.props.imgUrl) {
        this.checkImageDimensions(this.props.imgUrl, this.setImageClass)
      }
    }
  }

  handleRemove (key) {
    this.props.onRemove(key)
  }

  getLinkHtml (key) {
    return this.props.getUrlHtml(key)
  }

  checkImageDimensions (url, callback) {
    const img = new window.Image()
    img.onload = () => {
      const size = {
        width: img.width,
        height: img.height
      }
      callback(size)
    }
    img.src = url
  }

  setImageClass (size) {
    this.setState({
      imgPortrait: size.width < size.height
    })
  }

  setSizeTitle (size) {
    this.setState({ imageSize: size })
  }

  render () {
    const localizations = dataManager.get('localizations')
    const removeImage = localizations ? localizations.removeImage : 'Remove the image'
    let { className, url, editControl, sortableControl, indexValue, imgUrl } = this.props

    className = classNames(className, {
      'vcv-ui-form-attach-image-item': true,
      'vcv-ui-form-attach-image-item-has-link-value': url.link && url.link.url,
      'vcv-ui-form-attach-image-item-view--portrait': this.state.imgPortrait
    })

    const fileName = url && url.full ? url.full.split('/').pop() : imgUrl?.split('/').pop()
    const imageSize = this.state.imageSize.width ? `${this.state.imageSize.width}x${this.state.imageSize.height}` : ''

    let dynamicControl = null
    if (this.props.dynamicApi) {
      dynamicControl = this.props.dynamicApi.renderOpenButton(true)
    }

    return (
      <li className={className}>
        <div className='vcv-ui-form-attach-image-item-wrapper'>
          <div className='vcv-ui-form-attach-image-item-inner'>
            {sortableControl}
            <figure className='vcv-ui-form-attach-image-thumbnail' onClick={this.props.handleOpenLibrary}>
              <img src={imgUrl} />
            </figure>
            <div className='vcv-ui-form-attach-image-description'>
              <span title={fileName}>{fileName}</span>
              <i>{imageSize}</i>
            </div>
            <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
              {editControl}
              {this.getLinkHtml(indexValue)}
              {dynamicControl}
              <a
                className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
                onClick={this.handleRemove.bind(this, indexValue)}
                title={removeImage}
              >
                <i className='vcv-ui-icon vcv-ui-icon-close-modern' />
              </a>
            </div>
          </div>
        </div>
      </li>
    )
  }
}
