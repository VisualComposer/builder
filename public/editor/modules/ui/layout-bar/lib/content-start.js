import React from 'react'
var BarContentStart = React.createClass({
  propTypes: {
    api: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      contentComponent: null,
      contentProps: {},
      contentHidden: true
    }
  },
  componentDidMount () {
    this.props.api.addAction('setStartContent', (Component, props = {}) => {
      this.setState({
        contentComponent: Component,
        contentProps: props
      })
    })
    // TODO: rewrite to use states for smooth show/hide
    this.props.api
      .on('content:show', () => {
        this.setState({ contentHidden: false })
      })
      .on('content:hide', () => {
        this.setState({ contentHidden: true })
      })
  },
  render () {
    let content = null
    if (this.state.contentComponent) {
      content = React.createElement(this.state.contentComponent, this.state.contentProps)
    }
    return (
      <div className='vcv-layout-bar-content-start' id='vcv-editor-start'>
        {content}
      </div>
    )
  }
})
module.exports = BarContentStart
