/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  state = {
    shortcodeContent: { __html: '' }
  }

  componentDidMount () {
    this.requestToServer()
  }

  componentDidUpdate (prevProps) {
    let isEqual = require('lodash').isEqual
    if (!isEqual(this.props.atts, prevProps.atts)) {
      this.requestToServer()
    }
  }

  requestToServer () {
    let ajax = (data, successCallback, failureCallback) => {
      let request
      request = new window.XMLHttpRequest()
      request.open('POST', window.vcvAjaxUrl, true)
      request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          successCallback(request)
        } else {
          if (typeof failureCallback === 'function') {
            failureCallback(request)
          }
        }
      }
      request.send(window.$.param(data))

      return request
    }

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    let atts = {
      style: this.props.atts.atts_style
    }
    if (this.props.atts.selector === 'sku') {
      atts.sku = this.props.atts.atts_sku
    } else {
      atts.id = this.props.atts.atts_id
    }
    // TODO: Check undocumented `show_price`, `class`, `quantity`
    this.serverRequest = ajax({
      'vcv-action': `elements:woocommerce:add_to_cart${(this.props.clean ? ':clean' : '')}:adminNonce`,
      'vcv-nonce': window.vcvNonce,
      'vcv-atts': atts
    }, (result) => {
      this.setState({
        shortcodeContent: { __html: result.response }
      })
    })
  }

  render () {
    let { id, atts, editor } = this.props
    let { designOptions } = atts

    let customProps = {}
    let devices = designOptions.visibleDevices ? Object.keys(designOptions.visibleDevices) : []
    let animations = []
    devices.forEach((device) => {
      let prefix = designOptions.visibleDevices[ device ]
      if (designOptions[ device ].animation) {
        if (prefix) {
          prefix = `-${prefix}`
        }
        animations.push(`vce-o-animate--${designOptions[ device ].animation}${prefix}`)
      }
    })
    if (animations.length) {
      customProps[ 'data-vce-animate' ] = animations.join(' ')
    }

    return (
      <div className='vce vce-woocommerce-wrapper' {...customProps} id={'el-' + id} {...editor}>
        <div dangerouslySetInnerHTML={this.state.shortcodeContent || { __html: '' }} />
      </div>
    )
  }
}
