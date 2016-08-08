'use strict'

import React from 'react'

class AddTemplateControl extends React.Component {
  handleClick = (e) => {
    e && e.preventDefault()
  }

  render () {
    return (
      <a className='vcv-ui-navbar-control' onClick={this.handleClick} disabled='disabled' title='Template'>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-template' />
          <span>Template</span>
        </span>
      </a>
    )
  }
}

export default AddTemplateControl
