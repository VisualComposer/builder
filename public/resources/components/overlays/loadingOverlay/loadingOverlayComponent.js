import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export default class LoadingOverlayComponent extends React.Component {
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
      let layoutHeader = document.getElementById('vcv-layout-header')
      layoutHeader.style.pointerEvents = 'none'
    }
    if (this.props.hideLayoutBar) {
      document.body.classList.add('vcv-loading-overlay--enabled')
    }
  }

  componentWillUnmount () {
    const modalRoot = document.querySelector(this.props.parent || '.vcv-layout-iframe-container')
    modalRoot.removeChild(this.el)
    if (this.props.disableNavBar) {
      let layoutHeader = document.getElementById('vcv-layout-header')
      layoutHeader.style.pointerEvents = ''
    }
    if (this.props.hideLayoutBar) {
      document.body.classList.remove('vcv-loading-overlay--enabled')
    }
  }

  render () {
    let overlayClasses = {
      'vcv-loading-overlay': true,
      ...this.props.extraClassNames || {}
    }

    return ReactDOM.createPortal(
      <div className={classNames(overlayClasses)}>
        <div className='vcv-loading-overlay-inner'>
          <div className='vcv-loading-dots-container'>
            <div className='vcv-loading-dot vcv-loading-dot-1' />
            <div className='vcv-loading-dot vcv-loading-dot-2' />
          </div>
        </div>
      </div>,
      this.el
    )
  }
}
