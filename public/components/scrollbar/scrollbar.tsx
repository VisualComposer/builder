import React from 'react'
import classNames from 'classnames'
import { Scrollbars } from 'react-custom-scrollbars'

interface ScrollbarProps {
  content?: number
  onScroll?: () => void
  initialScrollTop?: number
}

interface ScrollbarState {
  showTracks: boolean
}

export default class Scrollbar extends React.Component<ScrollbarProps, ScrollbarState> {
  scrollbars = null

  constructor (props:ScrollbarProps) {
    super(props)
    this.state = {
      showTracks: true
    }
  }

  componentDidMount () {
    if (this.props.initialScrollTop) {
      // @ts-ignore
      this.scrollbars?.scrollTop(this.props.initialScrollTop)
    }
  }

  scrollTop (top: number) {
    // @ts-ignore
    return this.scrollbars?.scrollTop(top)
  }

  render () {
    const scrollProps = Object.assign({}, this.props)
    const { ...newScrollProps } = scrollProps
    // @ts-ignore
    delete newScrollProps.initialScrollTop
    const scrollbarClasses = classNames({
      'vcv-ui-scroll': true,
      'vcv-ui-tree-layout-filled': Object.prototype.hasOwnProperty.call(this.props, 'content') && this.props.content
    })

    return (
      <Scrollbars
        // @ts-ignore
        ref={(scrollbars) => { this.scrollbars = scrollbars }} {...newScrollProps} className={scrollbarClasses}
        renderTrackHorizontal={(props: object) => <div {...props} className='vcv-ui-scroll-track--horizontal' />}
        renderTrackVertical={(props: object) => <div {...props} className='vcv-ui-scroll-track--vertical' />}
        renderThumbHorizontal={(props: object) => <div {...props} className='vcv-ui-scroll-thumb--horizontal' />}
        renderThumbVertical={(props: object) => <div {...props} className='vcv-ui-scroll-thumb--vertical' />}
        renderView={(props: object) => <div {...props} className='vcv-ui-scroll-content' />}
        onScroll={this.props.onScroll}
        hideTracksWhenNotNeeded={this.state.showTracks}
      />
    )
  }
}
