import React from 'react'
import classNames from 'classnames'
import NavbarContent from '../navbarContent'
import { getStorage, getService } from 'vc-cake'
import innerAPI from 'public/components/api/innerAPI'
import AddContentPanel from 'public/components/panels/addContent/addContentPanel'

const workspace = getStorage('workspace')
const workspaceSettings = workspace.state('settings')
const workspaceContentState = workspace.state('content')
const dataManager = getService('dataManager')

export default class PlusControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

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

    innerAPI.mount('panel:addElement', (props) => {
      return (
        <AddContentPanel
          key='panels-container-addElement'
          activeTab='addElement'
          {...props}
        />
      )
    })

    innerAPI.mount('panel:addTemplate', (props) => {
      return (
        <AddContentPanel
          key='panels-container-addTemplate'
          activeTab='addTemplate'
          {...props}
        />
      )
    })
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
    const localizations = dataManager.get('localizations')
    const name = localizations ? localizations.addContent : 'Add Content'
    const title = PlusControl.isMacLike ? name + ' (⇧A)' : name + ' (Shift + A)'

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <span className={controlClass} title={title} onClick={this.handleClickAddContent} data-vcv-guide-helper='plus-control'>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
          <span>{name}</span>
        </span>
      </span>
    )
  }
}
