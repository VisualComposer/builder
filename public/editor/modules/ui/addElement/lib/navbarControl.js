import React from 'react'
import classNames from 'classnames'
import {getData} from 'vc-cake'

class AddElementControl extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isWindowOpen: false
    }

    this.setWindowOpen = this.setWindowOpen.bind(this)
    this.setWindowClose = this.setWindowClose.bind(this)
    this.toggleAddElement = this.toggleAddElement.bind(this)
  }

  componentWillMount () {
    this.props.api
      .reply('bar-content-end:show', this.setWindowOpen)
      .reply('bar-content-end:hide', this.setWindowClose)
  }

  componentWillUnmount () {
    this.props.api
      .forget('bar-content-end:show', this.setWindowOpen)
      .forget('bar-content-end:hide', this.setWindowClose)
  }

  setWindowOpen (key) {
    this.setState({ isWindowOpen: key === 'add-element' })
  }

  setWindowClose () {
    this.setState({ isWindowOpen: false })
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
      'vcv-ui-state--active': !getData('lockActivity') && this.state.isWindowOpen
    })

    return (
      <a className={controlClass} href='#' title='Add Element' onClick={this.toggleAddElement}>
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
