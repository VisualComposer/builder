/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  state = {
    shortcode: { __html: '' },
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
      columns: this.props.atts.atts_columns,
      orderby: this.props.atts.atts_orderby,
      order: this.props.atts.atts_order
    }
    if (this.props.atts.selector === 'skus') {
      atts.skus = this.props.atts.atts_skus
    } else {
      atts.ids = this.props.atts.atts_ids
    }
    this.serverRequest = ajax({
      'vcv-action': 'elements:woocommerce:products:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-atts': atts
    }, (result) => {
      let response = JSON.parse(result.response)
      this.setState({
        shortcode: response.shortcode,
        shortcodeContent: { __html: response.shortcodeContent }
      })
    })
  }

  render () {
    let { id, editor } = this.props
    let doAll = this.applyDO('all')

    return (
      <div className='vce vce-woocommerce-wrapper' id={'el-' + id} {...editor} {...doAll}>
        <vcvhelper data-vcvs-html={this.state.shortcode || ''} dangerouslySetInnerHTML={this.state.shortcodeContent || { __html: '' }} />
      </div>
    )
  }
}
