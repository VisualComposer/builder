import React from 'react'

class AddTemplateControl extends React.Component {
  handleClick (e) {
    e && e.preventDefault()
  }

  render () {
    return (
      <a className='vcv-ui-navbar-control' onClick={this.handleClick.bind(this)} disabled title='Template'
      ><span
        className='vcv-ui-navbar-control-content'
      ><i
        className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-template'
      ></i><span>Template</span></span></a>
    )
  }
}

module.exports = AddTemplateControl
