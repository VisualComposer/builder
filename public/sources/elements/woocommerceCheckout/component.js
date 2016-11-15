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
    let ajax = require('../_woocommerce/shared').ajax

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    this.serverRequest = ajax({
      'vcv-action': `elements:woocommerce:woocommerce_checkout${(this.props.clean ? ':clean' : '')}:adminNonce`,
      'vcv-nonce': window.vcvNonce
    }, (result) => {
      this.setState({
        shortcodeContent: { __html: result.response }
      })
    })
  }

  render () {
    let render = require('../_woocommerce/shared').render
    return render(this.props, this.state)
  }
}
