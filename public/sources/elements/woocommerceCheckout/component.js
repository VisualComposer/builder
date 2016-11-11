/* global React, vcvAPI, vcCake */
/* eslint no-unused-vars: 0 */
class Component extends vcvAPI.elementComponent {
  state = {
    shortcodeContent: { __html: '' }
  }

  componentDidMount () {
    let innerAjax = require('../_woocommerce/shared.js')

    if (this.serverRequest) {
      this.serverRequest.abort()
    }
    this.serverRequest = innerAjax({
      'vcv-action': 'elements:woocommerce:woocommerce_checkout'
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
