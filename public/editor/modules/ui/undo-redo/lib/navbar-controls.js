import React from 'react'
import vcCake from 'vc-cake'

class UndoRedoControl extends React.Component {
  state = {
    redoDisabled: true,
    undoDisabled: true
  }

  componentWillMount () {
    this.props.api.reply('data:changed', this.checkControls)
    this.checkControls()
  }

  componentWillUnmount () {
    this.props.api.forget('data:changed', this.checkControls)
  }

  checkControls = () => {
    const TimeMachine = vcCake.getService('time-machine')
    this.setState({
      redoDisabled: !TimeMachine.canRedo(),
      undoDisabled: !TimeMachine.canUndo()
    })
  }

  handleUndo = () => {
    const TimeMachine = vcCake.getService('time-machine')
    !vcCake.getData('lockActivity') && this.props.api.request('data:reset', TimeMachine.undo())
  }

  handleRedo = () => {
    const TimeMachine = vcCake.getService('time-machine')
    !vcCake.getData('lockActivity') && this.props.api.request('data:reset', TimeMachine.redo())
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
UndoRedoControl.propTypes = {
  api: React.PropTypes.object.isRequired
}

export default UndoRedoControl
