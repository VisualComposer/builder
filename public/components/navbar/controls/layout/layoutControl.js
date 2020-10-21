import React from 'react'
import classNames from 'classnames'
import Item from './item'
import MobileDetect from 'mobile-detect'
import { env } from 'vc-cake'

export default class LayoutButtonControl extends React.Component {
  static localizations = window.VCV_I18N && window.VCV_I18N()
  static devices = [
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.responsiveView : 'Responsive View',
      className: 'multiple-devices',
      viewport: {
        width: null,
        min: null,
        max: null
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.desktop : 'Desktop',
      className: 'desktop',
      viewport: {
        width: '1200',
        min: '1200',
        max: Infinity
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.tabletLandscape : 'Tablet Landscape',
      className: 'tablet-landscape',
      viewport: {
        width: '992',
        min: '992',
        max: '1199'
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.tabletPortrait : 'Tablet Portrait',
      className: 'tablet-portrait',
      viewport: {
        width: '768',
        min: '768',
        max: '991'
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.mobileLandscape : 'Mobile Landscape',
      className: 'mobile-landscape',
      viewport: {
        width: '554',
        min: '554',
        max: '767'
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.mobilePortrait : 'Mobile Portrait',
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

    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile()) {
      this.isMobile = true
    }

    if (env('VCV_JS_THEME_EDITOR')) {
      this.editorType = window.VCV_EDITOR_TYPE ? window.VCV_EDITOR_TYPE() : 'default'
    }

    this.setDefautlDevice = this.setDefautlDevice.bind(this)
    this.handleClickSetSelectedLayout = this.handleClickSetSelectedLayout.bind(this)
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
    this.handleClickSetSelectedLayout(0)
  }

  handleClickSetSelectedLayout (index) {
    this.setViewport(LayoutButtonControl.devices[index].viewport.width)
    this.setState({
      activeDevice: index
    })
  }

  setViewport (width) {
    const iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    iframeContainer.style.width = width ? width + 'px' : ''
  }

  render () {
    const controlIconClasses = classNames(
      'vcv-ui-navbar-control-icon',
      'vcv-ui-icon',
      'vcv-ui-icon-' + LayoutButtonControl.devices[this.state.activeDevice].className
    )

    const activeDevice = (
      <span className='vcv-ui-navbar-control-content'>
        <i className={controlIconClasses} />
        <span>{LayoutButtonControl.devices[this.state.activeDevice].type}</span>
      </span>
    )

    const navbarControlClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-dropdown-linear': true,
      'vcv-ui-pull-end': true
    })

    const layoutItems = []
    LayoutButtonControl.devices.forEach((item, index) => {
      layoutItems.push(
        <Item key={index} device={item} index={index} onChange={this.handleClickSetSelectedLayout} />
      )
    })

    if (this.isMobile || (env('VCV_JS_THEME_EDITOR') && this.editorType === 'sidebar')) {
      return null
    }

    return (
      <dl className={navbarControlClasses} tabIndex='0' data-vcv-guide-helper='layout-control'>
        <dt
          className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control'
          title={LayoutButtonControl.devices[this.state.activeDevice].type}
        >
          {activeDevice}
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content'>
          {layoutItems}
        </dd>
      </dl>
    )
  }
}
