import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

export default class Scrollbar extends React.Component {
  static propTypes = {
    content: PropTypes.number,
    onScroll: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.scrollRef = React.createRef();

    this.state = {
      showTracks: true
    }

    this.scrollTop = this.scrollTop.bind(this)
  }

  scrollTop(top) {
    window.scrollTo({ behavior: 'smooth', top: this.scrollRef.current.offsetTop + top })
  }

  render () {
    const scrollProps = Object.assign({}, this.props)
    const customStyle = {}
    delete scrollProps.initialScrollTop
    const scrollbarClasses = classNames({
      'vcv-ui-scroll': true,
      'vcv-ui-scroll--auto-height': this.props.autoHeight,
      'vcv-ui-tree-layout-filled': Object.prototype.hasOwnProperty.call(this.props, 'content') && this.props.content
    })

    if (scrollProps.maxHeight) {
      customStyle.maxHeight = scrollProps.maxHeight
    }

    return (
      <div
        ref={this.scrollRef}
        className={scrollbarClasses}
        style={customStyle}
      >
        <div
          onScroll={this.props.onScroll}
          className='vcv-ui-scroll-content' style={customStyle}
        >
          {this.props.children}
        </div>
      </div>
    )
  }
}
