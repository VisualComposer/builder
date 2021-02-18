import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { getService } from 'vc-cake'
import lodash from 'lodash'

const dataManager = getService('dataManager')

export default class AttachVideoItem extends React.Component {
  static propTypes = {
    childProps: PropTypes.object.isRequired,
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
    if (this.props.childProps.url.url) {
      this.getVideoDimensionsOf(this.props.childProps.url.url)
        .then((size) => {
          this.setState({ videoSize: size })
        })
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.childProps.url.url) {
      this.getVideoDimensionsOf(this.props.childProps.url.url)
        .then((size) => {
          if (lodash.isEqual(prevState.videoSize, this.state.videoSize)) {
            this.setState({ videoSize: size })
          }
        })
    }
  }

  handleRemove (key) {
    this.props.childProps.handleRemove(key)
  }

  getLinkHtml (key) {
    return this.props.childProps.getUrlHtml(key)
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
    let { childProps, className, ...rest } = this.props
    const { fieldKey, url, icon, oneMoreControl, key } = childProps
    const localizations = dataManager.get('localizations')
    const removeVideo = localizations && localizations.removeVideo ? localizations.removeVideo : 'Remove the video'

    className = classNames(className, {
      'vcv-ui-form-attach-image-item': true,
      'vcv-ui-form-attach-image-item-add-control': true,
      'vcv-ui-form-attach-image-item-has-link-value': url && url.url
    })
    const fileName = url && url.url ? url.url.split('/').pop() : ''
    const videoSize = this.state.videoSize.width ? `${this.state.videoSize.width}x${this.state.videoSize.height}` : ''

    return (
      <li {...rest} className={className}>
        <div className='vcv-ui-form-attach-image-item-inner'>
          <figure className='vcv-ui-form-attach-image-thumbnail'>
            <img key={fieldKey + '-li-img-:' + url.full} src={icon} />
          </figure>
          <div className='vcv-ui-form-attach-image-description'>
            <span title={fileName}>{fileName}</span>
            <i>{videoSize}</i>
          </div>
          <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
            {oneMoreControl}
            <a
              className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
              onClick={this.handleRemove.bind(this, key)}
              title={removeVideo}
            >
              <i className='vcv-ui-icon vcv-ui-icon-close-modern' />
            </a>
          </div>
        </div>
        {this.getLinkHtml(key)}
      </li>
    )
  }
}
