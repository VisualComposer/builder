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
      number: this.props.atts.atts_number,
      ids: this.props.atts.atts_ids,
      columns: this.props.atts.atts_columns,
      orderby: this.props.atts.atts_orderby,
      order: this.props.atts.atts_order,
      parent: this.props.atts.atts_parent,
      hide_empty: this.props.atts.hide_empty
    }
    this.serverRequest = ajax({
      'vcv-action': `elements:woocommerce:product_categories${(this.props.clean ? ':clean' : '')}:adminNonce`,
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
