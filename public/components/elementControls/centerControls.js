import React   from 'react'
import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService } from 'vc-cake'
import MainControl from './mainControl'

export default function CenterControls ({ top, height, id, containerPos }) {
  const vcElement = ControlHelpers.getVcElement(id)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const hubElementsService = getService('hubElements')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))

  if (!vcElement) {
    return null
  }

  let topPosition = containerPos.realTop + (height / 2) - 20
  if (topPosition < 2) {
    topPosition = 2
  }

  const styles = {
    top: `${topPosition}px`,
    left: `${containerPos.left}px`,
    width: `${containerPos.width}px`
  }

  return (
    <div className='vcv-ui-outline-controls-center' style={{ ...styles }}>
      <div className='vcv-ui-outline-controls-center-inner'>
        <MainControl id={id} title={title} icon={icon} />
        <ControlDropdownInner elementId={id} />
      </div>
    </div>
  )
}
