import React from 'react'
import vcCake from 'vc-cake'
const content = vcCake.getStorage('content')

export default class UndoRedoControl extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      undoDisabled: true
    }
  }

  componentWillMount () {
    content.state('document').onChange(this.checkControls)
    this.checkControls()
  }

  componentWillUnmount () {
    content.state('document').ignoreChange(this.checkControls)
  }

  checkControls = () => {
    this.setState({
      redoDisabled: !content.state('redo'),
      undoDisabled: !content.state('undo')
    })
  }

  handleUndo = () => {
    content.trigger('undo')
  }

  handleRedo = () => {
    content.trigger('redo')
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
