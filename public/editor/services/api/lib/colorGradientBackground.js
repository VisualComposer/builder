import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class ColorGradientBackground extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    const { deviceKey, applyBackground } = this.props

    const containerClasses = [
      'vce-asset-color-gradient-container',
      `vce-visible-${deviceKey}-only`
    ]

    return <div className={classNames(containerClasses)} {...applyBackground} />
  }
}
