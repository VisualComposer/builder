import React from 'react'
import classNames from 'classnames'
import { Scrollbars } from 'react-custom-scrollbars'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspaceStorage')

export default class Scrollbar extends React.Component {
  static propTypes = {
    content: React.PropTypes.number
  }

  constructor (props) {
    super(props)
    this.state = {
      showTracks: true
    }
    this.handleEditFormStateChange = this.handleEditFormStateChange.bind(this)
  }

  componentDidMount () {
    workspaceStorage.state('scrollbarSettings').onChange(this.handleEditFormStateChange)
  }

  componentWillUnmount () {
    workspaceStorage.state('scrollbarSettings').ignoreChange(this.handleEditFormStateChange)
  }

  /**
   * React to scroll settings state change:
   * 1. Perform scroll
   * 2. Set state to trigger render() for hideTracksWhenNotNeeded prop
   * @param data
   */
  handleEditFormStateChange (data) {
    if (data && data.hasOwnProperty('scroll')) {
      this.refs.scrollbars.scrollToTop()
      this.scrollTop(data.scroll)
    }
    if (data && data.checkHeight) {
      this.setState({ showTracks: true })
    }
  }

  scrollTop (top) {
    console.log(this.refs.scrollbars)
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
        renderView={props => <div {...props} className='vcv-ui-scroll-content' />}
        hideTracksWhenNotNeeded={this.state.showTracks}
      />
    )
  }
}
