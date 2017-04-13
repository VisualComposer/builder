import React from 'react'
import {getStorage} from 'vc-cake'
import NavbarContent from '../navbarContent'

const historyStorage = getStorage('history')
// const elementHistoryStorage = getStorage('elementHistory')
const workspaceStorage = getStorage('workspace')

export default class UndoRedoControl extends NavbarContent {
  constructor (props) {
    super(props)
    this.state = {
      undoDisabled: true,
      redoDisabled: true
    }
    this.checkUndoState = this.checkUndoState.bind(this)
    this.checkRedoState = this.checkRedoState.bind(this)
    this.handleRedo = this.handleRedo.bind(this)
    this.handleUndo = this.handleUndo.bind(this)
    this.checkWorkspaceSettings = this.checkWorkspaceSettings.bind(this)
    this.activeHistory = historyStorage
  }

  componentWillMount () {
    this.checkControls()
    this.activeHistory.state('canRedo').onChange(this.checkRedoState)
    this.activeHistory.state('canUndo').onChange(this.checkUndoState)
    workspaceStorage.state('settings').onChange(this.checkWorkspaceSettings)
  }
  componentWillUnmount () {
    this.activeHistory.state('canRedo').ignoreChange(this.checkRedoState)
    this.activeHistory.state('canUndo').ignoreChange(this.checkUndoState)
    workspaceStorage.state('settings').ignoreChange(this.checkWorkspaceSettings)
  }
  checkUndoState (value) {
    this.setState({
      undoDisabled: !value
    })
  }
  checkRedoState (value) {
    this.setState({
      redoDisabled: !value
    })
  }
  checkControls () {
    this.checkRedoState(this.activeHistory.state('canRedo').get())
    this.checkUndoState(this.activeHistory.state('canUndo').get())
  }
  checkWorkspaceSettings (data) {
    /*
    if (data && data.action === 'edit') {
      this.activeHistory = elementHistoryStorage
    } else {
      this.activeHistory = historyStorage
    }
    */
  }
  handleUndo () {
    this.activeHistory.trigger('undo')
  }

  handleRedo () {
    this.activeHistory.trigger('redo')
  }

  render () {
    return (
      <div className='vcv-ui-navbar-controls-group vcv-ui-navbar-sandwich--stop-close'>
        <a
          className='vcv-ui-navbar-control' href='#' title='Undo' disabled={this.state.undoDisabled}
          onClick={this.handleUndo}
        ><span
          className='vcv-ui-navbar-control-content'
        ><i
          className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-undo' /><span>Undo</span></span></a>
        <a
          className='vcv-ui-navbar-control' href='#' title='Redo' disabled={this.state.redoDisabled}
          onClick={this.handleRedo}
        ><span
          className='vcv-ui-navbar-control-content'
        ><i
          className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-redo' /><span>Redo</span></span></a>
      </div>
    )
  }
}
