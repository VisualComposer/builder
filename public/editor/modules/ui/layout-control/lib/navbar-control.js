import React from 'react'
import classNames from 'classnames'
import LayoutItem from './navbar-item'

class LayoutButtonControl extends React.Component {
  static defaultProps = {
    devices: [
      {
        type: 'Desktop',
        className: 'desktop',
        viewport: '1200'
      },
      {
        type: 'Tablet Landscape',
        className: 'tablet-landscape',
        viewport: '992'
      },
      {
        type: 'Tablet Portrait',
        className: 'tablet-portrait',
        viewport: '768'
      },
      {
        type: 'Mobile Landscape',
        className: 'mobile-landscape',
        viewport: '544'
      },
      {
        type: 'Mobile Portrait',
        className: 'mobile-portrait',
        viewport: '320'
      }
    ]
  }
  state = {
    activeDevice: 0,
    layoutSelected: false,
    displayDropdown: true
  }

  componentDidMount () {
    this.changeOnResize()
    this.setActualDevice(this.checkActualDevice())
  }

  changeOnResize () {
    window.addEventListener('resize', (e) => {
      if (!this.state.layoutSelected) {
        this.setActualDevice(this.checkActualDevice())
      }
    })
  }

  checkDevice () {
    let windowWidth = this.checkWindowWidth()
    let devices = []
    this.props.devices.forEach((item, index) => {
      if (windowWidth > item.viewport && windowWidth > this.props.devices[this.props.devices.length - 1].viewport) {
        devices.push(index)
      } else if (windowWidth <= this.props.devices[this.props.devices.length - 1].viewport) {
        devices.push(this.props.devices.length - 1)
      }
    })
    return devices[0]
  }

  setActualDevice (index) {
    this.setState({
      activeDevice: index
    })
  }

  setSelectedLayout = (index) => {
    this.setViewport(this.props.devices[index].viewport)
    this.setState({
      activeDevice: index
    })
  }

  setViewport (width) {
    let iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    let actualWidth = width + 'px'

    if (width === this.props.devices[this.checkDevice()].viewport) {
      actualWidth = ''
      this.setState({
        layoutSelected: false
      })
    } else {
      this.setState({
        layoutSelected: true
      })
    }
    iframeContainer.style.width = actualWidth
  }

  checkWindowWidth () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  }

  checkActualDevice () {
    let windowWidth = this.checkWindowWidth()
    let activeDevice = this.state.activeDevice

    this.props.devices.forEach((item) => {
      let controlViewport = item.viewport

      if (windowWidth < controlViewport) {
        if (this.props.devices[activeDevice] === item) {
          activeDevice++

          if (activeDevice === this.props.devices.length) {
            activeDevice--
          }
        }
      } else {
        if (this.props.devices[activeDevice - 1] === item) {
          activeDevice--
        }
      }
    })
    return activeDevice
  }

  render () {
    let controlIconClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      'vcv-ui-icon-' + this.props.devices[this.state.activeDevice].className
    )

    let activeDevice = (
      <span className='vcv-ui-navbar-control-content'>
        <i className={controlIconClasses} />
        <span>{this.props.devices[this.state.activeDevice].type} control</span>
      </span>
    )

    let navbarControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-dropdown-linear': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-control-hidden': !this.state.displayDropdown
    })

    return (
      <dl className={navbarControlClasses} tabIndex='0'>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control' title={this.props.devices[this.state.activeDevice].type}>
          {activeDevice}
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content'>
          <LayoutItem devices={this.props.devices} onChange={this.setSelectedLayout} />
        </dd>
      </dl>
    )
  }
}

export default LayoutButtonControl
