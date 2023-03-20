import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import AtarimPanel from 'public/components/panels/atarim/AtarimPanel'

const workspace = getStorage('workspace')
const workspaceContentState = workspace.state('content')
const workspaceSettings = workspace.state('settings')
const dataManager = getService('dataManager')

export default class AtarimButtonControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'atarim'
    }
    this.handleClickAtarim = this.handleClickAtarim.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'atarim' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)

    innerAPI.mount('panel:atarim', () => <AtarimPanel key='panels-container-atarim' />)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
  }

  handleClickAtarim (e) {
    e && e.preventDefault()
    workspaceSettings.set({ action: 'atarim' })
    workspaceContentState.set(!this.state.isActive ? 'atarim' : false)
  }

  render () {
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.atarim : 'Atarim'

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive,
      'vcv-ui-pull-end': true
    })

    return (
      <span className={controlClass} title={name} onClick={this.handleClickAtarim}>
        <span className='vcv-ui-navbar-control-content
        '>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-atarim-comments ' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
