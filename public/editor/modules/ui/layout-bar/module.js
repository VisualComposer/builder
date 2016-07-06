import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import BarContent from './lib/content'
import BarHeader from './lib/header'
import Resizer from '../../content/resizer/component/resizer'

vcCake.add('ui-layout-bar', (api) => {
  class LayoutBar extends React.Component {
    render () {
      return (
        <div className='vcv-layout-bar'>
          <BarHeader api={api} />
          <BarContent api={api} />

          <Resizer params={{
            resizeTop: true,
            resizerTargetTop: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-top'
          }} />
          <Resizer params={{
            resizeBottom: true,
            resizerTargetBottom: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-bottom'
          }} />

          <Resizer params={{
            resizeLeft: true,
            resizeTop: true,
            resizerTarget: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-top'
          }} />
          <Resizer params={{
            resizeLeft: true,
            resizerTargetLeft: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left'
          }} />
          <Resizer params={{
            resizeLeft: true,
            resizeBottom: true,
            resizerTarget: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-left-bottom'
          }} />

          <Resizer params={{
            resizeRight: true,
            resizeTop: true,
            resizerTarget: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-ne vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-top'
          }} />
          <Resizer params={{
            resizeRight: true,
            resizerTargetRight: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right'
          }} />
          <Resizer params={{
            resizeRight: true,
            resizeBottom: true,
            resizerTarget: '.vcv-layout-bar',
            resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-nw vcv-ui-resizer-layout-placement-detached vcv-ui-resizer-layout-bar-right-bottom'
          }} />
        </div>
      )
    }
  }
  module.exports = (LayoutBar)

  let layoutHeader = document.querySelector('#vcv-layout-header')
  ReactDOM.render(
    <LayoutBar />,
    layoutHeader
  )
})
