import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService } from 'vc-cake'
import React from 'react'

export default function ControlCenter (props) {
  const vcElement = ControlHelpers.getVcElement(props.id)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const hubElementsService = getService('hubElements')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))
  const self = React.useRef(undefined)

  React.useEffect(() => {
    const iframe = document.getElementById('vcv-editor-iframe').contentWindow
    const content = iframe.document.querySelector(`[data-vcv-element="${props.id}"]`)
    if (self.current) {
      self.current.style.top = (content.clientHeight / 2 - 30) + 'px'
    } else {
      self.current.style.top = '46%'
    }
    return () => removeOutline()
  }, [])

  if (!vcElement) {
    return null
  }

  const getWidth = () => {
    const optionCount = 6
    return (optionCount * 40) + 'px'
  }

  const handleMouseEnter = () => {
    const iframe = document.getElementById('vcv-editor-iframe').contentWindow
    const content = iframe.document.querySelector(`[data-vcv-element="${props.id}"]`)

    const container = document.querySelector('.vcv-layout-content')
    const sidebar = document.querySelector('.vcv-layout-bar')
    const border = document.createElement('div')

    border.setAttribute('class', 'vcv-ui-center-temp-outline-temp')
    border.style.left = content.getBoundingClientRect().left + sidebar.clientWidth + 'px'
    border.style.top = content.getBoundingClientRect().top + 'px'
    border.style.width = content.clientWidth + 'px'
    border.style.height = content.offsetHeight + 'px'
    container.appendChild(border)
  }

  const handleMouseLeave = () => {
    removeOutline()
  }

  const removeOutline = () => {
    const elements = document.getElementsByClassName('vcv-ui-center-temp-outline-temp')
    for (let i = 0; elements.length; i++) {
      elements[i].remove()
    }
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} ref={self} className='vcv-ui-outline-control-wrap' style={{ width: getWidth() }}>
      <span className='vcv-ui-outline-control-content'>
        <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
      </span>
      <ControlDropdownInner elementId={props.id} inline />
    </div>
  )
}
