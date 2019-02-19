import React from 'react'
import { getService } from 'vc-cake'

const vcvAPI = getService('api')

export default class WpWidgetsCustom extends vcvAPI.elementComponent {
  state = {
    shortcode: '',
    shortcodeContent: this.spinnerHTML()
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

  componentwillUnmount () {
    if (this.serverRequest) {
      this.serverRequest.cancelled = true
    }
  }

  requestToServer () {
    let atts = {
      before_title: this.props.atts.customWidgetHtml ? this.props.atts.atts_before_title : '',
      after_title: this.props.atts.customWidgetHtml ? this.props.atts.atts_after_title : '',
      before_widget: this.props.atts.customWidgetHtml ? this.props.atts.atts_before_widget : '',
      after_widget: this.props.atts.customWidgetHtml ? this.props.atts.atts_after_widget : ''
    }
    this.setState({
      shortcodeContent: this.spinnerHTML()
    })
    const dataProcessService = getService('dataProcessor')

    this.serverRequest = dataProcessService.appServerRequest({
      'vcv-action': 'elements:widget:adminNonce',
      'vcv-nonce': window.vcvNonce,
      'vcv-widget-key': this.props.atts.widgetKey,
      'vcv-element-tag': this.props.atts.tag,
      'vcv-widget-value': this.props.atts.widget,
      'vcv-atts': atts,
      'vcv-source-id': window.vcvSourceID
    }).then((result) => {
      if (this.serverRequest && this.serverRequest.cancelled) {
        this.serverRequest = null
        return
      }
      let response = this.getResponse(result)
      if (response && response.status) {
        this.setState({
          shortcode: response.shortcode,
          shortcodeContent: response.shortcodeContent || ''
        })
      } else {
        this.setState({
          shortcode: 'Failed to render widget',
          shortcodeContent: ''
        })
      }
    })
  }

  render () {
    let { id, atts, editor } = this.props
    let { customClass, metaCustomId } = atts
    let containerClasses = [ 'vce-widgets-container' ]

    let customProps = {}
    if (customClass) {
      containerClasses.push(customClass)
    }
    if (metaCustomId) {
      customProps.id = metaCustomId
    }

    let doAll = this.applyDO('all')

    return (
      <div className={containerClasses.join(' ')} {...customProps} {...editor}>
        <div className='vce vce-widgets-wrapper' id={'el-' + id} {...doAll}>
          <div className='vcvhelper' data-vcvs-html={this.state.shortcode || ''}
            dangerouslySetInnerHTML={{ __html: this.state.shortcodeContent || '' }} />
        </div>
      </div>
    )
  }
}
