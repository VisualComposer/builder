import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import {getStorage, getService} from 'vc-cake'

const dataProcessor = getService('dataProcessor')
const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentEndState = getStorage('workspace').state('contentEnd')

export default class PlusTeaserControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.toggleAddElement = this.toggleAddElement.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.state = {
      isActive: false
    }
  }

  setActiveState (state) {
    this.setState({isActive: state === 'addHubElement'})
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
      action: 'addHub',
      element: {},
      tag: '',
      options: {}
    }
    workspaceSettings.set(settings)
    if (window.VCV_HUB_SHOW_TEASER_BADGE) {
      dataProcessor.appServerRequest({
        'vcv-action': 'vcv:hub:teaser:visit:adminNonce'
      })
      dataProcessor.appAllDone().then(() => {
        window.VCV_HUB_SHOW_TEASER_BADGE = false
        this.forceUpdate()
      })
    }
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.addPremiumElement : 'Add Premium Element'

    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-pull-end': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-badge--warning': window.VCV_HUB_SHOW_TEASER_BADGE
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
