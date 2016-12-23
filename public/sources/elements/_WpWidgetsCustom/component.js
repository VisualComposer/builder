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
      before_title: this.props.atts.atts_before_title,
      after_title: this.props.atts.atts_after_title,
      before_widget: this.props.atts.atts_before_widget,
      after_widget: this.props.atts.atts_after_widget
    }
    this.serverRequest = ajax({
      'vcv-action': 'elements:widget:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-widget-key': this.props.atts.widgetKey,
      'vcv-widget-value': this.props.atts.widget,
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
      <div className='vce vce-widgets-wrapper' {...customProps} id={'el-' + id} {...editor}>
        <vcvhelper data-vcvs-html={this.state.shortcode || ''} dangerouslySetInnerHTML={this.state.shortcodeContent || { __html: '' }} />
      </div>
    )
  }
}
