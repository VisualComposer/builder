/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')

export default class Component extends vcvAPI.elementComponent {
  render () {
    let { id, atts, editor } = this.props
    let { output, designOptions, customClass, metaCustomId } = atts // destructuring assignment for attributes from settings.json with access public
    let textBlockClasses = 'vce-text-block'
    let wrapperClasses = 'vce-text-block-wrapper vce'
    let customProps = {}
    if (typeof customClass === 'string' && customClass) {
      textBlockClasses = textBlockClasses.concat(' ' + customClass)
    }
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
    if (metaCustomId) {
      customProps.id = metaCustomId
    }
    return <div className={textBlockClasses} {...editor} {...customProps}>
      <div className={wrapperClasses} id={'el-' + id}>
        {output}
      </div>
    </div>
  }
}
