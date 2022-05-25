import React from 'react'
import { getStorage, setData } from 'vc-cake'

const layoutStorage = getStorage('layout')

let clickState = 'mouseUp'
let mouseDownTimeout: ReturnType<typeof setTimeout>

interface Props {
  title: string;
  id: string;
  icon: string
}

const MainControl: React.FC<Props> = ({ title, id, icon }) => {
  const startDrag = (e: React.MouseEvent) => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseLeave',
      vcElementId: id
    })
    const layoutContent = document.querySelector('.vcv-layout-content') as HTMLElement
    setData('draggingElement', {
      id: id,
      point: { x: e.clientX - layoutContent.offsetLeft, y: e.clientY - layoutContent.offsetTop }
    })
    window.clearTimeout(mouseDownTimeout)
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    e && e.preventDefault()
    clickState = 'mouseUp'
    window.clearTimeout(mouseDownTimeout)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e && e.preventDefault()
    clickState = 'mouseDown'
    mouseDownTimeout = setTimeout(() => {
      if (clickState === 'mouseDown') {
        startDrag(e)
      }
    }, 200)
  }

  return (
    <div
      className="vcv-ui-outline-control-dropdown-trigger vcv-ui-outline-control"
      title={title}
      data-vcv-element-id={id}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <span className="vcv-ui-outline-control-content">
        <img className="vcv-ui-outline-control-icon" src={icon} alt={title} />
      </span>
    </div>
  )
}

export default MainControl
