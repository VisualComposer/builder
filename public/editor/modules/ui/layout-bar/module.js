import vcCake from 'vc-cake'
import React from 'react'
import ReactDOM from 'react-dom'
import BarContent from './lib/content'
import BarHeader from './lib/header'
import Resizer from '../../content/resizer/component/resizer'
import ClassNames from 'classnames'

class LayoutBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      hasStartContent: false,
      hasEndContent: false
    }
    this.resizeCallback = this.resizeCallback.bind(this)
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
  }

  resizeCallback (e) {
    if (e && e.direction) {
      if (e.direction === 'top') {
        this.props.api.request('navbar:resizeTop', e.offsetY)
      } else if (e.direction === 'left') {
        this.props.api.request('navbar:resizeLeft', e.offsetX)
      }
    }
  }

  render () {
    let layoutClasses = ClassNames({
      'vcv-layout-bar': true,
      'vcv-ui-content--hidden': !(this.state.hasStartContent || this.state.hasEndContent),
      'vcv-ui-content-start--visible': this.state.hasStartContent,
      'vcv-ui-content-end--visible': this.state.hasEndContent
    })
    return (
      <div className={layoutClasses}>
        <BarHeader api={this.props.api} />
        <BarContent api={this.props.api} />

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

LayoutBar.propTypes = {
  api: React.PropTypes.object.isRequired
}

vcCake.add('ui-layout-bar', (api) => {
  let layoutHeader = document.querySelector('#vcv-layout-header')
  ReactDOM.render(
    <LayoutBar api={api} />,
    layoutHeader
  )
})

module.exports = (LayoutBar)

