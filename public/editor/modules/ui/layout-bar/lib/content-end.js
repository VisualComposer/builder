import React from 'react'
import ClassNames from 'classnames'
var BarContentEnd = React.createClass({
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
    this.props.api.addAction('setEndContent', (Component, props = {}) => {
      this.setState({
        contentComponent: Component,
        contentProps: props
      })
    })
    this.props.api
      .on('end:show', function () {
        this.setState({ showContent: true })
      }.bind(this))
      .on('end:hide', function () {
        this.setState({ showContent: false })
      }.bind(this))
  },
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
      <div className={contentClasses} id='vcv-editor-end'>
        {content}
      </div>
    )
  }
})
module.exports = BarContentEnd
