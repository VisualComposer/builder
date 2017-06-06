import React from 'react'
import classNames from 'classnames'

export default class AttachImageItem extends React.Component {
  static propTypes = {
    className: React.PropTypes.string
  }

  static displayName = 'vcv-ui-form-sortable-attach-image-item-inner'

  constructor (props) {
    super(props)
    this.getLinkHtml = this.getLinkHtml.bind(this)
  }

  handleRemove (key) {
    this.props.handleRemove(key)
  }

  getLinkHtml (key) {
    return this.props.getUrlHtml(key)
  }

  getPublicImage (filename) {
    let { metaAssetsPath } = this.props
    if (!filename) {
      return ''
    }

    return filename.match('^(https?:)?\\/\\/?') ? filename : metaAssetsPath + filename
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const removeImage = localizations ? localizations.removeImage : 'Remove Image'
    let { className, url, oneMoreControl, indexValue, imgId } = this.props
    let imgUrl = ''
    if (imgId) {
      imgUrl = url && url.thumbnail || url.full
    } else {
      imgUrl = this.getPublicImage(url.full)
    }

    className = classNames(className, {
      'vcv-ui-form-attach-image-item': true,
      'vcv-ui-form-attach-image-item-has-link-value': this.props.url.link && this.props.url.link.url
    })

    return (
      <li className={className}>
        <div className='vcv-ui-form-attach-image-item-inner'>
          <figure className='vcv-ui-form-attach-image-thumbnail'>
            <img src={imgUrl} />
          </figure>
          <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
            {oneMoreControl}
            <a className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
              onClick={this.handleRemove.bind(this, indexValue)}
              title={removeImage}
            >
              <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
            </a>
          </div>
        </div>
        {this.getLinkHtml(indexValue)}
      </li>
    )
  }
}
