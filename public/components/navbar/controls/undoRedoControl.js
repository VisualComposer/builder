import React from 'react'
import { getStorage, getService } from 'vc-cake'
import NavbarContent from '../navbarContent'

const historyStorage = getStorage('history')
const dataManager = getService('dataManager')

export default class UndoRedoControl extends NavbarContent {
  static isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(window.navigator.platform)

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

  /* eslint-disable */
  UNSAFE_componentWillMount () {
    this.checkControls()
    historyStorage.state('canRedo').onChange(this.checkRedoState)
    historyStorage.state('canUndo').onChange(this.checkUndoState)
  }
  /* eslint-enable */

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

  handleUndo (e) {
    e && e.preventDefault()
    historyStorage.state('canUndo').get() && historyStorage.trigger('undo')
  }

  handleRedo (e) {
    e && e.preventDefault()
    historyStorage.state('canRedo').get() && historyStorage.trigger('redo')
  }

  render () {
    const localizations = dataManager.get('localizations')
    const undoName = localizations ? localizations.undo : 'Undo'
    const undoTitleName = UndoRedoControl.isMacLike ? undoName + ' (⌘Z)' : undoName + ' (Ctrl + Z)'
    const redoName = localizations ? localizations.redo : 'Redo'
    const redoTitleName = UndoRedoControl.isMacLike ? redoName + ' (⌘⇧Z)' : redoName + ' (Ctrl + Shift + Z)'

    const redo = (
      <span
        className='vcv-ui-navbar-control'
        title={redoTitleName}
        disabled={this.state.redoDisabled}
        onClick={this.handleRedo}
      >
        <span className='vcv-ui-navbar-control-content'>
          <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-redo' />
          <span>{redoName}</span>
        </span>
      </span>
    )

    const undoRedoControl = (
      <dl className='vcv-ui-navbar-controls-group vcv-ui-navbar-dropdown vcv-ui-navbar-sandwich--stop-close'>
        <dt
          className='vcv-ui-navbar-control vcv-ui-navbar-dropdown-trigger'
          title={undoTitleName}
          disabled={this.state.undoDisabled}
          onClick={this.handleUndo}
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-undo' />
            <span>{undoName}</span>
          </span>
        </dt>
        <dd className='vcv-ui-navbar-dropdown-content vcv-ui-navbar-dropdown-content--sm'>
          {redo}
        </dd>
      </dl>
    )

    const undoRedoControlsInsideDropdown = (
      <div className='vcv-ui-navbar-controls-set vcv-ui-navbar-controls-group vcv-ui-navbar-sandwich--stop-close'>
        <span
          className='vcv-ui-navbar-control'
          title={undoTitleName}
          disabled={this.state.undoDisabled}
          onClick={this.handleUndo}
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className='vcv-ui-navbar-control-icon vcv-ui-icon vcv-ui-icon-undo' />
            <span>{undoName}</span>
          </span>
        </span>
        {redo}
      </div>
    )

    return (
      this.props.insideDropdown ? undoRedoControlsInsideDropdown : undoRedoControl
    )
  }
}
