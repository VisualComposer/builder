import React from 'react'
import classNames from 'classnames'
import { Scrollbars } from 'react-custom-scrollbars'
import PropTypes from 'prop-types'

export default class Scrollbar extends React.Component {
  scrollbars = null

  static propTypes = {
    content: PropTypes.number,
    onScroll: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      showTracks: true
    }
  }

  scrollTop (top) {
    return this.scrollbars.scrollTop(top)
  }

  render () {
    const { ...props } = this.props
    const scrollbarClasses = classNames({
      'vcv-ui-scroll': true,
      'vcv-ui-tree-layout-filled': Object.prototype.hasOwnProperty.call(this.props, 'content') && this.props.content
    })

    return (
      <Scrollbars
        ref={(scrollbars) => { this.scrollbars = scrollbars }} {...props} className={scrollbarClasses}
        renderTrackHorizontal={props => <div {...props} className='vcv-ui-scroll-track--horizontal' />}
        renderTrackVertical={props => <div {...props} className='vcv-ui-scroll-track--vertical' />}
        renderThumbHorizontal={props => <div {...props} className='vcv-ui-scroll-thumb--horizontal' />}
        renderThumbVertical={props => <div {...props} className='vcv-ui-scroll-thumb--vertical' />}
        renderView={props => <div {...props} className='vcv-ui-scroll-content' />}
        onScroll={this.props.onScroll}
        hideTracksWhenNotNeeded={this.state.showTracks}
      />
    )
  }
}
