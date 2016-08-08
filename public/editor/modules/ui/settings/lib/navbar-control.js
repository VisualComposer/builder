import React from 'react'

class SettingsButtonControl extends React.Component {
  render () {
    return (
      <a className='vcv-ui-navbar-control vcv-ui-pull-end' href='#' title='Settings' disabled
      ><span className='vcv-ui-navbar-control-content'
      ><i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-cog'></i
      ><span>Settings</span></span></a>
    )
  }
}

export default SettingsButtonControl
