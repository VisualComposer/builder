import React from 'react'
import classNames from 'classnames'
import LayoutItem from './navbar-item'

class LayoutButtonControl extends React.Component {
  static devices = [
    {
      type: 'Desktop',
      className: 'desktop',
      viewport: {
        width: '1200',
        min: '1200',
        max: Infinity
      }
    },
    {
      type: 'Tablet Landscape',
      className: 'tablet-landscape',
      viewport: {
        width: '992',
        min: '992',
        max: '1199'
      }
    },
    {
      type: 'Tablet Portrait',
      className: 'tablet-portrait',
      viewport: {
        width: '768',
        min: '768',
        max: '991'
      }
    },
    {
      type: 'Mobile Landscape',
      className: 'mobile-landscape',
      viewport: {
        width: '554',
        min: '554',
        max: '767'
      }
    },
    {
      type: 'Mobile Portrait',
      className: 'mobile-portrait',
      viewport: {
        width: '320',
        min: '0',
        max: '553'
      }
    }
  ]

  state = {
    activeDevice: 0,
    layoutSelected: false,
    displayDropdown: true
  }

  componentDidMount () {
    this.setActualDevice()
    this.addResizeListener(window.document.querySelector('#vcv-editor-iframe').contentDocument.defaultView, this.setActualDevice)
  }

  componentWillUnmount () {
    this.removeResizeListener(window, this.unsetDesktop)
    this.removeResizeListener(window.document.querySelector('#vcv-editor-iframe').contentDocument.defaultView, this.setActualDevice)
  }

  unsetDesktop = () => {
    if (this.checkWindowWidth() >= LayoutButtonControl.devices[0].viewport.width) {
      this.setViewport('')
    }
  }

  addResizeListener (el, fn) {
    el.addEventListener('resize', fn)
  }

  removeResizeListener (el, fn) {
    el.removeEventListener('resize', fn)
  }

  checkDevice () {
    let windowWidth = this.checkWindowWidth()
    let devices = []
    LayoutButtonControl.devices.forEach((item, index) => {
      if (windowWidth > item.viewport.width && windowWidth > LayoutButtonControl.devices[LayoutButtonControl.devices.length - 1].viewport.width) {
        devices.push(index)
      } else if (windowWidth <= LayoutButtonControl.devices[LayoutButtonControl.devices.length - 1].viewport.width) {
        devices.push(LayoutButtonControl.devices.length - 1)
      }
    })
    return devices[0]
  }

  setActualDevice = (e, index = this.checkActualDevice()) => {
    if (!this.state.layoutSelected) {
      this.setState({
        activeDevice: index
      })
    }
  }

  setSelectedLayout = (index) => {
    this.setViewport(LayoutButtonControl.devices[index].viewport.width)
    this.setState({
      activeDevice: index
    })

    if (index === 0) {
      this.addResizeListener(window, this.unsetDesktop)
    } else {
      this.removeResizeListener(window, this.unsetDesktop)
    }
  }

  setViewport (width) {
    let iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    let actualWidth = width + 'px'

    if (width === LayoutButtonControl.devices[this.checkDevice()].viewport.width || width === '') {
      actualWidth = ''
      setTimeout(() => {
        this.setState({
          layoutSelected: false
        })
      }, 250)
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

  checkIframeWidth () {
    return window.document.querySelector('#vcv-editor-iframe').offsetWidth
  }

  checkActualDevice () {
    let iframeWidth = this.checkIframeWidth()
    let activeDevice = this.state.activeDevice

    LayoutButtonControl.devices.forEach((item, i) => {
      let controlViewport = item.viewport
      if (iframeWidth > controlViewport.min && iframeWidth < controlViewport.max) {
        activeDevice = i
      }
    })
    return activeDevice
  }

  render () {
    let controlIconClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      'vcv-ui-icon-' + LayoutButtonControl.devices[this.state.activeDevice].className
    )

    let activeDevice = (
      <span className='vcv-ui-navbar-control-content'>
        <i className={controlIconClasses} />
        <span>{LayoutButtonControl.devices[this.state.activeDevice].type}</span>
      </span>
    )

    let navbarControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-dropdown-linear': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-navbar-control-hidden': !this.state.displayDropdown
    })

    let layoutItems = []
    LayoutButtonControl.devices.forEach((item, index) => {
      layoutItems.push(
        <LayoutItem key={index} device={item} index={index} onChange={this.setSelectedLayout} />
      )
    })

    return (
      <dl className={navbarControlClasses} tabIndex='0'>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control' title={LayoutButtonControl.devices[this.state.activeDevice].type}>
          {activeDevice}
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content'>
          {layoutItems}
        </dd>
      </dl>
    )
  }
}

export default LayoutButtonControl
