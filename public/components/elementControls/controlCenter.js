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

  // @todo Add proper style
  return (
    <div style={{
      position: 'absolute',
      top: '50px',
      backgroundColor: 'rgb(109, 171, 60)',
      margin: 'auto',
      left: 0,
      right: 0,
      pointerEvents: 'all',
      display: 'flex',
      width: '240px',
      borderRadius: '5px'
    }}
    >
      <span className='vcv-ui-outline-control-content'>
        <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
      </span>
      <ControlDropdownInner elementId={props.id} inline />
    </div>
  )
}
