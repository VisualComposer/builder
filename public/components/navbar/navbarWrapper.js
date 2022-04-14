import React, {useState, useEffect} from 'react'
import classNames from 'classnames'
import { getStorage } from 'vc-cake'

const workspaceStorage = getStorage('workspace')

const NavbarWrapper = (props) => {
  const [isDisabled, setDisabled] = useState(true)

  useEffect(() => {
    workspaceStorage.state('navbarDisabled').onChange(handleDisableChange)
    return () => {
      workspaceStorage.state('navbarDisabled').ignoreChange(handleDisableChange)
    }
  })

  const handleDisableChange = (isDisabled) => {
    setDisabled(isDisabled)
  }

  const classes = classNames({
    'vcv-layout-bar-header': true,
    'vcv-layout-bar-header--loading': isDisabled
  })

  return (
    <div ref={props.wrapperRef} className={classes} id='vcv-editor-header'>
      <div id='vc-navbar-container'>
        {props.children}
      </div>
    </div>
  )
}

export default NavbarWrapper
