import ClassNames from 'classnames'
import React from 'react'
import Resizer from '../../../../resources/resizer/resizer'
import Content from './content/content'
import NavbarContainer from './navbar/navbarContainer'
import {getStorage} from 'vc-cake'

const workspace = getStorage('workspace')

export default class Workspace extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      contentStart: false,
      contentEnd: false
    }
    this.setContentStart = this.setContentStart.bind(this)
    this.setContentEnd = this.setContentEnd.bind(this)
  }
  componentDidMount () {
    workspace.state('contentStart').onChange(this.setContentStart)
    workspace.state('contentEnd').onChange(this.setContentEnd)
  }
  componentWillUnmount () {
    workspace.state('contentStart').ignoreChange(this.setContentStart)
    workspace.state('contentEnd').ignoreChange(this.setContentEnd)
  }
  setContentEnd (value) {
    this.setState({contentEnd: value || false})
  }
  setContentStart (value) {
    this.setState({contentStart: value || false})
  }
  resizeCallback = (e) => {
    if (e && e.direction) {
      if (e.direction === 'top') {
        // this.props.api.request('navbar:resizeTop', e.offsetY)
      } else if (e.direction === 'left') {
        // this.props.api.request('navbar:resizeLeft', e.offsetX)
      }
    }
  }

  render () {
    const {contentStart, contentEnd} = this.state
    let layoutClasses = ClassNames({
      'vcv-layout-bar': true,
      'vcv-ui-content--hidden': !(contentEnd || contentStart),
      'vcv-ui-content-start--visible': !!contentStart,
      'vcv-ui-content-end--visible': !!contentEnd
    })
    return (
      <div className={layoutClasses}>
        <NavbarContainer />
        <Content
          start={
          contentStart
        }
          end={
          contentEnd
        }
        />
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
