import React from 'react'
import classNames from 'classnames'
import {Scrollbars} from 'react-custom-scrollbars'

export default class Scrollbar extends React.Component {
  static propTypes = {
    content: React.PropTypes.number
  }

  scrollTop (top) {
    return this.refs.scrollbars.scrollTop(top)
  }

  render () {
    const { ...props } = this.props
    const scrollbarClasses = classNames({
      'vcv-ui-scroll': true,
      'vcv-ui-tree-layout-filled': this.props.hasOwnProperty('content') && this.props.content
    })

    return (
      <Scrollbars ref='scrollbars' {...props} className={scrollbarClasses}
        renderTrackHorizontal={props => <div {...props} className='vcv-ui-scroll-track--horizontal' />}
        renderTrackVertical={props => <div {...props} className='vcv-ui-scroll-track--vertical' />}
        renderThumbHorizontal={props => <div {...props} className='vcv-ui-scroll-thumb--horizontal' />}
        renderThumbVertical={props => <div {...props} className='vcv-ui-scroll-thumb--vertical' />}
        renderView={props => <div {...props} className='vcv-ui-scroll-content' />} />
    )
  }
}
