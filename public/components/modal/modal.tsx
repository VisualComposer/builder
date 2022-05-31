import React, { useState, useEffect, useCallback } from 'react'
import { getStorage } from 'vc-cake'
import { ModalProps } from './types'

const workspaceStorage = getStorage('workspace')

const Modal = ( { children, onClose, closeOnOuterClick, show }: ModalProps ) => {

  const [innerClick, setInnerClick] = useState<boolean>(false)

  const handleHideOnOuterClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent> | KeyboardEvent): void => {
    setInnerClick(false)

    if (!closeOnOuterClick || innerClick) {
      return
    }

    const { modal } = (event.target as HTMLDivElement).dataset

    if (modal || (event.type === 'keyup' && (event as KeyboardEvent).code === 'Escape')) {
      onClose()
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keyup', handleHideOnOuterClick)
    return () => {
      window.removeEventListener('keyup', handleHideOnOuterClick)
      workspaceStorage.state('hasModal').set(false)
    }
  }, [handleHideOnOuterClick])

  useEffect(() => {
    workspaceStorage.state('hasModal').set(show)
    document.body.style.overflow = show ? 'hidden' : 'auto'
  }, [show])

  const handleShowOnInnerClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    if (event.currentTarget && event.currentTarget.closest('.vcv-ui-modal')) {
      setInnerClick(true)
    }
  }, [])


  if (!show) {
    return null
  }

  return (
    <div className='vcv-ui-modal-overlay' onClick={handleHideOnOuterClick} data-modal='true'>
      <div className='vcv-ui-modal-container' onMouseDown={handleShowOnInnerClick}>
        {children}
      </div>
    </div>
  )
}

export default React.memo(Modal)
