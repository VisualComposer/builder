import React from 'react'
import classNames from 'classnames'

class AttachImageItem extends React.Component {
  static displayName = 'vcv-ui-form-sortable-attach-image-item-inner'

  constructor (props) {
    super(props)
    this.getLinkHtml = this.getLinkHtml.bind(this)
  }

  handleRemove (key) {
    this.props.childProps.handleRemove(key)
  }

  getLinkHtml (key) {
    return this.props.childProps.getUrlHtml(key)
  }

  render () {
    let { childProps, className, ...rest } = this.props
    let { fieldKey, url, icon, oneMoreControl, key } = childProps
    className = classNames(className, {
      'vcv-ui-form-attach-image-item': true,
      'vcv-ui-form-attach-image-item-has-link-value': this.props.childProps.url.url && this.props.childProps.url.url
    })

    return (
      <li {...rest} className={className} key={fieldKey + '-li-:' + this.props.childProps.url.url}>
        <div className='vcv-ui-form-attach-image-item-inner'>
          <figure className='vcv-ui-form-attach-image-thumbnail'>
            <img key={fieldKey + '-li-img-:' + url.full} src={icon} />
          </figure>
          <div className='vcv-ui-form-attach-image-item-controls' tabIndex='0'>
            {oneMoreControl}
            <a className='vcv-ui-form-attach-image-item-control vcv-ui-form-attach-image-item-control-state--danger'
              onClick={this.handleRemove.bind(this, key)}>
              <i className='vcv-ui-icon vcv-ui-icon-close-thin' />
            </a>
          </div>
        </div>
        {this.getLinkHtml(key)}
      </li>
    )
  }
}

AttachImageItem.propTypes = {
  childProps: React.PropTypes.object.isRequired,
  className: React.PropTypes.string
}

export default AttachImageItem
