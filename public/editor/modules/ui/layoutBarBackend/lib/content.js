import React from 'react'
import classNames from 'classnames'
import BarContentStart from './content-start'
import BarContentEnd from './content-end'
import { getData } from 'vc-cake'

export default class BarContent extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    layoutWidth: React.PropTypes.number.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      stack: false,
      hasStartContent: false,
      hasEndContent: false
    }
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
        if (getData('lockActivity')) {
          return
        }
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

  componentWillReceiveProps (nextProps) {
    if (nextProps.layoutWidth < 800 && !this.state.stack) {
      this.setState({ stack: true })
    } else if (nextProps.layoutWidth > 800 && this.state.stack) {
      this.setState({ stack: false })
    }
  }

  render () {
    let { hasStartContent, hasEndContent, stack } = this.state
    let layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': hasStartContent || hasEndContent,
      'vcv-layout-bar-content-stack': stack
    })

    return (
      <div className={layoutClasses}>
        <BarContentStart api={this.props.api} />
        <BarContentEnd api={this.props.api} />
      </div>
    )
  }
}
