/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ClassNames from 'classnames'
import ReactDOM from 'react-dom'
import Resizer from '../../../content/resizer/component/resizer'

class BarContentEnd extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      contentComponent: null,
      contentProps: {},
      showContent: false,
      realWidth: 0
    }
    this.handleElementResize = this.handleElementResize.bind(this)
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
    this.addResizeListener(ReactDOM.findDOMNode(this), this.handleElementResize)
    this.handleElementResize()
  }

  componentWillUnmount () {
    this.removeResizeListener(ReactDOM.findDOMNode(this), this.handleElementResize)
  }

  handleElementResize () {
    let element = ReactDOM.findDOMNode(this)
    this.setState({
      realWidth: element.offsetWidth
    })
  }

  addResizeListener (element, fn) {
    let isIE = !!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/Edge/))
    if (window.getComputedStyle(element).position === 'static') {
      element.style.position = 'relative'
    }
    var obj = element.__resizeTrigger__ = document.createElement('object')
    obj.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;')
    obj.__resizeElement__ = element
    obj.onload = function (e) {
      this.contentDocument.defaultView.addEventListener('resize', fn)
    }
    obj.type = 'text/html'
    if (isIE) {
      element.appendChild(obj)
    }
    obj.data = 'about:blank'
    if (!isIE) {
      element.appendChild(obj)
    }
  }

  removeResizeListener (element, fn) {
    element.__resizeTrigger__.contentDocument.defaultView.removeEventListener('resize', fn)
    element.__resizeTrigger__ = !element.removeChild(element.__resizeTrigger__)
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
      'vcv-ui-state--visible': this.state.showContent,
      'vcv-media--xs': true,
      'vcv-media--sm': this.state.realWidth > 400,
      'vcv-media--md': this.state.realWidth > 800,
      'vcv-media--lg': this.state.realWidth > 1200,
      'vcv-media--xl': this.state.realWidth > 1600
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

