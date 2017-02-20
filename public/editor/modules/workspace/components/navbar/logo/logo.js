import React from 'react'
import './css/module.less'
export default class Logo extends React.Component {
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
