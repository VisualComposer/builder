/* global React, vcvAPI */
/* eslint no-unused-vars: 0 */
import React from 'react'
import vcCake from 'vc-cake'
const vcvAPI = vcCake.getService('api')

export default class Component extends vcvAPI.elementComponent {
  render () {
    // import variables
    var { id, atts, editor } = this.props
    var { size, customClass, designOptionsAdvanced, assetsLibrary, metaCustomId } = atts
    var content = this.props.children

    // import template js
    const classNames = require('classnames')
    let customProps = {}
    let customColProps = {}
    let classes = []

    if (vcCake.env('FEATURE_CUSTOM_ROW_LAYOUT')) {
      classes = [ 'vce-col' ]
    } else {
      classes = [ 'vce-col', 'vce-col--xs-1' ]
      classes.push('vce-col--sm-' + (size ? size.replace('/', '-') : 'auto'))
    }

// reverse classes.push('vce-row-wrap--reverse')
    if (typeof customClass === 'string' && customClass.length) {
      classes.push(customClass)
    }

    if (designOptionsAdvanced.device) {
      // animations
      let animations = []
      Object.keys(designOptionsAdvanced.device).forEach((device) => {
        let prefix = (device === 'all') ? '' : device
        if (designOptionsAdvanced.device[ device ].animation) {
          if (prefix) {
            prefix = `-${prefix}`
          }
          animations.push(`vce-o-animate--${designOptionsAdvanced.device[ device ].animation}${prefix}`)
        }
      })
      if (animations.length) {
        customColProps[ 'data-vce-animate' ] = animations.join(' ')
      }
    }

    let className = classNames(classes)
    if (metaCustomId) {
      customColProps.id = metaCustomId
    }

    let doBoxModel = this.applyDO('margin padding border')

    // import template
    return (<div className={className} {...customColProps} id={'el-' + id} {...editor} {...doBoxModel}>
      {this.getBackgroundTypeContent()}
      <div className='vce-col-inner'>
        <div className='vce-col-content' {...customProps}>
          {content}
        </div>
      </div>
    </div>)
  }
}
