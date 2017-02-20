import React from 'react'
import classNames from 'classnames'
import ContentStart from './contentStart'
import ContentEnd from './contentEnd'

export default class Content extends React.Component {
  static propTypes = {
    start: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ]),
    end: React.PropTypes.oneOfType([
      React.PropTypes.arrayOf(React.PropTypes.node),
      React.PropTypes.node
    ])
  }
  state = {
    hasStartContent: false,
    hasEndContent: false
  }

  componentDidMount () {
    /*
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
      */
  }

  render () {
    const {start, end} = this.props
    let layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': this.state.hasStartContent || this.state.hasEndContent
    })

    return (
      <div className={layoutClasses}>
        <ContentStart>
          {start}
        </ContentStart>
        <ContentEnd>
          {end}
        </ContentEnd>
      </div>
    )
  }
}
