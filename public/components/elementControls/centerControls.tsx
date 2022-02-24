import React, { useRef, useState, useEffect } from 'react'
import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService, getStorage } from 'vc-cake'
import MainControl from './mainControl'

const layoutStorage = getStorage('layout')

interface Props {
  id: string;
  containerPos: {
    realTop: number;
    height: number;
    left: number;
    width: number
  };
  controlsListWidth: number;
  iframeWindow: Window
}

const CenterControls: React.FC<Props> = ({ id, containerPos, controlsListWidth, iframeWindow }) => {
  const vcElement = ControlHelpers.getVcElement(id)
  const title = vcElement.get('customHeaderTitle') || vcElement.get('name')
  const hubElementsService = getService('hubElements')
  const icon = hubElementsService.getElementIcon(vcElement.get('tag'))
  const innerRef = useRef<HTMLHeadingElement>(null)
  const outerRef = useRef<HTMLHeadingElement>(null)
  const [innerLeft, setInnerLeft] = useState(60) // in most cases left position will be bigger than base control width

  useEffect(() => {
    const innerRefLeft = innerRef?.current?.getBoundingClientRect()?.left
    const outerRefLeft = outerRef?.current?.getBoundingClientRect()?.left
    if (innerRefLeft && outerRefLeft) {
      setInnerLeft(innerRefLeft - outerRefLeft)
    }
  }, [controlsListWidth])

  if (!vcElement) {
    return null
  }
  const screenGap = 2
  const controlsHeight = 40
  const centerPosition = containerPos.realTop + (containerPos.height / 2)
  const bottomPosition = centerPosition + controlsHeight / 2
  let topPosition = centerPosition - controlsHeight / 2

  if ((topPosition < (controlsHeight + screenGap * 2)) && (controlsListWidth > innerLeft)) {
    topPosition = controlsHeight + screenGap * 2
  } else if (topPosition < screenGap) {
    topPosition = screenGap
  } else if (bottomPosition > iframeWindow.innerHeight) {
    topPosition = iframeWindow.innerHeight - controlsHeight - screenGap
  }

  const handleMouseEnter = () => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseEnter',
      vcElementId: id
    })
  }

  const handleMouseLeave = () => {
    layoutStorage.state('interactWithControls').set({
      type: 'mouseLeave',
      vcElementId: id
    })
  }

  const styles = {
    top: `${topPosition}px`,
    left: `${containerPos.left}px`,
    width: `${containerPos.width}px`
  }
  const isCenterControls = true
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className='vcv-ui-outline-controls-center'
      style={{...styles}}
      ref={outerRef}>
      <div className='vcv-ui-outline-controls-center-inner' ref={innerRef}>
        <MainControl id={id} title={title} icon={icon} />
        <ControlDropdownInner elementId={id} isCenterControls={isCenterControls} />
      </div>
    </div>
  )
}

export default CenterControls
