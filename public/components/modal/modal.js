import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspace')

const Modal = ({ children, onClose, closeOnOuterClick, show }) => {
  const [innerClick, setInnerClick] = useState(false)

  useEffect(() => {
    window.addEventListener('keyup', handleHideOnOuterClick)
    return () => {
      window.removeEventListener('keyup', handleHideOnOuterClick)
      workspaceStorage.state('hasModal').set(false)
    }
  }, [])

  useEffect(() => {
    workspaceStorage.state('hasModal').set(show)
    document.body.style.overflow = show ? 'hidden' : 'auto'
  }, [show])

  const handleShowOnInnerClick = useCallback(event => {
    if (event.currentTarget && event.currentTarget.closest('.vcv-ui-modal')) {
      setInnerClick(true)
    }
  }, [])

  const handleHideOnOuterClick = useCallback(event => {
    setInnerClick(false)

    if (closeOnOuterClick === false || innerClick) {
      return
    }

    if ((event.target.dataset.modal && onClose instanceof Function) ||
      (event.type === 'keyup' && event.which === 27)) {
      onClose(event)
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

Modal.propTypes = {
  closeOnOuterClick: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default React.memo(Modal)
