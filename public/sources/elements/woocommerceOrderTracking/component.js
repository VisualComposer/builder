/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  state = {
    shortcodeContent: { __html: '' }
  }

  componentDidMount () {
    let ajax = require('../_woocommerce/shared').ajax

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    this.serverRequest = ajax({
      'vcv-action': 'elements:woocommerce:woocommerce_order_tracking'
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
