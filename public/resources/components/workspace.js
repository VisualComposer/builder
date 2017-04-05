import React from 'react'
import ClassNames from 'classnames'
import {getStorage} from 'vc-cake'

import Resizer from '../../resources/resizer/resizer'

const workspaceStorageNavbarBoundingRectState = getStorage('workspace').state('navbarBoundingRect')

export default class Workspace extends React.Component {
  static propTypes = {
    showStart: React.PropTypes.bool,
    showEnd: React.PropTypes.bool,
    children: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  }

  resizeCallback = (e) => {
    if (e && e.direction) {
      const rect = workspaceStorageNavbarBoundingRectState
      if (e.direction === 'top') {
        rect.resizeTop = e.offsetY
        rect.set(rect)
      } else if (e.direction === 'left') {
        rect.resizeLeft = e.offsetX
        rect.set(rect)
      }
    }
  }

  render () {
    const {showStart, showEnd} = this.props
    let layoutClasses = ClassNames({
      'vcv-layout-bar': true,
      'vcv-ui-content--hidden': !(showEnd || showStart),
      'vcv-ui-content-start--visible': showStart,
      'vcv-ui-content-end--visible': showEnd
    })
    return (
      <div className={layoutClasses}>
        {this.props.children}
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
