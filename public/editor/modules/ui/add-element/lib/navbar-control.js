import React from 'react'
import classNames from 'classnames'

class AddElementControl extends React.Component {
  state = {
    isWindowOpen: false
  }

  componentWillMount () {
    this.props.api
      .on('show', () => {
        this.setState({ isWindowOpen: true })
      })
      .on('hide', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('app:edit', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('app:settings', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('bar-content-end:hide', () => {
        this.setState({ isWindowOpen: false })
      })
  }

  componentWillUnmount () {
    this.props.api
      .off('show', () => {
        this.setState({ isWindowOpen: true })
      })
      .off('hide', () => {
        this.setState({ isWindowOpen: false })
      })
      .forget('app:edit', () => {
        this.setState({ isWindowOpen: false })
      })
      .reply('app:settings', () => {
        this.setState({ isWindowOpen: false })
      })
      .forget('bar-content-end:hide', () => {
        this.setState({ isWindowOpen: false })
      })
  }

  toggleAddElement (e) {
    e && e.preventDefault()
    if (this.state.isWindowOpen) {
      this.props.api.notify('hide')
    } else {
      this.props.api.request('app:add', null)
    }
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isWindowOpen
    })

    return (
      <a className={controlClass} href='#' title='Add Element' onClick={this.toggleAddElement.bind(this)}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
          <span>Add Element</span>
        </span>
      </a>
    )
  }
}
AddElementControl.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default AddElementControl
