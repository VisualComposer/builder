import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'
import lodash from 'lodash'

const dataManager = getService('dataManager')

export default class AttachVideoItem extends React.Component {
  static propTypes = {
    className: PropTypes.string
  }

  static displayName = 'vcv-ui-form-sortable-attach-image-item-inner'

  constructor (props) {
    super(props)
    this.state = {
      videoSize: {}
    }
    this.getLinkHtml = this.getLinkHtml.bind(this)
  }

  componentDidMount () {
    if (this.props.url.url) {
      this.getVideoDimensionsOf(this.props.url.url)
        .then((size) => {
          this.setState({ videoSize: size })
        })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.url.url) {
      this.getVideoDimensionsOf(this.props.url.url)
        .then((size) => {
          if (lodash.isEqual(prevState.videoSize, this.state.videoSize)) {
            this.setState({ videoSize: size })
          }
        })
    }
  }

  handleRemove (key) {
    this.props.handleRemove(key)
  }

  getLinkHtml (key) {
    return this.props.getUrlHtml(key)
  }

  /**
   Returns the dimensions of a video asynchrounsly.
   @param {String} url Url of the video to get dimensions from.
   @return {Promise} Promise which returns the dimensions of the video in 'width' and 'height' properties.
   */
  getVideoDimensionsOf (url) {
    return new Promise(function (resolve) {
      const video = document.createElement('video')

      // place a listener on it
      video.addEventListener('loadedmetadata', function () {
        // retrieve dimensions
        const height = this.videoHeight
        const width = this.videoWidth
        // send back result
        resolve({
          height: height,
          width: width
        })
      }, false)

      // start download meta-datas
      video.src = url
    })
  }

  render () {
    let { className, fieldKey, url, icon, oneMoreControl, indexValue } = this.props
    const localizations = dataManager.get('localizations')
    const removeVideo = localizations && localizations.removeVideo ? localizations.removeVideo : 'Remove the video'

    className = classNames(className, {
      'vcv-ui-form-attach-image-item': true,
      'vcv-ui-form-attach-image-item-add-control': true,
      'vcv-ui-form-attach-image-item-has-link-value': url && url.url
    })
    const fileName = url && url.url ? url.url.split('/').pop() : ''
    let videoSize = null
    if (this.state.videoSize.width) {
      videoSize = <i>{`${this.state.videoSize.width}x${this.state.videoSize.height}`}</i>
    }

    return (
      <li className={className}>
        <div className='vcv-ui-form-attach-image-item-inner'>
          <figure className='vcv-ui-form-attach-image-thumbnail' onClick={this.props.handleOpenLibrary}>
            <img key={fieldKey + '-li-img-:' + url.full} src={icon} />
          </figure>
          <div className='vcv-ui-form-attach-image-description'>
            <span title={fileName}>{fileName}</span>
            {videoSize}
          </div>
          <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
            {oneMoreControl}
            <a
              className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
              onClick={this.handleRemove.bind(this, indexValue)}
              title={removeVideo}
            >
              <i className='vcv-ui-icon vcv-ui-icon-close-modern' />
            </a>
          </div>
        </div>
        {this.getLinkHtml(indexValue)}
      </li>
    )
  }
}
