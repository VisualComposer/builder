import React from 'react'
import classNames from 'classnames'
import ContentStart from './contentStart'
import ContentEnd from './contentEnd'
import {getData} from 'vc-cake'

export default class Content extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired
  }
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

  render () {
    let layoutClasses = classNames({
      'vcv-layout-bar-content': true,
      'vcv-ui-state--visible': this.state.hasStartContent || this.state.hasEndContent
    })

    return (
      <div className={layoutClasses}>
        <ContentStart api={this.props.api} />
        <ContentEnd api={this.props.api} />
      </div>
    )
  }
}
