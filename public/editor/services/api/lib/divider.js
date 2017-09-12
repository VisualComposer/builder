import React from 'react'
const { Component, PropTypes } = React
export default class Divider extends Component {
  static propTypes = {
    id: PropTypes.string,
    atts: PropTypes.object,
    editor: PropTypes.object
  }

  render () {
    return (
      <svg viewBox='0 0 1000 230'>
        <g stroke='none' strokeWidth='1' fillRule='nonzero' fill='#424242'>
          <polygon id='Rectangle-3' fillOpacity='0.203153306' points='0 0 1000 0 1000 97.1111111 0 230' />
          <polygon id='Rectangle-3' fillOpacity='0.197463768' points='0 0 1000 0 1000 92 0 184' />
          <polygon id='Rectangle-3' fillOpacity='0.197463768' points='0 0 1000 0 1000 86.8888889 0 153.333333' />
          <polyline id='Rectangle-3' points='0 0 1000 0 1000 84.8444444 0 127.777778' />
        </g>
      </svg>
    )
  }
}
