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
    let atts = {
      per_page: this.props.atts.atts_per_page,
      columns: this.props.atts.atts_columns,
      orderby: this.props.atts.atts_orderby,
      order: this.props.atts.atts_order,
      attribute: this.props.atts.atts_attribute,
      filter: this.props.atts.atts_filter
    }
    this.serverRequest = ajax({
      'vcv-action': `elements:woocommerce:product_attribute${(this.props.clean ? ':clean' : '')}:adminNonce`,
      'vcv-nonce': window.vcvNonce,
      'vcv-atts': atts
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
