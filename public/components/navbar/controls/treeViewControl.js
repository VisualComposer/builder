import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import TreeViewLayout from 'public/components/panels/treeView/treeViewLayout'

const workspace = getStorage('workspace')
const workspaceContentState = workspace.state('content')
const workspaceSettings = workspace.state('settings')
const dataManager = getService('dataManager')

export default class TreeViewControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

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

    innerAPI.mount('panel:treeView', () => <TreeViewLayout key='panels-container-treeView' />)
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
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.treeView : 'Tree View'
    const title = TreeViewControl.isMacLike ? name + ' (⇧T)' : name + ' (Shift + T)'

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <span className={controlClass} title={title} onClick={this.handleClickTreeView}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
