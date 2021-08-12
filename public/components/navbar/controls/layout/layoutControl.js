import React from 'react'
import classNames from 'classnames'
import Item from './item'
import { env, getService, getStorage } from 'vc-cake'
import NavbarContent from '../../navbarContent'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')

export default class LayoutButtonControl extends NavbarContent {
  static localizations = dataManager.get('localizations')
  static devices = [
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.desktop : 'Desktop',
      className: 'desktop',
      viewport: {
        width: '1200',
        height: '880',
        min: '1200',
        max: Infinity
      },
      width: '1200'
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.tabletLandscape : 'Tablet Landscape',
      className: 'tablet-landscape',
      viewport: {
        width: '1220',
        height: '830',
        min: '992',
        max: '1199'
      },
      width: '1080'
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.tabletPortrait : 'Tablet Portrait',
      className: 'tablet-portrait',
      viewport: {
        width: '835',
        height: '1220',
        min: '768',
        max: '991'
      },
      width: '780'
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.mobileLandscape : 'Mobile Landscape',
      className: 'mobile-landscape',
      viewport: {
        width: '680',
        height: '340',
        min: '554',
        max: '767'
      },
      width: '560'
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.mobilePortrait : 'Mobile Portrait',
      className: 'mobile-portrait',
      viewport: {
        width: '340',
        height: '680',
        min: '0',
        max: '553'
      },
      width: '320'
    },
    {
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.dynamicView : 'Dynamic View',
      className: 'multiple-devices',
      viewport: {
        width: null,
        min: null,
        max: null
      }
    }
  ]

  constructor (props) {
    super(props)
    this.state = {
      activeDevice: 0,
      isControlActive: false,
      isVerticalPositioned: false,
      isHorizontalPositioned: false
    }
    this.contentRef = React.createRef()

    if (env('VCV_JS_THEME_EDITOR')) {
      this.editorType = dataManager.get('editorType')
    }

    this.handleClickSetSelectedLayout = this.handleClickSetSelectedLayout.bind(this)
    this.handleControlHover = this.handleControlHover.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('outputEditorLayoutDesktop').onChange(this.handleLayoutChange)
  }

  componentWillUnmount () {
    settingsStorage.state('outputEditorLayoutDesktop').ignoreChange(this.handleLayoutChange)
  }

  handleLayoutChange (data) {
    let deviceViewIndex = 0
    if (data === 'dynamic') {
      deviceViewIndex = LayoutButtonControl.devices.findIndex(device => device.className === 'multiple-devices')
    }
    this.handleClickSetSelectedLayout(deviceViewIndex)
  }

  handleClickSetSelectedLayout (index) {
    const variableName = LayoutButtonControl.devices[index]
    this.setViewport(variableName.viewport.width, variableName.viewport.height, variableName.className)
    this.setState({
      activeDevice: index
    })
    this.handleDropdownVisibility()
  }

  handleWindowResize () {
    const bodyClasses = document.body.classList
    const contentRect = this.contentRef.current.getBoundingClientRect()
    if (!this.state.isVerticalPositioned && (bodyClasses.contains('vcv-layout-dock--left') || bodyClasses.contains('vcv-layout-dock--right'))) {
      if (contentRect.bottom > window.innerHeight) {
        this.setState({ isVerticalPositioned: true })
      }
    } else if (!this.state.isHorizontalPositioned && (bodyClasses.contains('vcv-layout-dock--top') || bodyClasses.contains('vcv-layout-dock--bottom'))) {
      if (contentRect.right > window.innerWidth) {
        this.setState({ isHorizontalPositioned: true })
      }
    }
  }

  handleControlHover () {
    this.setState({
      isHorizontalPositioned: false,
      isVerticalPositioned: false
    }, () => {
      window.setTimeout(() => {
        this.handleWindowResize()
      }, 1)
    })
  }

  setViewport (width, height, device) {
    const layoutContent = window.document.querySelector('.vcv-layout-content')
    const iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    if (device.includes('mobile') || device.includes('tablet')) {
      layoutContent.classList.add('vcv-layout-content--devices')
    } else {
      layoutContent.classList.remove('vcv-layout-content--devices')
    }
    iframeContainer.style.width = width ? width + 'px' : ''
    iframeContainer.style.minWidth = width && device !== 'desktop' ? width + 'px' : ''
    iframeContainer.style.minHeight = height && device !== 'desktop' ? height + 'px' : ''
    iframeContainer.setAttribute('data-vcv-device', device)
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
      'vcv-ui-navbar-dropdown--layout': true,
      'vcv-ui-navbar-dropdown-linear': true,
      'vcv-ui-pull-end': true
    })
    const navbarContentClasses = classNames({
      'vcv-ui-navbar-dropdown-content': true,
      'vcv-ui-show-dropdown-content': this.state.showDropdown,
      'vcv-ui-navbar-dropdown-content--layout': true,
      'vcv-ui-navbar-dropdown-content--vertical': this.state.isVerticalPositioned,
      'vcv-ui-navbar-dropdown-content--horizontal': this.state.isHorizontalPositioned
    })

    const layoutItems = []
    LayoutButtonControl.devices.forEach((item, index) => {
      layoutItems.push(
        <Item key={index} device={item} index={index} onChange={this.handleClickSetSelectedLayout} />
      )
    })

    if (env('VCV_JS_THEME_EDITOR') && this.editorType === 'sidebar') {
      return null
    }

    return (
      <dl
        className={navbarControlClasses}
        tabIndex='0'
        data-vcv-guide-helper='layout-control'
        onMouseEnter={this.handleControlHover}
        onMouseLeave={this.handleDropdownVisibility}
      >
        <dt
          className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control'
          title={LayoutButtonControl.devices[this.state.activeDevice].type}
          onMouseEnter={this.handleDropdownVisibility}
        >
          {activeDevice}
        </dt>
        <dd className={navbarContentClasses} ref={this.contentRef}>
          {layoutItems}
        </dd>
      </dl>
    )
  }
}
