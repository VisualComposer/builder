import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import { LoadingOverlayComponentProps } from './types'

const LoadingOverlayComponent = ({ parent, disableNavBar, hideLayoutBar, extraClassNames, isTransparent }: LoadingOverlayComponentProps ) => {

  const el = document.createElement('div')

  const handleMount = (isMounting: boolean) => {
    const modalRoot = document.querySelector(parent || '.vcv-layout-iframe-container')
    if (modalRoot) {
      modalRoot[isMounting ? 'appendChild' : 'removeChild'](el)
    }
    if (disableNavBar) {
      const layoutHeader = document.getElementById('vcv-layout-header')
      if (layoutHeader) {
        layoutHeader.style.pointerEvents = isMounting ? 'none' : ''
      }
    }
    if (hideLayoutBar) {
      document.body.classList[isMounting ? 'add' : 'remove']('vcv-loading-overlay--enabled')
    }
  }

  useEffect(() => {
    handleMount(true)
    return () => {
      handleMount(false)
    };
  }, []);

  const overlayClasses = {
    'vcv-loading-overlay': !isTransparent,
    'vcv-overlay': isTransparent,
    ...extraClassNames || {}
  }

    return ReactDOM.createPortal(
      <div className={classNames(overlayClasses)}>
        {
          !isTransparent ? <div className='vcv-loading-overlay-inner'>
            <div className='vcv-loading-dots-container'>
              <div className='vcv-loading-dot vcv-loading-dot-1' />
              <div className='vcv-loading-dot vcv-loading-dot-2' />
            </div>
          </div> : null
        }
      </div>,
      el
    )
}

export default LoadingOverlayComponent
