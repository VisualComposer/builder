import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'

import {getStorage} from 'vc-cake'

const workspaceContentStartState = getStorage('workspace').state('contentStart')

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
    workspaceContentStartState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    workspaceContentStartState.ignoreChange(this.setActiveState)
  }

  toggleTreeView (e) {
    e && e.preventDefault()
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
      <a className={controlClass} title={name} onClick={this.toggleTreeView}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers' />
          <span>{name}</span>
        </span>
      </a>
    )
  }
}
