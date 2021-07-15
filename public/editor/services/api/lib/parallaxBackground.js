import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class ParallaxBackground extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, deviceData, content, divider, atts } = this.props
    const { parallax, parallaxSpeed, parallaxReverse } = deviceData
    if (parallax) {
      const customProps = {}
      const containerClasses = [
        'vce-asset-parallax-container',
        `vce-visible-${deviceKey}-only`
      ]
      const elementClasses = [
        'vce-asset-parallax'
      ]
      if (parallax === 'mouse-move') {
        customProps['data-vce-assets-parallax-mouse-move'] = '.vce-asset-parallax'
        customProps['data-vce-assets-parallax-mouse-move-element'] = atts.id
        elementClasses.push('vce-asset-parallax-mouse-move')
      } else {
        if (parallax) {
          customProps['data-vce-assets-parallax'] = '.vce-asset-parallax'
        }
        if (parallax === 'fixed' && !divider) {
          customProps['data-vce-assets-parallax-fixed'] = true
        }
        if (parallax === 'simple-fade' && !divider) {
          customProps['data-vce-assets-parallax-fade'] = true
        }
      }
      if (divider) {
        customProps['data-vce-assets-parallax-speed'] = parallaxSpeed ? parallaxSpeed / 2 : 15
      } else if (parallaxSpeed) {
        customProps['data-vce-assets-parallax-speed'] = parallaxSpeed
      }
      customProps['data-vce-assets-parallax-reverse'] = parallaxReverse

      return (
        <div className={classNames(containerClasses)} {...customProps}>
          <div className={classNames(elementClasses)}>
            {content}
          </div>
        </div>
      )
    }

    return null
  }
}
