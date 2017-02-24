import React from 'react'
import classNames from 'classnames'
import {getStorage} from 'vc-cake'

const workspaceContentEndState = getStorage('workspace').state('contentEnd')

export default class PlusControl extends React.Component {
  constructor (props) {
    super(props)
    this.toggleAddElement = this.toggleAddElement.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
    this.state = {
      isActive: false
    }
  }
  setActiveState (state) {
    this.setState({isActive: state === 'addElement'})
  }
  componentDidMount () {
    workspaceContentEndState.onChange(this.setActiveState)
  }
  componentWillUnmount () {
    workspaceContentEndState.ignoreChange(this.setActiveState)
  }
  toggleAddElement (e) {
    e && e.preventDefault()
    workspaceContentEndState.set(!this.state.isActive ? 'addElement' : false)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <a className={controlClass} href='#' title='Add Element' onClick={this.toggleAddElement}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-add' />
          <span>Add Element</span>
        </span>
      </a>
    )
  }
}
