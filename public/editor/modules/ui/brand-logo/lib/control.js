import React from 'react'

class BrandLogoControl extends React.Component {
  render () {
    // TODO: Make correct link&target http://alpha.visualcomposer.io/wp-admin/?amputm_medium=frontend_editor
    return (
      <a className='vcv-ui-navbar-logo' title='Visual Composer'
        href='javascript:;'>
        <span className='vcv-ui-navbar-logo-title'>Visual Composer</span>
      </a>
    )
  }
}

export default BrandLogoControl
