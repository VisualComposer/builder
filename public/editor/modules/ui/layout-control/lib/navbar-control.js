import React from 'react'
import classNames from 'classnames'
import LayoutItem from './navbar-item'

class LayoutButtonControl extends React.Component {
  static devices = [
    {
      type: 'Responsive view',
      className: 'multiple-devices',
      viewport: {
        width: null,
        min: null,
        max: null
      }
    },
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
      type: 'Tablet landscape',
      className: 'tablet-landscape',
      viewport: {
        width: '992',
        min: '992',
        max: '1199'
      }
    },
    {
      type: 'Tablet portrait',
      className: 'tablet-portrait',
      viewport: {
        width: '768',
        min: '768',
        max: '991'
      }
    },
    {
      type: 'Mobile landscape',
      className: 'mobile-landscape',
      viewport: {
        width: '554',
        min: '554',
        max: '767'
      }
    },
    {
      type: 'Mobile portrait',
      className: 'mobile-portrait',
      viewport: {
        width: '480',
        min: '0',
        max: '553'
      }
    }
  ]

  constructor (props) {
    super(props)
    this.state = {
      activeDevice: 0
    }

    this.setDefautlDevice = this.setDefautlDevice.bind(this)
    this.setSelectedLayout = this.setSelectedLayout.bind(this)
  }

  componentDidMount () {
    this.addResizeListener(window, this.setDefautlDevice)
  }

  componentWillUnmount () {
    this.removeResizeListener(window, this.setDefautlDevice)
  }

  addResizeListener (el, fn) {
    el.addEventListener('resize', fn)
  }

  removeResizeListener (el, fn) {
    el.removeEventListener('resize', fn)
  }

  setDefautlDevice () {
    this.setSelectedLayout(0)
  }

  setSelectedLayout (index) {
    this.setViewport(LayoutButtonControl.devices[ index ].viewport.width)
    this.setState({
      activeDevice: index
    })
  }

  setViewport (width) {
    let iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    iframeContainer.style.width = width ? width + 'px' : ''
  }

  render () {
    let controlIconClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      'vcv-ui-icon-' + LayoutButtonControl.devices[ this.state.activeDevice ].className
    )

    let activeDevice = (
      <span className='vcv-ui-navbar-control-content'>
        <i className={controlIconClasses} />
        <span>{LayoutButtonControl.devices[ this.state.activeDevice ].type}</span>
      </span>
    )

    let navbarControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-dropdown-linear': true,
      'vcv-ui-pull-end': true
    })

    let layoutItems = []
    LayoutButtonControl.devices.forEach((item, index) => {
      layoutItems.push(
        <LayoutItem key={index} device={item} index={index} onChange={this.setSelectedLayout} />
      )
    })

    return (
      <dl className={navbarControlClasses} tabIndex='0'>
        <dt className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control'
          title={LayoutButtonControl.devices[ this.state.activeDevice ].type}>
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
