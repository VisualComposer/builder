import React from 'react'
import { getStorage, setData } from 'vc-cake'

const workspaceStorage = getStorage('workspace')
const workspaceContentState = workspaceStorage.state('content')
const workspaceTreeViewId = workspaceStorage.state('treeViewId')
const layoutStorage = getStorage('layout')

export default function ControlAction (props) {
  const { id, options } = props
  const iconClasses = `vcv-ui-outline-control-icon vcv-ui-icon ${options.icon}`
  const title = options.title || options.label
  const label = options.label ? <span className='vcv-ui-outline-control-label'>{options.label}</span> : null

  const handleClick = () => {
    const event = options.data.vcControlEvent
    const tag = options.data.vcControlEventOptions || false
    const eventOptions = {
      insertAfter: options.data.vcControlEventOptionInsertAfter || false
    }
    if (options.disabled) {
      return
    }
    if (event === 'treeView') {
      workspaceTreeViewId.set(id)
      workspaceContentState.set('treeView')
    }  else if (event === 'edit') {
      const settings = workspaceStorage.state('settings').get()
      if (settings && settings.action === 'edit') {
        workspaceStorage.state('settings').set(false)
        setTimeout(() => {
          workspaceStorage.trigger(event, id, tag, eventOptions)
        }, 300)
      } else {
        workspaceStorage.trigger(event, id, tag, eventOptions)
      }
    } else {
      workspaceContentState.set(false)
      workspaceStorage.trigger(event, id, tag, eventOptions)
    }
    layoutStorage.state('interactWithControls').set({
      type: 'controlClick',
      vcElementId: id,
      vcControlIsPermanent: options.data.vcControlIsPermanent
    })
  }

  const handleMouseDown = (e) => {
    if (options.data.vcDragHelper) {
      layoutStorage.state('interactWithControls').set({
        type: 'mouseLeave',
        vcElementId: props.id
      })
      setData('draggingElement', { id: options.data.vcDragHelper, point: { x: e.clientX, y: e.clientY } })
    }
  }

  let controlClasses = 'vcv-ui-outline-control'
  if (options.classes) {
    controlClasses = controlClasses + ` ${options.classes}`
  }

  return (
    <span
      className={controlClasses}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
    >
      <span className='vcv-ui-outline-control-content' title={title} disabled={options.disabled}>
        <i className={iconClasses} />
        {label}
      </span>
    </span>
  )
}
