import React from 'react'
import classNames from 'classnames'
import Item from './item'
import MobileDetect from 'mobile-detect'
import { env, getService } from 'vc-cake'

const dataManager = getService('dataManager')

export default class LayoutButtonControl extends React.Component {
  static localizations = dataManager.get('localizations')
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
        height: '880',
        min: '1200',
        max: Infinity
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.tabletLandscape : 'Tablet Landscape',
      className: 'tablet-landscape',
      viewport: {
        width: '1220',
        height: '818',
        min: '992',
        max: '1199'
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.tabletPortrait : 'Tablet Portrait',
      className: 'tablet-portrait',
      viewport: {
        width: '818',
        height: '1220',
        min: '768',
        max: '991'
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.mobileLandscape : 'Mobile Landscape',
      className: 'mobile-landscape',
      viewport: {
        width: '600',
        height: '340',
        min: '554',
        max: '767'
      }
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.mobilePortrait : 'Mobile Portrait',
      className: 'mobile-portrait',
      viewport: {
        width: '340',
        height: '600',
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
      this.editorType = dataManager.get('editorType')
    }

    this.handleClickSetSelectedLayout = this.handleClickSetSelectedLayout.bind(this)
  }

  handleClickSetSelectedLayout (index) {
    const variableName = LayoutButtonControl.devices[index]
    this.setViewport(variableName.viewport.width, variableName.viewport.height, variableName.className)
    this.setState({
      activeDevice: index
    })
  }

  setViewport (width, height, device) {
    const layoutContent = window.document.querySelector('.vcv-layout-content')
    const iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    layoutContent.style.padding = width ? '30px' : ''
    layoutContent.style.display = 'grid'
    iframeContainer.style.width = width ? width + 'px' : ''
    iframeContainer.style.height = height ? height + 'px' : ''
    iframeContainer.setAttribute('data-vcv-device', device)
    if (device === 'desktop' || device === 'tablet-landscape' || device === 'tablet-portrait') {
      layoutContent.style.display = 'block'
    }
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
