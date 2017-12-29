import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import MobileDetect from 'mobile-detect'
import {getStorage, env} from 'vc-cake'

const workspaceContentStartState = getStorage('workspace').state('contentStart')
const workspaceContentEndState = getStorage('workspace').state('contentEnd')
const workspaceContentState = getStorage('workspace').state('content')
const workspaceSettings = getStorage('workspace').state('settings')

export default class TreeViewControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.toggleTreeView = this.toggleTreeView.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  state = {
    isActive: false,
    data: []
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'treeView' })
  }

  componentDidMount () {
    if (env('NAVBAR_SINGLE_CONTENT')) {
      workspaceContentState.onChange(this.setActiveState)
      return
    }
    workspaceContentStartState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    if (env('NAVBAR_SINGLE_CONTENT')) {
      workspaceContentState.ignoreChange(this.setActiveState)
      return
    }
    workspaceContentStartState.ignoreChange(this.setActiveState)
  }

  toggleTreeView (e) {
    e && e.preventDefault()
    if (env('MOBILE_DETECT')) {
      const mobileDetect = new MobileDetect(window.navigator.userAgent)
      if (mobileDetect.mobile() && (mobileDetect.tablet() || mobileDetect.phone())) {
        workspaceContentEndState.set(false)
      }
    }
    if (env('NAVBAR_SINGLE_CONTENT')) {
      if (env('HUB_REDESIGN')) {
        workspaceSettings.set({ action: 'treeView' })
      }
      workspaceContentState.set(!this.state.isActive ? 'treeView' : false)
      return
    }
    workspaceContentStartState.set(!this.state.isActive ? 'treeView' : false)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.treeView : 'Tree View'

    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <span className={controlClass} title={name} onClick={this.toggleTreeView}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
