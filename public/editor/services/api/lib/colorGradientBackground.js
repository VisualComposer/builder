import React from 'react'
const { Component, PropTypes } = React
export default class ColorGradientBackground extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceData, backgroundSelector } = this.props
    const { backgroundColor, backgroundEndColor, parallax } = deviceData

    if (backgroundColor && backgroundEndColor && backgroundSelector) {
      let customProps = {}
      if (parallax) {
        customProps[ 'data-vce-assets-parallax' ] = '.vce-asset-color-gradient'
      }
      return <div className='vce-asset-color-gradient' {...customProps} {...backgroundSelector} />
    }
    return null
  }
}
