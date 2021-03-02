import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspace')

export default class TransparentOverlayComponent extends React.Component {
  static propTypes = {
    parent: PropTypes.string,
    hideLayoutBar: PropTypes.bool,
    disableNavBar: PropTypes.bool,
    extraClassNames: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount () {
    const modalRoot = document.querySelector(this.props.parent || '.vcv-layout-iframe-container')
    modalRoot.appendChild(this.el)
    if (this.props.disableNavBar) {
      const layoutHeader = document.getElementById('vcv-layout-header')
      layoutHeader.style.pointerEvents = 'none'
      workspaceStorage.state('isNavbarDisabled').set(true)
    }
    if (this.props.hideLayoutBar) {
      document.body.classList.add('vcv-overlay--enabled')
    }
  }

  componentWillUnmount () {
    const modalRoot = document.querySelector(this.props.parent || '.vcv-layout-iframe-container')
    modalRoot.removeChild(this.el)
    if (this.props.disableNavBar) {
      const layoutHeader = document.getElementById('vcv-layout-header')
      layoutHeader.style.pointerEvents = ''
      workspaceStorage.state('isNavbarDisabled').set(false)
    }
    if (this.props.hideLayoutBar) {
      document.body.classList.remove('vcv-overlay--enabled')
    }
  }

  render () {
    const overlayClasses = {
      'vcv-overlay': true,
      ...this.props.extraClassNames || {}
    }

    return ReactDOM.createPortal(
      <div className={classNames(overlayClasses)} />,
      this.el
    )
  }
}
