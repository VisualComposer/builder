import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import {getStorage, env} from 'vc-cake'
import MobileDetect from 'mobile-detect'

const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentStartState = getStorage('workspace').state('contentStart')
const workspaceContentEndState = getStorage('workspace').state('contentEnd')

export default class PlusControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.toggleAddElement = this.toggleAddElement.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.state = {
      isActive: false
    }
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'addElement' })
  }

  componentDidMount () {
    workspaceContentEndState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    workspaceContentEndState.ignoreChange(this.setActiveState)
  }

  toggleAddElement (e) {
    e && e.preventDefault()
    const settings = this.state.isActive ? false : {
      action: 'add',
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
    const name = localizations ? localizations.addElement : 'Add Element'

    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <span className={controlClass} title={name} onClick={this.toggleAddElement}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
