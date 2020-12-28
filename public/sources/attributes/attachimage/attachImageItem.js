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

    this.state = { imgPortrait: true }
  }

  componentDidMount () {
    this.checkImageSize(this.props.imgUrl, this.setImageClass)
  }

  /* eslint-disable */
  UNSAFE_componentWillReceiveProps (nextProps) {
    this.checkImageSize(nextProps.imgUrl, this.setImageClass)
  }
  /* eslint-enable */

  handleRemove (key) {
    this.props.onRemove(key)
  }

  getLinkHtml (key) {
    return this.props.getUrlHtml(key)
  }

  checkImageSize (url, callback) {
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

  render () {
    const localizations = dataManager.get('localizations')
    const removeImage = localizations ? localizations.removeImage : 'Remove the image'
    let { className, url, oneMoreControl, indexValue, imgUrl } = this.props

    className = classNames(className, {
      'vcv-ui-form-attach-image-item': true,
      'vcv-ui-form-attach-image-item-has-link-value': url.link && url.link.url,
      'vcv-ui-form-attach-image-item-view--portrait': this.state.imgPortrait,
      'vcv-ui-form-attach-image-item-has-dynamic': !!this.props.dynamicApi
    })

    let dynamicControl = null
    if (this.props.dynamicApi) {
      dynamicControl = this.props.dynamicApi.renderOpenButton()
    }

    return (
      <li className={className}>
        <div className='vcv-ui-form-attach-image-item-wrapper'>
          <div className='vcv-ui-form-attach-image-item-inner'>
            <figure className='vcv-ui-form-attach-image-thumbnail'>
              <img src={imgUrl} />
            </figure>
            <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
              {oneMoreControl}
              <a
                className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
                onClick={this.handleRemove.bind(this, indexValue)}
                title={removeImage}
              >
                <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
              </a>
            </div>
          </div>
          {dynamicControl}
        </div>
        {this.getLinkHtml(indexValue)}
      </li>
    )
  }
}
