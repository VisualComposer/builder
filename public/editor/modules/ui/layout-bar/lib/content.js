import React from 'react'
import ClassNames from 'classnames'
import BarContentStart from './content-start'
import BarContentEnd from './content-end'

class BarContent extends React.Component {
  constructor () {
    super()
    this.state = {
      hasStartContent: false,
      hasEndContent: false
    }
  }

  componentDidMount () {
    this.props.api.addAction('setStartContentVisible', (isVisible) => {
      this.setState({
        hasStartContent: isVisible
      })
      if (isVisible) {
        this.props.api.notify('start:show')
        this.props.api.request('bar-content-start:show')
      } else {
        this.props.api.notify('start:hide')
        this.props.api.request('bar-content-start:hide')
      }
    })
    this.props.api.addAction('setEndContentVisible', (isVisible) => {
      this.setState({
        hasEndContent: isVisible
      })
      // notify local events
      if (isVisible) {
        this.props.api.notify('end:show')
        this.props.api.request('bar-content-end:show')
      } else {
        this.props.api.notify('end:hide')
        this.props.api.request('bar-content-end:hide')
      }
    })
  }

  render () {
    let layoutClasses = ClassNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': this.state.hasStartContent || this.state.hasEndContent
    })
    return (
      <div className={layoutClasses}>
        <BarContentStart api={this.props.api} />
        <BarContentEnd api={this.props.api} />
      </div>
    )
  }
}

BarContent.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = BarContent
