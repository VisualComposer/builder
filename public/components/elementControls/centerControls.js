import React, { useRef, useState, useEffect } from 'react'
import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService } from 'vc-cake'
import MainControl from './mainControl'

export default function CenterControls ({ id, containerPos }) {
  const vcElement = ControlHelpers.getVcElement(id)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const hubElementsService = getService('hubElements')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))
  const innerRef = useRef()
  const outerRef = useRef()
  const [innerLeft, setInnerLeft] = useState(60) // in most cases left will be bigger than base control width
  if (!vcElement) {
    return null
  }
  useEffect(() => {
    const innerRefLeft = innerRef.current?.getBoundingClientRect()?.left
    const outerRefLeft = outerRef.current?.getBoundingClientRect()?.left
    setInnerLeft(innerRefLeft - outerRefLeft)
  }, [])

  let topPosition = containerPos.realTop + (containerPos.height / 2) - 20
  console.log(containerPos.width)
  console.log(innerLeft)
  if (topPosition < 44 && (containerPos.width > innerLeft)) {
    topPosition = 44
  } else if (topPosition < 2) {
    topPosition = 2
  }

  const styles = {
    top: `${topPosition}px`,
    left: `${containerPos.left}px`,
    width: `${containerPos.width}px`
  }
  const isCenterControls = true
  return (
    <div className='vcv-ui-outline-controls-center' style={{ ...styles }} ref={outerRef}>
      <div className='vcv-ui-outline-controls-center-inner' ref={innerRef}>
        <MainControl id={id} title={title} icon={icon} />
        <ControlDropdownInner elementId={id} isCenterControls={isCenterControls} />
      </div>
    </div>
  )
}
