import React from 'react'
import { getStorage, setData } from 'vc-cake'

const layoutStorage = getStorage('layout')

let clickState = 'mouseUp'
let mouseDownTimeout = false

export default function MainControl ({title, id, icon}) {
  const startDrag = (e) => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseLeave',
      vcElementId: id
    })
    const layoutContent = document.querySelector('.vcv-layout-content')
    setData('draggingElement', { id: id, point: { x: e.clientX - layoutContent.offsetLeft, y: e.clientY - layoutContent.offsetTop } })
    window.clearTimeout(mouseDownTimeout)
    mouseDownTimeout = false
  }

  const handleMouseUp = (e) => {
    e && e.preventDefault()
    clickState = 'mouseUp'
    window.clearTimeout(mouseDownTimeout)
    mouseDownTimeout = false
  }

  const handleMouseDown = (e) => {
    e && e.preventDefault()
    clickState = 'mouseDown'
    // will remove the synthetic event from the pool and allow references to the event to be retained by user code.
    // because of setTimeout
    // https://reactjs.org/docs/events.html#event-pooling
    e.persist()
    mouseDownTimeout = setTimeout(() => {
      if (clickState === 'mouseDown') {
        startDrag(e)
      }
    }, 200)
  }

  return (
    <div
      className='vcv-ui-outline-control-dropdown-trigger vcv-ui-outline-control'
      title={title}
      data-vcv-element-id={id}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
        <span className='vcv-ui-outline-control-content'>
          <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
        </span>
    </div>
  )
}
