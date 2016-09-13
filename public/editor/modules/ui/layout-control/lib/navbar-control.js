import React from 'react'
import classNames from 'classnames'
import LayoutItemGroup from './navbar-item'

class LayoutButtonControl extends React.Component {
  state = {
    devices: [
      {
        type: 'Desktop',
        viewport: 1200,
        disabled: false
      },
      {
        type: 'Tablet Landscape',
        viewport: 992,
        disabled: false
      },
      {
        type: 'Tablet Portrait',
        viewport: 768,
        disabled: false
      },
      {
        type: 'Mobile Landscape',
        viewport: 544,
        disabled: false
      },
      {
        type: 'Mobile Portrait',
        viewport: 320,
        disabled: false
      }
    ],
    activeDevice: 0,
    displayDropdown: true
  }

  componentDidMount () {
    this.setViewport(this.state.devices[this.state.activeDevice].viewport)
    this.disableViewport()

    window.addEventListener('resize', (e) => {
      this.disableViewport()
    })
  }

  setActiveDevice = (index) => {
    this.setViewport(this.state.devices[index].viewport)
    this.setState({
      activeDevice: index
    })
  }

  setViewport (width) {
    let container = document.querySelector('.vcv-layout-iframe-container')
    let content = document.querySelector('.vcv-layout-content')
    container.style.maxWidth = `${width}px`
    container.style.alignSelf = 'center'
    content.style.background = '#eee'
  }

  checkWindowWidth () {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
  }

  disableViewport () {
    let windowWidth = this.checkWindowWidth()
    let disabledCount = 0

    this.state.devices.forEach((item, index) => {
      let devices = this.state.devices

      if (windowWidth < item.viewport) {
        devices[index].disabled = true
        disabledCount++
      } else {
        devices[index].disabled = false
        disabledCount--
      }

      this.setState({ devices })
    })

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
    let dropDown = ''
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

    if (this.state.displayDropdown) {
      dropDown = (
        <dl className='vcv-ui-navbar-dropdown-inner'>
          <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control' title={this.state.devices[this.state.activeDevice].type}>
            {activeDevice}
          </dt>
          <dd className='vcv-ui-navbar-dropdown-content'>
            <LayoutItemGroup devices={this.state.devices} onChange={this.setActiveDevice} />
          </dd>
        </dl>
      )
    }

    return (
      <div className='vcv-ui-navbar-dropdown vcv-ui-navbar-dropdown-linear vcv-ui-navbar-hidden-sm vcv-ui-pull-end' tabIndex='0' disabled>
        {dropDown}
      </div>
    )
  }
}

export default LayoutButtonControl
