import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage } from 'vc-cake'

const workspaceContentState = getStorage('workspace').state('content')
const workspaceSettings = getStorage('workspace').state('settings')

export default class TreeViewControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      isActive: workspaceContentState.get() === 'treeView',
      data: []
    }
    this.handleClickTreeView = this.handleClickTreeView.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }

  setActiveState (state) {
    this.setState({ isActive: state === 'treeView' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
  }

  handleClickTreeView (e) {
    e && e.preventDefault()
    workspaceSettings.set({ action: 'treeView' })
    workspaceContentState.set(!this.state.isActive ? 'treeView' : false)
  }

  render () {
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.treeView : 'Tree View'

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <span className={controlClass} title={name} onClick={this.handleClickTreeView}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
