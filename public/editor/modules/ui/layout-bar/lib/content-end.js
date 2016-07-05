/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ClassNames from 'classnames'
import Resizer from '../../../content/resizer/component/resizer'

class BarContentEnd extends React.Component {
  constructor () {
    super()
    this.state = {
      contentComponent: null,
      contentProps: {},
      showContent: false
    }
  }

  componentDidMount () {
    this.props.api.addAction('setEndContent', (Component, props = {}) => {
      this.setState({
        contentComponent: Component,
        contentProps: props
      })
    })
    this.props.api
      .reply('bar-content-end:show', () => {
        this.setState({ showContent: true })
      })
      .reply('bar-content-end:hide', () => {
        this.setState({ showContent: false })
      })
  }

  toggleStartContent () {
    this.props.api.request('bar-content-start:toggle')
  }

  render () {
    let content = null
    if (this.state.contentComponent) {
      content = React.createElement(this.state.contentComponent, this.state.contentProps)
    }
    let contentClasses = ClassNames({
      'vcv-layout-bar-content-end': true,
      'vcv-ui-state--visible': this.state.showContent
    })
    return (
      <div className={contentClasses} id="vcv-editor-end">
        <a className="vcv-layout-bar-content-toggle" href="#" title="Toggle tree view"
          onClick={this.toggleStartContent.bind(this)}>
          <i className="vcv-layout-bar-content-toggle-icon vcv-ui-icon vcv-ui-icon-layers"></i>
        </a>
        {content}
        <Resizer params={{
          resizeBottom: true,
          resizerTargetBottom: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-top vcv-ui-resizer-content-end-bottom'
        }} />

        <Resizer params={{
          resizeRight: true,
          resizerTargetRight: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-left vcv-ui-resizer-content-end-right'
        }} />

        <Resizer params={{
          resizeLeft: true,
          resizerTargetLeft: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-e vcv-ui-resizer-layout-placement-right vcv-ui-resizer-content-end-left'
        }} />

        <Resizer params={{
          resizeTop: true,
          resizerTargetTop: '.vcv-layout-bar-content',
          resizerClasses: 'vcv-ui-resizer vcv-ui-resizer-n vcv-ui-resizer-layout-placement-bottom vcv-ui-resizer-content-end-top'
        }} />
      </div>
    )
  }
}

BarContentEnd.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = BarContentEnd

