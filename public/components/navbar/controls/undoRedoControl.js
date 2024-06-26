import React from 'react'
import { getStorage, getService } from 'vc-cake'
import NavbarContent from '../navbarContent'
import classNames from 'classnames'

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

  componentDidMount () {
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

    const containerClasses = classNames({
      'vcv-ui-navbar-dropdown': true,
      'vcv-ui-navbar-controls-group': true,
      'vcv-ui-navbar-sandwich--stop-close': true
    })

    const controlClass = classNames({
      'vcv-ui-navbar-control': true,
      'vcv-ui-navbar-dropdown-trigger': true
    })

    const navbarContentClasses = classNames({
      'vcv-ui-navbar-dropdown-content': true,
      'vcv-ui-navbar-dropdown-content--sm': true,
      'vcv-ui-show-dropdown-content': this.state.showDropdown
    })

    const iconClasses = classNames({
      'vcv-ui-navbar-control-icon': true,
      'vcv-ui-icon': true,
      'vcv-ui-icon-undo': true
    })

    const undoRedoControl = (
      <dl className={containerClasses} onMouseLeave={this.handleDropdownVisibility}>
        <dt
          className={controlClass}
          title={undoTitleName}
          disabled={this.state.undoDisabled}
          onClick={this.handleUndo}
          onMouseEnter={this.handleDropdownVisibility}
        >
          <span className='vcv-ui-navbar-control-content'>
            <i className={iconClasses} />
            <span>{undoName}</span>
          </span>
        </dt>
        <dd className={navbarContentClasses}>
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
