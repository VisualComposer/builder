/*eslint jsx-quotes: [2, "prefer-double"]*/
import React from 'react'
import ClassNames from 'classnames'
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
      .on('end:show', function () {
        this.setState({ showContent: true })
      }.bind(this))
      .on('end:hide', function () {
        this.setState({ showContent: false })
      }.bind(this))
  }

  toggleStartContent () {
    this.props.api.notify('start:toggle')
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
        <a className="vcv-layout-bar-content-toggle" href="#" title="Toggle tree view" onClick={this.toggleStartContent.bind(this)}>
          <i className="vcv-layout-bar-content-toggle-icon vcv-ui-icon vcv-ui-icon-layers"></i>
        </a>
        {content}
      </div>
    )
  }
}

BarContentEnd.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = BarContentEnd

