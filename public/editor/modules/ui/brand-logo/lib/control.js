import React from 'react'

export default class BrandLogoControl extends React.Component {
  render () {
    return (
      <a
        className='vcv-ui-navbar-logo'
        title='Visual Composer'
        href='http://visualcomposer.io/?utm_campaign=VCWB&utm_source=vc_user&utm_medium=frontend_editor'
        target='_blank'
      >
        <span className='vcv-ui-navbar-logo-title'>Visual Composer</span>
      </a>
    )
  }
}
