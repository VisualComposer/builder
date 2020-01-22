import React from 'react'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'
import NavbarContent from '../navbarContent'

const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentState = getStorage('workspace').state('content')

export default class AddTemplateControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'addTemplate'
    }
    this.toggleAddTemplate = this.toggleAddTemplate.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
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
    workspaceSettings.set(settings)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.addTemplate : 'Add Template'

    const controlClass = classNames({
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
