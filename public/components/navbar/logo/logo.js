import React from 'react'
import { getStorage, getService } from 'vc-cake'

const workspace = getStorage('workspace')
const workspaceSettings = workspace.state('settings')
const roleManager = getService('roleManager')

export default function Logo () {
  const handleClick = () => {
    const settings = {
      action: roleManager.can('editor_content_element_add', roleManager.defaultTrue()) ? 'add' : 'addTemplate',
      element: {},
      tag: '',
      options: {}
    }
    workspace.state('focusedElement').set(null)
    workspaceSettings.set(settings)
  }

  return (
    <span
      className='vcv-ui-navbar-logo vcv-ui-navbar-control'
      title='Visual Composer Website Builder'
      onClick={handleClick}
    >
      <span className='vcv-ui-navbar-logo-title'>Visual Composer Website Builder</span>
    </span>
  )
}
