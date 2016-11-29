import React from 'react'
import vcCake from 'vc-cake'

export default class AddTemplateControl extends React.Component {
  static propTypes = {
    api: React.PropTypes.object.isRequired,
    value: React.PropTypes.object.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      isWindowOpen: false
    }
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = (e) => {
    e && e.preventDefault()
    console.log(this)
  }

  render () {
    let isDisabled = true
    if (vcCake.env('FEATURE_ADD_ELEMENT_SEARCH')) {
      isDisabled = false
    }
    return (
      <a
        className='vcv-ui-navbar-control'
        onClick={this.handleClick}
        disabled={isDisabled}
        title='Template'
      >
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-template' />
          <span>Template</span>
        </span>
      </a>
    )
  }
}
