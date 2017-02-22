import React from 'react'
import classNames from 'classnames'
import {setData, onDataChange, ignoreDataChange} from 'vc-cake'

export default class TreeViewControl extends React.Component {
  constructor (props) {
    super(props)
    this.toggleTreeView = this.toggleTreeView.bind(this)
    this.setActiveState = this.setActiveState.bind(this)
  }
  state = {
    isActive: false,
    data: []
  }
  setActiveState (state) {
    this.setState({isActive: state === 'treeView'})
  }
  componentDidMount () {
    onDataChange('workspace:content:start', this.setActiveState)
  }
  componentWillUnmount () {
    ignoreDataChange('workspace:content:start', this.setActiveState)
  }
  toggleTreeView (e) {
    e && e.preventDefault()
    setData('workspace:content:start', !this.state.isActive ? 'treeView' : false)
  }

  render () {
    let controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-state--active': this.state.isActive
    })

    return (
      <a className={controlClass} title='Tree View' onClick={this.toggleTreeView}>
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-layers' />
          <span>Tree View</span>
        </span>
      </a>
    )
  }
}
