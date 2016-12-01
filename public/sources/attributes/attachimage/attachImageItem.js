import React from 'react'

class AttachImageItem extends React.Component {
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
    let { childProps, ...rest } = this.props
    let { fieldKey, url, oneMoreControl, key } = childProps

    return (
      <li {...rest} className='vcv-ui-form-attach-image-item' key={fieldKey + '-li-:' + this.props.childProps.url.full}>
        <div className='vcv-ui-form-attach-image-item-inner'>
          <figure className='vcv-ui-form-attach-image-thumbnail'>
            <img key={fieldKey + '-li-img-:' + url.full} src={url.thumbnail || url.full} />
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
  childProps: React.PropTypes.object.isRequired
}

export default AttachImageItem
