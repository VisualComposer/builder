import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage } from 'vc-cake'

const workspaceSettings = getStorage('workspace').state('settings')
const workspaceContentState = getStorage('workspace').state('content')

export default class PlusControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.handleClickAddContent = this.handleClickAddContent.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    const contentState = workspaceContentState.get()
    this.state = {
      isActive: contentState === 'addElement' || contentState === 'addTemplate'
    }
  }

  setActiveState (contentState) {
    this.setState({ isActive: contentState === 'addElement' || contentState === 'addTemplate' })
  }

  componentDidMount () {
    workspaceContentState.onChange(this.setActiveState)
  }

  componentWillUnmount () {
    workspaceContentState.ignoreChange(this.setActiveState)
  }

  handleClickAddContent (e) {
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
    const localizations = window.VCV_I18N && window.VCV_I18N()
    const name = localizations ? localizations.addContent : 'Add Content'

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <span className={controlClass} title={name} onClick={this.handleClickAddContent}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
