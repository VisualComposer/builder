import React from 'react'
import classNames from 'classnames'

class TreeViewNavbarControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      controlActive: false,
      data: []
    }
  }

  componentDidMount () {
    this.props.api
      .reply('bar-content-start:show', () => {
        this.setState({ controlActive: true })
      })
      .reply('bar-content-start:hide', () => {
        this.setState({ controlActive: false })
      })
  }

  toggleTreeView (e) {
    this.props.api.request('bar-content-start:toggle')
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.controlActive
    })

    return (
      <a className={controlClass} href='#' title='Tree View' onClick={this.toggleTreeView.bind(this)}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers'></i>
          <span>Tree View</span>
        </span>
      </a>
    )
  }
}
TreeViewNavbarControl.propTypes = {
  api: React.PropTypes.object.isRequired
}

module.exports = TreeViewNavbarControl
