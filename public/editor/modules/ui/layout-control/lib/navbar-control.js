import React from 'react'
import classNames from 'classnames'
import LayoutItemGroup from './navbar-item'

class LayoutButtonControl extends React.Component {
  state = {
    devices: [
      {
        type: 'Desktop',
        viewport: '1200',
        disabled: false
      },
      {
        type: 'Tablet Landscape',
        viewport: '992',
        disabled: false
      },
      {
        type: 'Tablet Portrait',
        viewport: '768',
        disabled: false
      },
      {
        type: 'Mobile Landscape',
        viewport: '544',
        disabled: false
      },
      {
        type: 'Mobile Portrait',
        viewport: '320',
        disabled: false
      }
    ],
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
    this.state.devices.forEach((item, index) => {
      if (windowWidth > item.viewport && windowWidth > 320) {
        devices.push(index)
      } else if (windowWidth <= 320) {
        devices.push(this.state.devices.length - 1)
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
    this.setViewport(this.state.devices[index].viewport)
    this.setState({
      activeDevice: index
    })
  }

  setViewport (width) {
    let iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    let actualWidth = width + 'px'

    if (width === this.state.devices[this.checkDevice()].viewport) {
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

    this.state.devices.forEach((item, index) => {
      let controlViewport = item.viewport

      if (windowWidth < controlViewport) {
        if (this.state.devices[activeDevice] === item) {
          activeDevice++

          if (activeDevice === this.state.devices.length) {
            activeDevice--
          }
        }
      } else {
        if (this.state.devices[activeDevice - 1] === item) {
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
      `vcv-ui-icon-${this.state.devices[this.state.activeDevice].type.replace(/\s+/g, '-').toLowerCase()}`
    )

    let activeDevice = (
      <span className='vcv-ui-navbar-control-content'>
        <i className={controlIconClasses} />
        <span>{this.state.devices[this.state.activeDevice].type} control</span>
      </span>
    )

    let navbarControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-dropdown-linear': true,
      'vcv-ui-navbar-hidden-sm': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-control-hidden': !this.state.displayDropdown
    })

    return (
      <dl className={navbarControlClasses} tabIndex='0'>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control' title={this.state.devices[this.state.activeDevice].type}>
          {activeDevice}
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content'>
          <LayoutItemGroup devices={this.state.devices} onChange={this.setSelectedLayout} />
        </dd>
      </dl>
    )
  }
}

export default LayoutButtonControl
