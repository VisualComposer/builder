import React from 'react'
import classNames from 'classnames'
const { Component, PropTypes } = React
export default class ParallaxBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, deviceData, content } = this.props
    const { parallax, parallaxSpeed } = deviceData
    if (parallax) {
      let customProps = {}
      let containerClasses = [
        `vce-asset-parallax-container`,
        `vce-visible-${deviceKey}-only`
      ]
      let elementClasses = classNames([
        `vce-asset-parallax`
      ])
      if (parallax) {
        customProps[ 'data-vce-assets-parallax' ] = '.vce-asset-parallax'
      }
      if (parallax === 'simple-fade') {
        customProps[ 'data-vce-assets-parallax-fade' ] = true
      }
      if (parallaxSpeed) {
        customProps[ 'data-vce-assets-parallax-speed' ] = parallaxSpeed
      }
      return <div className={classNames(containerClasses)} {...customProps} >
        <div className={classNames(elementClasses)}>
          { content }
        </div>
      </div>
    }
    return null
  }
}
