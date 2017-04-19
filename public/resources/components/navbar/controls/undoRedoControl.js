import React from 'react'
import {getStorage} from 'vc-cake'
import NavbarContent from '../navbarContent'

const historyStorage = getStorage('history')

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
  }

  componentWillMount () {
    this.checkControls()
    historyStorage.state('canRedo').onChange(this.checkRedoState)
    historyStorage.state('canUndo').onChange(this.checkUndoState)
  }
  componentWillUnmount () {
    historyStorage.state('canRedo').ignoreChange(this.checkRedoState)
    historyStorage.state('canUndo').ignoreChange(this.checkUndoState)
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
    this.checkRedoState(historyStorage.state('canRedo').get())
    this.checkUndoState(historyStorage.state('canUndo').get())
  }
  handleUndo () {
    historyStorage.trigger('undo')
  }

  handleRedo () {
    historyStorage.trigger('redo')
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
