import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService } from 'vc-cake'
import React from 'react'

export default function ControlCenter (props) {
  const vcElement = ControlHelpers.getVcElement(props.id)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const hubElementsService = getService('hubElements')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))

  React.useEffect(() => {
    console.log(window.innerHeight)
  }, [])

  if (!vcElement) {
    return null
  }

  console.log('--- mount ---')

  const getWidth = () => {
    const optionCount = 6
    return (optionCount * 40) + 'px'
  }

  const getTop = () => {
    return (window.innerHeight / 3) + 'px'
  }

  return (
    <div className='vcv-ui-outline-control-wrap' style={{ width: getWidth(), top: getTop() }}>
      <span className='vcv-ui-outline-control-content'>
        <img className='vcv-ui-outline-control-icon' src={icon} alt={title} />
      </span>
      <ControlDropdownInner elementId={props.id} inline />
    </div>
  )
}
