import React, { useEffect, useState } from 'react'
import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService } from 'vc-cake'

export default function CenterControls (props) {
  const vcElement = ControlHelpers.getVcElement(props.id)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const hubElementsService = getService('hubElements')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))
  console.log(vcElement)

  if (!vcElement) {
    return null
  }

  let styles = {}
  if (props.height) {
    styles = {
      height: `${props.height}px`
    }
  }
  console.log(styles)

  return (
    <div className='vcv-ui-outline-controls-center' style={{ ...styles }}>
      <div className='vcv-ui-outline-controls-center-inner'>
        <span className='vcv-ui-outline-control-content'>
          <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
        </span>
        <ControlDropdownInner elementId={props.id} />
      </div>
    </div>
  )
}
