import React from 'react'
import ReactDOM from 'react-dom'

export default class LoadingComponent extends React.Component {
  constructor (props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount () {
    const modalRoot = document.querySelector('.vcv-layout-iframe-container')
    modalRoot.appendChild(this.el)
    let layoutHeader = document.getElementById('vcv-layout-header')
    layoutHeader.style.pointerEvents = 'none'
  }

  componentWillUnmount () {
    const modalRoot = document.querySelector('.vcv-layout-iframe-container')
    modalRoot.removeChild(this.el)
    let layoutHeader = document.getElementById('vcv-layout-header')
    layoutHeader.style.pointerEvents = ''
  }

  render () {
    return ReactDOM.createPortal(
      <div className='vcv-loading-overlay'>
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
