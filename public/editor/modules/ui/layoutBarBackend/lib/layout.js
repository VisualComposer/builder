import React from 'react'
import BarContent from './content'
import BarHeader from './header'
import Resizer from '../../../../../resources/resizer/resizer'
import ClassNames from 'classnames'

export default class LayoutBar extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    layoutHeader: React.PropTypes.object.isRequired
  }

  layoutBar = null

  constructor (props) {
    super(props)
    this.state = {
      hasStartContent: false,
      hasEndContent: false,
      isSticky: false,
      barLeftPos: null,
      berTopPos: null,
      barWidth: null,
      adminBarHeight: document.getElementById('wpadminbar').getBoundingClientRect().height
    }
    this.handleWindowScroll = this.handleWindowScroll.bind(this)
  }

  componentDidMount () {
    this.props.api
      .reply('bar-content-start:show', () => {
        this.setState({
          hasStartContent: true
        })
      })
      .reply('bar-content-start:hide', () => {
        this.setState({
          hasStartContent: false
        })
      })
      .reply('bar-content-end:show', () => {
        this.setState({
          hasEndContent: true
        })
      })
      .reply('bar-content-end:hide', () => {
        this.setState({
          hasEndContent: false
        })
      })
    window.addEventListener('scroll', this.handleWindowScroll)
  }

  componentWillUnmount () {
    window.removeEventListener('scroll', this.handleWindowScroll)
  }

  resizeCallback = (e) => {
    if (e && e.direction) {
      if (e.direction === 'top') {
        this.props.api.request('navbar:resizeTop', e.offsetY)
      } else if (e.direction === 'left') {
        this.props.api.request('navbar:resizeLeft', e.offsetX)
      }
    }
  }

  handleWindowScroll () {
    let { isSticky, adminBarHeight } = this.state
    let headerPos = this.props.layoutHeader.getBoundingClientRect()
    let bar = this.layoutBar.getBoundingClientRect()
    if (headerPos.top < adminBarHeight && !isSticky) {
      this.setState({
        isSticky: true,
        barLeftPos: headerPos.left,
        barTopPos: adminBarHeight,
        barWidth: headerPos.width
      })
    }
    if (headerPos.top > adminBarHeight + bar.height && isSticky) {
      this.setState({ isSticky: false })
    }
  }

  render () {
    let { hasStartContent, hasEndContent, isSticky, barTopPos, barLeftPos, barWidth } = this.state
    let { api } = this.props
    let layoutClasses = ClassNames({
      'vcv-layout-bar': true,
      'vcv-ui-content--hidden': !(hasStartContent || hasEndContent),
      'vcv-ui-content-start--visible': hasStartContent,
      'vcv-ui-content-end--visible': hasEndContent
    })
    let stickyBar = {}
    if (isSticky) {
      stickyBar = {
        position: 'fixed',
        top: `${barTopPos}px`,
        left: `${barLeftPos}px`,
        width: `${barWidth}px`
      }
    }
    return (
      <div className={layoutClasses} style={stickyBar} ref={(bar) => { this.layoutBar = bar }}>
        <BarHeader api={api} />
        <BarContent api={api} />

        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-bottom',
          callback: this.resizeCallback
        }} />

        <Resizer params={{
          resizeLeft: true,
          resizeTop: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeLeft: true,
          resizeBottom: true,
          resizerTargetLeft: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-bottom',
          callback: this.resizeCallback
        }} />

        <Resizer params={{
          resizeRight: true,
          resizeTop: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-top',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right',
          callback: this.resizeCallback
        }} />
        <Resizer params={{
          resizeRight: true,
          resizeBottom: true,
          resizerTargetRight: '.vcv-layout-bar',
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-bottom',
          callback: this.resizeCallback
        }} />
      </div>
    )
  }
}
