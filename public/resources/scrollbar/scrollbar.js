import React from 'react'
import {Scrollbars} from 'react-custom-scrollbars'

class CustomScrollbars extends React.Component {

  render () {
    const { ...props } = this.props

    return (
      <Scrollbars {...props} className='vcv-ui-scroll'
        renderTrackHorizontal={props => <div {...props} className='vcv-ui-scroll-track--horizontal' />}
        renderTrackVertical={props => <div {...props} className='vcv-ui-scroll-track--vertical' />}
        renderThumbHorizontal={props => <div {...props} className='vcv-ui-scroll-thumb--horizontal' />}
        renderThumbVertical={props => <div {...props} className='vcv-ui-scroll-thumb--vertical' />}
        renderView={props => <div {...props} className='vcv-ui-scroll-content' />} />
    )
  }
}

export default CustomScrollbars

