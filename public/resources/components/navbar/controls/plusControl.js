import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import {getStorage} from 'vc-cake'

const workspaceSettings = getStorage('workspace').state('settings')
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
    workspaceSettings.set(settings)
  }

  render () {
    const localizations = window.VCV_I18N()
    const name = localizations.addElement

    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <a className={controlClass} href='#' title={name} onClick={this.toggleAddElement}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
          <span>{name}</span>
        </span>
      </a>
    )
  }
}
