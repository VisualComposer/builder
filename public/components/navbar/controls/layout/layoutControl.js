import React from 'react'
import classNames from 'classnames'
import Item from './item'
import MobileDetect from 'mobile-detect'
import { env, getService, getStorage } from 'vc-cake'

const dataManager = getService('dataManager')
const settingsStorage = getStorage('settings')
const workspaceStorage = getStorage('workspace')
const workspaceSettings = workspaceStorage.state('settings')
const workspaceContentState = workspaceStorage.state('content')

export default class LayoutButtonControl extends React.Component {
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
        width: '830',
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
      type: LayoutButtonControl.localizations ? LayoutButtonControl.localizations.responsiveView : 'Responsive View',
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
      isControlActive: false
    }
    this.contentRef = React.createRef()

    const mobileDetect = new MobileDetect(window.navigator.userAgent)
    if (mobileDetect.mobile()) {
      this.isMobile = true
    }

    if (env('VCV_JS_THEME_EDITOR')) {
      this.editorType = dataManager.get('editorType')
    }

    this.handleClickSetSelectedLayout = this.handleClickSetSelectedLayout.bind(this)
    this.handleControlClick = this.handleControlClick.bind(this)
    this.handleWindowResize = this.handleWindowResize.bind(this)
    this.handleLayoutChange = this.handleLayoutChange.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.closeDropdown = this.closeDropdown.bind(this)
  }

  componentDidMount () {
    settingsStorage.state('outputEditorLayoutDesktop').onChange(this.handleLayoutChange)
    workspaceSettings.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    settingsStorage.state('outputEditorLayoutDesktop').ignoreChange(this.handleLayoutChange)
    workspaceSettings.ignoreChange(this.setActiveState)
  }

  handleLayoutChange (data) {
    let deviceViewIndex = 0
    if (!data) {
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

  closeDropdown (e) {
    if (e && e.target.closest('.vcv-ui-navbar-sandwich')) {
      this.setActiveState({ action: 'sandwich' })
    }
  }

  handleControlClick () {
    workspaceContentState.set(false)
    workspaceSettings.set(this.state.isControlActive ? false : { action: 'devices' })
  }

  setActiveState (state) {
    this.setState({ isControlActive: (state && state.action) === 'devices' })
    if (!this.state.isControlActive) {
      window.addEventListener('resize', this.handleWindowResize)
      setTimeout(this.handleWindowResize, 1)
      document.getElementById('vcv-editor-iframe').contentWindow.document.body.addEventListener('click', this.closeDropdown)
      document.body.addEventListener('click', this.closeDropdown)
    } else {
      window.removeEventListener('resize', this.handleWindowResize)
      document.getElementById('vcv-editor-iframe').contentWindow.document.body.removeEventListener('click', this.closeDropdown)
      document.body.removeEventListener('click', this.closeDropdown)
      this.setState({
        isVerticalPositioned: false,
        isHorizontalPositioned: false
      })
    }
  }

  setViewport (width, height, device) {
    const layoutContent = window.document.querySelector('.vcv-layout-content')
    const iframeContainer = window.document.querySelector('.vcv-layout-iframe-container')
    layoutContent.style.padding = width && device !== 'desktop' ? '30px' : ''
    iframeContainer.style.width = width ? width + 'px' : ''
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
      'vcv-ui-navbar-dropdown--active': this.state.isControlActive,
      'vcv-ui-navbar-dropdown-linear': true,
      'vcv-ui-pull-end': true
    })
    const navbarContentClasses = classNames({
      'vcv-ui-navbar-dropdown-content': true,
      'vcv-ui-navbar-dropdown-content--layout': true,
      'vcv-ui-navbar-dropdown-content--visible': this.state.isControlActive,
      'vcv-ui-navbar-dropdown-content--vertical': this.state.isVerticalPositioned,
      'vcv-ui-navbar-dropdown-content--horizontal': this.state.isHorizontalPositioned
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
      <dl
        className={navbarControlClasses}
        tabIndex='0'
        data-vcv-guide-helper='layout-control'
      >
        <dt
          className='vcv-ui-navbar-dropdown-trigger vcv-ui-navbar-control'
          title={LayoutButtonControl.devices[this.state.activeDevice].type}
          onClick={this.handleControlClick}
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
