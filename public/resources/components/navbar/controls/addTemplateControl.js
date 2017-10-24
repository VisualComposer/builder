import React from 'react'
import classNames from 'classnames'
import {getStorage, env} from 'vc-cake'
import NavbarContent from '../navbarContent'
import MobileDetect from 'mobile-detect'

const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentStartState = getStorage('workspace').state('contentStart')
const workspaceContentEndState = getStorage('workspace').state('contentEnd')
const workspaceContentState = getStorage('workspace').state('content')

export default class AddTemplateControl extends NavbarContent {

  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.toggleAddTemplate = this.toggleAddTemplate.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
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

  setActiveState (state) {
    this.setState({ isActive: state === 'addTemplate' })
  }

  toggleAddTemplate (e) {
    e && e.preventDefault()
    const settings = this.state.isActive ? false : {
      action: 'addTemplate',
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
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.addTemplate : 'Add Template'

    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <span className={controlClass} title={name} onClick={this.toggleAddTemplate}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-template' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
