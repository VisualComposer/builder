/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ClassNames from 'classnames'
var BarContentStart = React.createClass({
  propTypes: {
    api: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      contentComponent: null,
      contentProps: {},
      showContent: false
    }
  },
  componentDidMount () {
    this.props.api.addAction('setStartContent', (Component, props = {}) => {
      this.setState({
        contentComponent: Component,
        contentProps: props
      })
    })
    this.props.api
      .on('start:show', function () {
        this.setState({ showContent: true })
      }.bind(this))
      .on('start:hide', function () {
        this.setState({ showContent: false })
      }.bind(this))
      .on('start:toggle', function () {
        this.setState({ showContent: !this.state.showContent })
      }.bind(this))
  },
  render () {
    let content = null
    if (this.state.contentComponent) {
      content = React.createElement(this.state.contentComponent, this.state.contentProps)
    }
    let contentClasses = ClassNames({
      'vcv-layout-bar-content-start': true,
      'vcv-ui-state--visible': this.state.showContent
    })
    return (
      <div className={contentClasses} id="vcv-editor-start">
        {content}
      </div>
    )
  }
})
module.exports = BarContentStart
