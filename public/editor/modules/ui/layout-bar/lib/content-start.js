/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ClassNames from 'classnames'
class BarContentStart extends React.Component {
  constructor () {
    super()
    this.state = {
      contentComponent: null,
      contentProps: {},
      showContent: false
    }
  }

  componentDidMount () {
    this.props.api.addAction('setStartContent', (Component, props = {}) => {
      this.setState({
        contentComponent: Component,
        contentProps: props
      })
    })
    this.props.api
      .reply('bar-content-start:show', () => {
        this.setState({ showContent: true })
      })
      .reply('bar-content-start:hide', () => {
        this.setState({ showContent: false })
      })
      .reply('bar-content-start:toggle', () => {
        if (this.state.showContent) {
          this.props.api.request('bar-content-start:hide')
        } else {
          this.props.api.request('bar-content-start:show')
        }
      })
  }

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
}

BarContentStart.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = BarContentStart
