import React from 'react'
const { Component, PropTypes } = React
export default class ColorGradientBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceData, applyBackground } = this.props
    const { backgroundColor, parallax, parallaxSpeed } = deviceData

    if (backgroundColor) {
      let customProps = {}
      if (parallax) {
        customProps[ 'data-vce-assets-parallax' ] = '.vce-asset-color-gradient'
      }
      if (parallax === 'simple-fade') {
        customProps[ 'data-vce-assets-parallax-fade' ] = true
      }
      if (parallaxSpeed) {
        customProps[ 'data-vce-assets-parallax-speed' ] = parallaxSpeed
      }
      return <div className='vce-asset-color-gradient-container' {...customProps}>
        <div className='vce-asset-color-gradient' {...applyBackground} />
      </div>
    }
    return null
  }
}
