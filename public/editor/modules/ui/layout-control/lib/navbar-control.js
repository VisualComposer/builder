import React from 'react'
import classNames from 'classnames'
import LayoutItemGroup from './navbar-item'

class LayoutButtonControl extends React.Component {
  state = {
    devices: [
      {
        type: 'Desktop',
        viewport: '',
        disabled: false
      },
      {
        type: 'Tablet Landscape',
        viewport: '992px',
        disabled: false
      },
      {
        type: 'Tablet Portrait',
        viewport: '768px',
        disabled: false
      },
      {
        type: 'Mobile Landscape',
        viewport: '544px',
        disabled: false
      },
      {
        type: 'Mobile Portrait',
        viewport: '320px',
        disabled: false
      }
    ],
    activeDevice: 0,
    displayDropdown: true,
    layoutSelected: false
  }

  componentDidMount () {
    this.disableViewport()

    window.addEventListener('resize', (e) => {
      this.disableViewport()
    })
  }

  setDefaultLayout = (index) => {
    this.setViewport('')
    this.setState({
      activeDevice: index,
      layoutSelected: false
    })
  }

  setSelectedLayout = (index) => {
    if (index !== false) {
      this.setViewport(this.state.devices[index].viewport)
      this.setState({
        activeDevice: index,
        layoutSelected: true
      })
    } else {
      this.setDefaultLayout(0)
    }
  }

  setViewport (width) {
    let iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    iframeContainer.style.width = width
  }

  checkWindowWidth () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  }

  disableViewport () {
    let windowWidth = this.checkWindowWidth()
    let disabledCount = 0
    let activeDevice = this.state.activeDevice

    this.state.devices.forEach((item, index) => {
      let devices = this.state.devices
      let controlViewport = item.viewport.split('px')[0] || 1200

      if (windowWidth < controlViewport) {
        devices[index].disabled = true
        disabledCount++

        if (this.state.devices[activeDevice] === item) {
          activeDevice++

          if (activeDevice === this.state.devices.length) {
            activeDevice--
          }
        }
      } else {
        devices[index].disabled = false
        disabledCount--

        if (this.state.devices[activeDevice - 1] === item) {
          activeDevice--
        }
      }

      this.setState({ devices, activeDevice })
    })

    if (this.state.layoutSelected) {
      this.setSelectedLayout(this.state.activeDevice)
    } else {
      this.setDefaultLayout(this.state.activeDevice)
    }

    if (this.state.devices.length === disabledCount) {
      this.removeControl()
    } else {
      this.showControl()
    }
  }

  removeControl () {
    this.setState({
      displayDropdown: false
    })
  }

  showControl () {
    this.setState({
      displayDropdown: true
    })
  }

  render () {
    let controlClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      `vcv-ui-icon-${this.state.devices[this.state.activeDevice].type.replace(/\s+/g, '-').toLowerCase()}`
    )

    let activeDevice = (
      <span className='vcv-ui-navbar-control-content'>
        <i className={controlClasses} />
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
      <dl className={navbarControlClasses} tabIndex='0' disabled>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control' title={this.state.devices[this.state.activeDevice].type}>
          {activeDevice}
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content'>
          <LayoutItemGroup devices={this.state.devices} onChange={this.setSelectedLayout} layoutSelected={this.state.layoutSelected} />
        </dd>
      </dl>
    )
  }
}

export default LayoutButtonControl
