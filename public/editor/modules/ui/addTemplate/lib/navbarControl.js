import React from 'react'
import classNames from 'classnames'
import {getData} from 'vc-cake'

export default class AddTemplateNavbarControl extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    value: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isWindowOpen: false
    }
    this.toggleAddTemplate = this.toggleAddTemplate.bind(this)
    this.updateWindow = this.updateWindow.bind(this)
  }

  componentWillMount () {
    this.props.api
      .reply('bar-content-end:show', this.updateWindow)
      .reply('bar-content-end:hide', this.updateWindow)
  }

  componentWillUnmount () {
    this.props.api
      .forget('bar-content-end:show', this.updateWindow)
      .forget('bar-content-end:hide', this.updateWindow)
  }

  updateWindow (isOpen = false) {
    this.setState({ isWindowOpen: isOpen === 'add-template' })
  }

  toggleAddTemplate (e) {
    e && e.preventDefault()
    this.props.api.request('app:templates', !this.state.isWindowOpen)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': !getData('lockActivity') && this.state.isWindowOpen
    })

    return (
      <a
        className={controlClass}
        onClick={this.toggleAddTemplate}
        href='#'
        title='Template'
      >
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-template' />
          <span>Template</span>
        </span>
      </a>
    )
  }
}
