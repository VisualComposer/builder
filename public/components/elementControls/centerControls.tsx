import React, { useRef, useState, useEffect } from 'react'
import ControlDropdownInner from './controlDropdownInner'
import { ControlHelpers } from './controlHelpers'
import { getService, getStorage } from 'vc-cake'
import MainControl from './mainControl'
import classNames from "classnames";

const layoutStorage = getStorage('layout')
const iframe = document.getElementById('vcv-editor-iframe')

interface Props {
  id: string;
  containerPos: {
    realTop: number;
    height: number;
    left: number;
    width: number;
    bottom: number;
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
  const [isControlsLeft, setIsControlsLeft] = useState(false)
  const [isControlsRight, setIsControlsRight] = useState(false)

  useEffect(() => {
    // Timeout is required because sometimes the ref elements has no size,
    // thus failing to calculate proper position.
    const timeout = setTimeout(() => {
      const innerRefLeft = innerRef?.current?.getBoundingClientRect()?.left
      const innerRefRight = innerRef?.current?.getBoundingClientRect()?.right
      const outerRefLeft = outerRef?.current?.getBoundingClientRect()?.left
      const iframeRect = iframe && iframe.getBoundingClientRect()
      if (innerRefLeft && outerRefLeft) {
        setInnerLeft(innerRefLeft - outerRefLeft)
      }
      if (innerRefLeft && iframeRect && innerRefLeft < iframeRect.left) {
        setIsControlsLeft(true)
      }
      if (innerRefRight && iframeRect && innerRefRight > iframeRect.right) {
        setIsControlsRight(true)
      }
    }, 0)
    return () => {
      clearTimeout(timeout)
    }
  })

  if (!vcElement) {
    return null
  }
  const screenGap = 2
  const controlsHeight = 40

  const elementTopPos = containerPos.realTop < 0 ? 0 : containerPos.realTop
  const elementBottomPos = containerPos.bottom > iframeWindow.innerHeight ? iframeWindow.innerHeight : containerPos.bottom
  const visibleHeight = elementBottomPos - elementTopPos

  const centerPosition = elementTopPos + (visibleHeight / 2)
  let topPosition = centerPosition - controlsHeight / 2
  if ((topPosition < (controlsHeight + screenGap * 2)) && (controlsListWidth > innerLeft)) {
    topPosition = controlsHeight + screenGap * 2
  }
  // If element height is too small to center the controls
  topPosition = visibleHeight < 75 ? topPosition - 20 : topPosition

  const handleMouseEnter = () => {
    const hideControlsInterval = layoutStorage.state('hideControlsInterval').get()
    if (hideControlsInterval) {
      clearInterval(hideControlsInterval)
      layoutStorage.state('hideControlsInterval').set(false)
    }
  }

  const styles = {
    top: `${topPosition}px`,
    left: `${containerPos.left}px`,
    width: `${containerPos.width}px`
  }
  const isCenterControls = true

  const controlClasses = classNames({
    'vcv-ui-outline-controls-center': true,
    'vcv-ui-controls-o-controls-right': isControlsRight,
    'vcv-ui-controls-o-controls-left': isControlsLeft
  })
  const isRightClick = false
  return (
    <div
      className={controlClasses}
      style={{...styles}}
      ref={outerRef}>
      <div className='vcv-ui-outline-controls-center-inner' ref={innerRef} onMouseEnter={handleMouseEnter}>
        <MainControl id={id} title={title} icon={icon} />
        <ControlDropdownInner elementId={id} isCenterControls={isCenterControls} isRightClick={isRightClick} />
      </div>
    </div>
  )
}

export default CenterControls
