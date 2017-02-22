import React from 'react'
import classNames from 'classnames'
import {setData, onDataChange, ignoreDataChange} from 'vc-cake'

export default class AddTemplateControl extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      isActive: false
    }
    this.toggleAddTemplate = this.toggleAddTemplate.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }
/*
  componentWillMount () {
    this.props.api
      .reply('bar-content-end:show', this.updateWindow)
      .reply('bar-content-end:hide', this.updateWindow)
  }

  componentWillUnmount () {
    this.props.api
      .reply('bar-content-end:show', this.updateWindow)
      .reply('bar-content-end:hide', this.updateWindow)
  }
*/
  componentDidMount () {
    onDataChange('workspace:content:end', this.setActiveState)
  }
  componentWillUnmount () {
    ignoreDataChange('workspace:content:end', this.setActiveState)
  }
  setActiveState (state) {
    this.setState({ isActive: state === 'addTemplate' })
  }

  toggleAddTemplate (e) {
    e && e.preventDefault()
    setData('workspace:content:end', !this.state.isActive ? 'addTemplate' : false)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <a
        className={controlClass}
        onClick={this.toggleAddTemplate}
        href='#'
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
