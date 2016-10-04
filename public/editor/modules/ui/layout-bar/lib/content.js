import React from 'react'
import classNames from 'classnames'
import BarContentStart from './content-start'
import BarContentEnd from './content-end'

class BarContent extends React.Component {
  state = {
    hasStartContent: false,
    hasEndContent: false
  }

  componentDidMount () {
    this.props.api
      .addAction('setStartContentVisible', (isVisible) => {
        if (isVisible) {
          this.props.api.request('bar-content-start:show')
        } else {
          this.props.api.request('bar-content-start:hide')
        }
      })
      .addAction('setEndContentVisible', (isVisible, key = null) => {
        if (isVisible) {
          this.props.api.request('bar-content-end:show', key)
        } else {
          this.props.api.request('bar-content-end:hide')
        }
      })
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

  render () {
    let layoutClasses = classNames({
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

export default BarContent
