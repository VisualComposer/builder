import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService } from 'vc-cake'
import React from 'react'

export default function ControlCenter (props) {
  const vcElement = ControlHelpers.getVcElement(props.id)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const hubElementsService = getService('hubElements')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))

  if (!vcElement) {
    return null
  }

  const getWidth = () => {
    const vcElementsPath = props.data.vcElementsPath.length
    const vcvDraggableIds = props.data.vcvDraggableIds.length
    const vcvEditableElements = props.data.vcvEditableElements.length
    const all = vcElementsPath + vcvDraggableIds + vcvEditableElements
    return (all * 40) + 'px'
  }
  return (
    <div className={'vcv-ui-outline-control-wrap'} style={{width: getWidth()}} >
      <span className='vcv-ui-outline-control-content'>
        <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
      </span>
      <ControlDropdownInner elementId={props.id} inline />
    </div>
  )
}
