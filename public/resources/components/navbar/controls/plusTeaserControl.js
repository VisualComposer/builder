import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import {getStorage, getService, env} from 'vc-cake'
import MobileDetect from 'mobile-detect'

const dataProcessor = getService('dataProcessor')
const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentStartState = getStorage('workspace').state('contentStart')
const workspaceContentEndState = getStorage('workspace').state('contentEnd')
const workspaceContentState = getStorage('workspace').state('content')

export default class PlusTeaserControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.toggleAddElement = this.toggleAddElement.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.state = {
      isActive: false,
      showBadge: window.vcvHubTeaserShowBadge
    }
  }

  setActiveState (state) {
    this.setState({isActive: state === 'addHubElement'})
  }

  componentDidMount () {
    if (env('NAVBAR_SINGLE_CONTENT')) {
      workspaceContentState.onChange(this.setActiveState)
      return
    }
    workspaceContentEndState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    if (env('NAVBAR_SINGLE_CONTENT')) {
      workspaceContentState.ignoreChange(this.setActiveState)
      return
    }
    workspaceContentEndState.ignoreChange(this.setActiveState)
  }

  toggleAddElement (e) {
    e && e.preventDefault()
    const settings = this.state.isActive ? false : {
      action: 'addHub',
      element: {},
      tag: '',
      options: {}
    }
    if (env('MOBILE_DETECT')) {
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        workspaceContentStartState.set(false)
      }
    }
    workspaceSettings.set(settings)
    if (window.vcvHubTeaserShowBadge || this.state.showBadge) {
      dataProcessor.appServerRequest({
        'vcv-action': 'vcv:hub:teaser:visit:adminNonce'
      })
      dataProcessor.appAllDone().then(() => {
        window.vcvHubTeaserShowBadge = false
        this.setState({showBadge: false})
      })
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.addPremiumElement : 'Hub'

    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--warning': this.state.showBadge
    })

    return (
      <span className={controlClass} title={name} onClick={this.toggleAddElement}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-hub-shop' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
