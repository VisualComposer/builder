import React from 'react'
var BarContentEnd = React.createClass({
  propTypes: {
    api: React.PropTypes.object.isRequired
  },
  getInitialState () {
    return {
      contentComponent: null,
      contentProps: {}
    }
  },
  componentDidMount () {
    this.props.api.addAction('setEndContent', (Component, props = {}) => {
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
      <div className='vcv-layout-bar-content-end' id='vcv-editor-end'>
        {content}
      </div>
    )
  }
})
module.exports = BarContentEnd
