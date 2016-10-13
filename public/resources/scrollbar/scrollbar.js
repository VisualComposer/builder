import React from 'react'
import {Scrollbars} from 'react-custom-scrollbars'

export default class Scrollbar extends React.Component {

  scrollTop (top) {
    return this.refs.scrollbars.scrollTop(top)
  }

  render () {
    const { ...props } = this.props

    return (
      <Scrollbars ref='scrollbars' {...props} className='vcv-ui-scroll'
        renderTrackHorizontal={props => <div {...props} className='vcv-ui-scroll-track--horizontal' />}
        renderTrackVertical={props => <div {...props} className='vcv-ui-scroll-track--vertical' />}
        renderThumbHorizontal={props => <div {...props} className='vcv-ui-scroll-thumb--horizontal' />}
        renderThumbVertical={props => <div {...props} className='vcv-ui-scroll-thumb--vertical' />}
        renderView={props => <div {...props} className='vcv-ui-scroll-content' />} />
    )
  }
}
